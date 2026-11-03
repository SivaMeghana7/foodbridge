const Claim = require('../models/Claim');
const Donation = require('../models/Donation');

// @desc    Claim food from an available donation
// @route   POST /api/claims
// @access  Private (Recipient only)
exports.createClaim = async (req, res, next) => {
  try {
    const { donationId, quantityRequested, contact } = req.body;

    if (!donationId || !quantityRequested) {
      return res.status(400).json({
        success: false,
        message: 'Donation ID and requested quantity are required.',
      });
    }

    const requestedQty = Number(quantityRequested);
    if (isNaN(requestedQty) || requestedQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity must be a positive number.',
      });
    }

    const now = new Date();

    // Check donation existence first for clear error messaging
    const existingDonation = await Donation.findById(donationId);
    if (!existingDonation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation not found.',
      });
    }

    // Check if current user is trying to claim their own donation
    if (existingDonation.donorId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot claim food from your own donation.',
      });
    }

    if (new Date(existingDonation.availableUntil) <= now) {
      return res.status(400).json({
        success: false,
        message: 'This food donation has expired and is no longer available.',
      });
    }

    const remaining = existingDonation.quantity - existingDonation.claimedQuantity;
    if (requestedQty > remaining) {
      return res.status(400).json({
        success: false,
        message: `Only ${remaining} ${existingDonation.unit} remaining. You cannot request ${requestedQty} ${existingDonation.unit}.`,
      });
    }

    // Atomic find and increment to prevent race conditions / concurrent overclaiming
    const updatedDonation = await Donation.findOneAndUpdate(
      {
        _id: donationId,
        status: { $in: ['Available', 'Partially Claimed'] },
        availableUntil: { $gt: now },
        $expr: {
          $gte: [
            { $subtract: ['$quantity', '$claimedQuantity'] },
            requestedQty,
          ],
        },
      },
      {
        $inc: { claimedQuantity: requestedQty },
      },
      { returnDocument: 'after' }
    );

    if (!updatedDonation) {
      return res.status(400).json({
        success: false,
        message:
          'Unable to reserve the requested quantity. The food may have just been claimed by another user.',
      });
    }

    // Update status based on new claimedQuantity
    if (updatedDonation.claimedQuantity >= updatedDonation.quantity) {
      updatedDonation.status = 'Fully Claimed';
    } else {
      updatedDonation.status = 'Partially Claimed';
    }
    await updatedDonation.save();

    // Create the Claim record
    const claim = await Claim.create({
      donationId,
      recipientId: req.user._id,
      recipientName: req.user.fullName,
      contact: contact ? contact.trim() : req.user.phone,
      quantityRequested: requestedQty,
      status: 'Confirmed',
    });

    res.status(201).json({
      success: true,
      message: `Successfully reserved ${requestedQty} ${updatedDonation.unit}!`,
      claim,
      donation: updatedDonation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims made by logged-in recipient
// @route   GET /api/claims/my
// @access  Private (Recipient only)
exports.getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ recipientId: req.user._id })
      .populate({
        path: 'donationId',
        select:
          'foodName category imageUrl pickupLocation contact donorName unit status availableUntil',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claims received for donor's donations
// @route   GET /api/claims/received
// @access  Private (Donor only)
exports.getClaimsReceived = async (req, res, next) => {
  try {
    // 1. Get all donations created by this donor
    const donorDonations = await Donation.find({ donorId: req.user._id }).select(
      '_id'
    );
    const donationIds = donorDonations.map((d) => d._id);

    // 2. Find all claims for these donations
    const claims = await Claim.find({ donationId: { $in: donationIds } })
      .populate('donationId', 'foodName category unit pickupLocation status')
      .populate('recipientId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a confirmed claim and restore donation quantity
// @route   PATCH /api/claims/:id/cancel
// @access  Private (Recipient only - owner of claim)
exports.cancelClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Ownership check
    if (claim.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this claim.',
      });
    }

    if (claim.status !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: `Claim cannot be cancelled because it is already '${claim.status}'.`,
      });
    }

    // Update claim status to Cancelled
    claim.status = 'Cancelled';
    await claim.save();

    // Restore donation quantity atomically
    const donation = await Donation.findByIdAndUpdate(
      claim.donationId,
      { $inc: { claimedQuantity: -claim.quantityRequested } },
      { returnDocument: 'after' }
    );

    if (donation) {
      // Ensure claimedQuantity doesn't go below 0
      if (donation.claimedQuantity < 0) {
        donation.claimedQuantity = 0;
      }

      // Restore status
      const now = new Date();
      if (donation.availableUntil && new Date(donation.availableUntil) < now) {
        donation.status = 'Expired';
      } else if (donation.claimedQuantity >= donation.quantity) {
        donation.status = 'Fully Claimed';
      } else if (donation.claimedQuantity > 0) {
        donation.status = 'Partially Claimed';
      } else {
        donation.status = 'Available';
      }

      await donation.save();
    }

    res.status(200).json({
      success: true,
      message: 'Claim has been cancelled and the food quantity was restored.',
      claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a claim as collected after pickup
// @route   PATCH /api/claims/:id/collect
// @access  Private (Donor only - owner of donation)
exports.collectClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate('donationId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Donor ownership check
    if (!claim.donationId || claim.donationId.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to manage claims for this donation.',
      });
    }

    if (claim.status !== 'Confirmed') {
      return res.status(400).json({
        success: false,
        message: `Claim is already marked as '${claim.status}'.`,
      });
    }

    claim.status = 'Collected';
    await claim.save();

    // Check if all confirmed claims on this donation are collected
    const pendingClaims = await Claim.countDocuments({
      donationId: claim.donationId._id,
      status: 'Confirmed',
    });

    if (
      pendingClaims === 0 &&
      claim.donationId.claimedQuantity >= claim.donationId.quantity
    ) {
      claim.donationId.status = 'Collected';
      await claim.donationId.save();
    }

    res.status(200).json({
      success: true,
      message: 'Food pickup marked as Collected successfully!',
      claim,
    });
  } catch (error) {
    next(error);
  }
};


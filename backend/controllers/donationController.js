const Donation = require('../models/Donation');
const Claim = require('../models/Claim');

// @desc    Create a new food donation
// @route   POST /api/donations
// @access  Private (Donor only)
exports.createDonation = async (req, res, next) => {
  try {
    const {
      foodName,
      category,
      description,
      quantity,
      unit,
      imageUrl,
      pickupLocation,
      contact,
      availableUntil,
    } = req.body;

    if (
      !foodName ||
      !category ||
      !description ||
      !quantity ||
      !unit ||
      !pickupLocation ||
      !availableUntil
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    const expiryDate = new Date(availableUntil);
    if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Available until date and time must be a future time.',
      });
    }

    const donation = await Donation.create({
      donorId: req.user._id,
      donorName: req.user.fullName,
      contact: contact || req.user.phone,
      foodName: foodName.trim(),
      category,
      description: description.trim(),
      quantity: Number(quantity),
      unit,
      imageUrl:
        imageUrl && imageUrl.trim().length > 0
          ? imageUrl.trim()
          : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      pickupLocation: pickupLocation.trim(),
      availableUntil: expiryDate,
      status: 'Available',
      claimedQuantity: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Donation created successfully!',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all available donations (Explore Food)
// @route   GET /api/donations
// @access  Public / Authenticated
exports.getDonations = async (req, res, next) => {
  try {
    const { search, category, location, status } = req.query;

    const query = {};
    const now = new Date();

    // Only show active & unexpired items by default unless explicitly asked
    if (status) {
      query.status = status;
    } else {
      query.status = { $in: ['Available', 'Partially Claimed'] };
      query.availableUntil = { $gt: now };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter
    if (search && search.trim() !== '') {
      query.$or = [
        { foodName: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { pickupLocation: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Location filter
    if (location && location.trim() !== '') {
      query.pickupLocation = { $regex: location.trim(), $options: 'i' };
    }

    // Exclude fully claimed donations where claimedQuantity >= quantity
    if (!status) {
      query.$expr = { $gt: ['$quantity', '$claimedQuantity'] };
    }

    const donations = await Donation.find(query)
      .populate('donorId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donations created by logged-in donor
// @route   GET /api/donations/my
// @access  Private (Donor only)
exports.getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public / Authenticated
exports.getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      'donorId',
      'fullName email phone'
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a donation
// @route   PUT /api/donations/:id
// @access  Private (Donor only - owner)
exports.updateDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Ensure logged-in user is the donor
    if (donation.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this donation.',
      });
    }

    const {
      foodName,
      category,
      description,
      quantity,
      unit,
      imageUrl,
      pickupLocation,
      contact,
      availableUntil,
    } = req.body;

    // Check if new quantity is less than already claimed quantity
    if (quantity !== undefined && Number(quantity) < donation.claimedQuantity) {
      return res.status(400).json({
        success: false,
        message: `Quantity cannot be reduced below the already claimed amount of ${donation.claimedQuantity} ${donation.unit}.`,
      });
    }

    if (foodName) donation.foodName = foodName.trim();
    if (category) donation.category = category;
    if (description) donation.description = description.trim();
    if (quantity !== undefined) donation.quantity = Number(quantity);
    if (unit) donation.unit = unit;
    if (imageUrl) donation.imageUrl = imageUrl.trim();
    if (pickupLocation) donation.pickupLocation = pickupLocation.trim();
    if (contact) donation.contact = contact.trim();
    if (availableUntil) donation.availableUntil = new Date(availableUntil);

    // Sync status based on new quantity
    donation.syncStatus();

    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private (Donor only - owner)
exports.deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Ownership check
    if (donation.donorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this donation.',
      });
    }

    // Check for active confirmed claims
    const activeClaim = await Claim.findOne({
      donationId: req.params.id,
      status: 'Confirmed',
    });

    if (activeClaim) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot delete this donation because there are active confirmed claims on it. The claims must be completed or cancelled first.',
      });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Donation removed successfully',
    });
  } catch (error) {
    next(error);
  }
};


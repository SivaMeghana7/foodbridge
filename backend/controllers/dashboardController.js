const Donation = require('../models/Donation');
const Claim = require('../models/Claim');

// @desc    Get metrics and recent data for Donor Dashboard
// @route   GET /api/dashboard/donor
// @access  Private (Donor only)
exports.getDonorDashboard = async (req, res, next) => {
  try {
    const donorId = req.user._id;

    const donations = await Donation.find({ donorId });

    const totalDonations = donations.length;

    const now = new Date();
    const availableDonations = donations.filter(
      (d) =>
        ['Available', 'Partially Claimed'].includes(d.status) &&
        new Date(d.availableUntil) > now &&
        d.quantity > d.claimedQuantity
    ).length;

    const totalQuantityDonated = donations.reduce(
      (acc, curr) => acc + (curr.quantity || 0),
      0
    );

    const totalQuantityClaimed = donations.reduce(
      (acc, curr) => acc + (curr.claimedQuantity || 0),
      0
    );

    // Recent 5 donations
    const recentDonations = await Donation.find({ donorId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 claims received
    const donationIds = donations.map((d) => d._id);
    const recentClaims = await Claim.find({ donationId: { $in: donationIds } })
      .populate('donationId', 'foodName unit')
      .populate('recipientId', 'fullName phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Status distribution
    const statusCounts = {
      Available: 0,
      PartiallyClaimed: 0,
      FullyClaimed: 0,
      Collected: 0,
      Expired: 0,
    };

    donations.forEach((d) => {
      if (d.status === 'Available') statusCounts.Available += 1;
      else if (d.status === 'Partially Claimed') statusCounts.PartiallyClaimed += 1;
      else if (d.status === 'Fully Claimed') statusCounts.FullyClaimed += 1;
      else if (d.status === 'Collected') statusCounts.Collected += 1;
      else if (d.status === 'Expired') statusCounts.Expired += 1;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalDonations,
        availableDonations,
        totalQuantityDonated,
        totalQuantityClaimed,
        statusCounts,
      },
      recentDonations,
      recentClaims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get metrics and recent data for Recipient Dashboard
// @route   GET /api/dashboard/recipient
// @access  Private (Recipient only)
exports.getRecipientDashboard = async (req, res, next) => {
  try {
    const recipientId = req.user._id;

    const claims = await Claim.find({ recipientId });

    const totalClaims = claims.length;
    const activeClaims = claims.filter((c) => c.status === 'Confirmed').length;
    const completedPickups = claims.filter((c) => c.status === 'Collected').length;
    const cancelledClaims = claims.filter((c) => c.status === 'Cancelled').length;

    const totalQuantityClaimed = claims
      .filter((c) => c.status !== 'Cancelled')
      .reduce((acc, curr) => acc + (curr.quantityRequested || 0), 0);

    // Recent 5 claims
    const recentClaims = await Claim.find({ recipientId })
      .populate({
        path: 'donationId',
        select: 'foodName unit pickupLocation availableUntil imageUrl status',
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recommended available food (up to 4 items)
    const now = new Date();
    const recommendedFood = await Donation.find({
      status: { $in: ['Available', 'Partially Claimed'] },
      availableUntil: { $gt: now },
      $expr: { $gt: ['$quantity', '$claimedQuantity'] },
    })
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      stats: {
        totalClaims,
        activeClaims,
        completedPickups,
        cancelledClaims,
        totalQuantityClaimed,
      },
      recentClaims,
      recommendedFood,
    });
  } catch (error) {
    next(error);
  }
};


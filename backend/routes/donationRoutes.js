const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
} = require('../controllers/donationController');
const { protect, isDonor } = require('../middleware/authMiddleware');

// Public or explore route
router.get('/', getDonations);

// Donor-specific list
router.get('/my', protect, isDonor, getMyDonations);

// Create donation
router.post('/', protect, isDonor, createDonation);

// Single donation details
router.get('/:id', getDonationById);

// Update donation
router.put('/:id', protect, isDonor, updateDonation);

// Delete donation
router.delete('/:id', protect, isDonor, deleteDonation);

module.exports = router;


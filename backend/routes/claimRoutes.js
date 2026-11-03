const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getClaimsReceived,
  cancelClaim,
  collectClaim,
} = require('../controllers/claimController');
const { protect, isRecipient, isDonor } = require('../middleware/authMiddleware');

// Recipient routes
router.post('/', protect, isRecipient, createClaim);
router.get('/my', protect, isRecipient, getMyClaims);
router.patch('/:id/cancel', protect, isRecipient, cancelClaim);

// Donor routes
router.get('/received', protect, isDonor, getClaimsReceived);
router.patch('/:id/collect', protect, isDonor, collectClaim);

module.exports = router;


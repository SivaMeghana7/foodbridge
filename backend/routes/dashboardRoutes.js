const express = require('express');
const router = express.Router();
const {
  getDonorDashboard,
  getRecipientDashboard,
} = require('../controllers/dashboardController');
const { protect, isDonor, isRecipient } = require('../middleware/authMiddleware');

router.get('/donor', protect, isDonor, getDonorDashboard);
router.get('/recipient', protect, isRecipient, getRecipientDashboard);

module.exports = router;


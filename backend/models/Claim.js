const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: [true, 'Donation ID is required'],
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
      index: true,
    },
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Recipient contact is required'],
      trim: true,
    },
    quantityRequested: {
      type: Number,
      required: [true, 'Quantity requested is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    status: {
      type: String,
      enum: {
        values: ['Confirmed', 'Collected', 'Cancelled'],
        message: '{VALUE} is not a valid claim status',
      },
      default: 'Confirmed',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help queries
claimSchema.index({ recipientId: 1, createdAt: -1 });
claimSchema.index({ donationId: 1, createdAt: -1 });

module.exports = mongoose.model('Claim', claimSchema);


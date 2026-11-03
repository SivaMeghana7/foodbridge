const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required'],
      index: true,
    },
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      maxlength: [120, 'Food name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Cooked Food',
          'Bakery',
          'Fruits',
          'Vegetables',
          'Dairy',
          'Packaged Food',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      enum: {
        values: ['Meals', 'Kg', 'Packets', 'Boxes', 'Litres'],
        message: '{VALUE} is not a valid unit',
      },
    },
    imageUrl: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    },
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    availableUntil: {
      type: Date,
      required: [true, 'Available until date and time is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          'Available',
          'Partially Claimed',
          'Fully Claimed',
          'Collected',
          'Expired',
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
      index: true,
    },
    claimedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Claimed quantity cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for remaining quantity
donationSchema.virtual('remainingQuantity').get(function () {
  const remaining = (this.quantity || 0) - (this.claimedQuantity || 0);
  return remaining > 0 ? remaining : 0;
});

// Helper to auto-update status based on claimed quantity and expiry
donationSchema.methods.syncStatus = function () {
  const now = new Date();
  if (this.status === 'Collected') return;
  if (this.availableUntil && new Date(this.availableUntil) < now) {
    this.status = 'Expired';
    return;
  }
  if (this.claimedQuantity >= this.quantity) {
    this.status = 'Fully Claimed';
  } else if (this.claimedQuantity > 0) {
    this.status = 'Partially Claimed';
  } else {
    this.status = 'Available';
  }
};

module.exports = mongoose.model('Donation', donationSchema);


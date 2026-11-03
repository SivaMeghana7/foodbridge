import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  MapPin,
  Calendar,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const PRESET_IMAGES = [
  {
    label: 'Prepared Meals',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Bakery & Bread',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Fresh Produce',
    url: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Dairy & Milk',
    url: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Pantry & Packaged',
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  },
];

const DonateFood = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow by default for availableUntil
  const defaultAvailableUntil = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(20, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Cooked Food',
    description: '',
    quantity: '',
    unit: 'Meals',
    imageUrl: PRESET_IMAGES[0].url,
    pickupLocation: '',
    contact: user?.phone || '',
    availableUntil: defaultAvailableUntil(),
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Cooked Food',
    'Bakery',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Packaged Food',
    'Other',
  ];

  const units = ['Meals', 'Kg', 'Packets', 'Boxes', 'Litres'];

  const validate = () => {
    const errs = {};
    if (!formData.foodName.trim()) {
      errs.foodName = 'Food name is required';
    }
    if (!formData.category) {
      errs.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please provide a brief description of the food';
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      errs.quantity = 'Please enter a valid quantity greater than 0';
    }
    if (!formData.unit) {
      errs.unit = 'Unit is required';
    }
    if (!formData.pickupLocation.trim()) {
      errs.pickupLocation = 'Pickup address / instructions are required';
    }
    if (!formData.contact.trim()) {
      errs.contact = 'Contact phone number is required';
    }
    if (!formData.availableUntil) {
      errs.availableUntil = 'Please specify pickup deadline';
    } else {
      const selectedDate = new Date(formData.availableUntil);
      if (selectedDate <= new Date()) {
        errs.availableUntil = 'Expiry / availability deadline must be in the future';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');

    try {
      const res = await api.post('/donations', {
        ...formData,
        quantity: Number(formData.quantity),
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-donations');
        }, 1200);
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Failed to submit food donation'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAFAF7]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-5xl overflow-y-auto">
        {/* Page Heading */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            New Donation Listing
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
            Share your surplus food.
          </h1>
          <p className="text-sm text-[#788078] mt-1">
            Your extra food can make someone's day better. Fill out the details below to publish your listing.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Donation posted successfully! Redirecting to My Donations...</span>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E9ECE5] p-6 sm:p-10 shadow-xs space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Food Name / Item Title *
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Freshly Baked Sourdough Loaves"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                  errors.foodName ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                }`}
              />
              {errors.foodName && (
                <p className="text-xs text-red-600 mt-1">{errors.foodName}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Food Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] bg-white transition"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
              Description & Preparation Info *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Surplus from lunchtime catering. Kept refrigerated at 4°C, vegetarian, freshly prepared today at 11 AM."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                errors.description ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Quantity Available *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 25"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                  errors.quantity ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                }`}
              />
              {errors.quantity && (
                <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Unit of Measure *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] bg-white transition"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL & Preset Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
              Food Image URL or Choose Preset
            </label>
            <div className="flex gap-3 mb-2">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2 rounded-xl border border-[#E9ECE5] text-xs text-[#24352B] focus:outline-none focus:border-[#176B45]"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="text-xs text-[#788078] font-medium mr-1">Presets:</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData((p) => ({ ...p, imageUrl: preset.url }))}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    formData.imageUrl === preset.url
                      ? 'border-[#176B45] bg-[#F0F3ED] text-[#176B45] font-bold'
                      : 'border-[#E9ECE5] text-[#788078] hover:bg-gray-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="w-32 h-20 rounded-xl overflow-hidden border border-[#E9ECE5] bg-gray-50">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            )}
          </div>

          {/* Location & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Pickup Address / Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="e.g. 104 Main Street, Kitchen Back Entrance"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.pickupLocation ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
              </div>
              {errors.pickupLocation && (
                <p className="text-xs text-red-600 mt-1">{errors.pickupLocation}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Contact Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. +1 555 987 6543"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.contact ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
              </div>
              {errors.contact && (
                <p className="text-xs text-red-600 mt-1">{errors.contact}</p>
              )}
            </div>
          </div>

          {/* Available Until Date & Time */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
              Available Until (Pickup Deadline) *
            </label>
            <div className="relative max-w-sm">
              <Calendar className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
              <input
                type="datetime-local"
                name="availableUntil"
                value={formData.availableUntil}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                  errors.availableUntil ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                }`}
              />
            </div>
            {errors.availableUntil && (
              <p className="text-xs text-red-600 mt-1">{errors.availableUntil}</p>
            )}
            <p className="text-[11px] text-[#788078] mt-1">
              Food items will be automatically marked as Expired once this deadline passes.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#E9ECE5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/my-donations')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="btn-primary py-2.5 px-6 shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing Donation...
                </>
              ) : (
                'Publish Food Donation'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default DonateFood;


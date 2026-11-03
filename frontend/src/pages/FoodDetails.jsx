import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  User,
  Phone,
  Package,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim Form state
  const [claimQty, setClaimQty] = useState('1');
  const [claimContact, setClaimContact] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const fetchDonationDetails = async () => {
    try {
      const res = await api.get(`/donations/${id}`);
      if (res.data.success) {
        setDonation(res.data.donation);
        if (user) {
          setClaimContact(user.phone || '');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Food donation not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationDetails();
  }, [id, user]);

  const remaining = donation
    ? Math.max(0, (donation.quantity || 0) - (donation.claimedQuantity || 0))
    : 0;

  const isExpired = donation
    ? new Date(donation.availableUntil) <= new Date()
    : false;

  const canClaim =
    user &&
    user.role === 'Recipient' &&
    remaining > 0 &&
    !isExpired &&
    donation?.status !== 'Fully Claimed' &&
    donation?.status !== 'Collected';

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');

    if (!user) {
      navigate('/login', { state: { from: `/food/${id}` } });
      return;
    }

    if (user.role !== 'Recipient') {
      setClaimError('Only registered Recipient accounts can claim food portions.');
      return;
    }

    const qty = Number(claimQty);
    if (isNaN(qty) || qty <= 0) {
      setClaimError('Please enter a valid quantity of at least 1.');
      return;
    }

    if (qty > remaining) {
      setClaimError(`Cannot request more than remaining ${remaining} ${donation.unit}.`);
      return;
    }

    setClaiming(true);

    try {
      const res = await api.post('/claims', {
        donationId: id,
        quantityRequested: qty,
        contact: claimContact || user.phone,
      });

      if (res.data.success) {
        setClaimSuccess(true);
        setTimeout(() => {
          navigate('/my-claims');
        }, 1500);
      }
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to claim food donation.');
    } finally {
      setClaiming(false);
    }
  };

  const formatDateTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading donation details..." />;
  }

  if (error || !donation) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAF7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E9ECE5] p-8 text-center shadow-xs">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#24352B] mb-2">Item Not Found</h2>
          <p className="text-sm text-[#788078] mb-6">{error || 'This listing does not exist.'}</p>
          <Link to="/explore" className="btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAF7] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#788078] hover:text-[#176B45] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Image Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E9ECE5] bg-white shadow-xs h-72 sm:h-96">
              <img
                src={donation.imageUrl}
                alt={donation.foodName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-4 left-4">
                <span
                  className={
                    donation.status === 'Available'
                      ? 'badge-available'
                      : donation.status === 'Partially Claimed'
                      ? 'badge-partially'
                      : donation.status === 'Fully Claimed'
                      ? 'badge-claimed'
                      : donation.status === 'Collected'
                      ? 'badge-collected'
                      : 'badge-expired'
                  }
                >
                  {donation.status}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-[#24352B] shadow-xs">
                {donation.category}
              </div>
            </div>

            {/* Title & Description Card */}
            <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E9ECE5] pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A]">
                  {donation.foodName}
                </h1>
                <span className="text-xs font-semibold text-[#788078]">
                  Listed {new Date(donation.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#788078] mb-1">
                  Food Details & Preparation
                </h4>
                <p className="text-sm text-[#24352B] leading-relaxed whitespace-pre-line">
                  {donation.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E9ECE5]">
                <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E9ECE5]">
                  <span className="block text-[11px] font-bold uppercase text-[#788078]">
                    Total Donated
                  </span>
                  <span className="text-base font-bold text-[#24352B]">
                    {donation.quantity} {donation.unit}
                  </span>
                </div>

                <div className="p-3 bg-[#FAFAF7] rounded-xl border border-[#E9ECE5]">
                  <span className="block text-[11px] font-bold uppercase text-[#788078]">
                    Already Claimed
                  </span>
                  <span className="text-base font-bold text-[#D97706]">
                    {donation.claimedQuantity || 0} {donation.unit}
                  </span>
                </div>

                <div className="p-3 bg-[#F0F3ED] rounded-xl border border-[#E9ECE5]">
                  <span className="block text-[11px] font-bold uppercase text-[#176B45]">
                    Remaining
                  </span>
                  <span className="text-base font-extrabold text-[#176B45]">
                    {remaining} {donation.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor & Pickup Information */}
            <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#1E382A]">
                Pickup & Contact Instructions
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#24352B]">
                      {donation.donorName}
                    </span>
                    <span className="text-xs text-[#788078]">Verified Food Donor</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#24352B]">
                      {donation.pickupLocation}
                    </span>
                    <span className="text-xs text-[#788078]">Pickup Location</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#24352B]">
                      {donation.contact}
                    </span>
                    <span className="text-xs text-[#788078]">Donor Contact Phone</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-[#24352B]">
                      {formatDateTime(donation.availableUntil)}
                    </span>
                    <span className="text-xs text-[#788078]">Pickup Deadline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action / Claim Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 sm:p-8 shadow-md sticky top-28">
              <h3 className="text-xl font-bold text-[#1E382A] mb-1">
                Claim Available Food
              </h3>
              <p className="text-xs text-[#788078] mb-6">
                Reserve the portions you need before the pickup deadline.
              </p>

              {claimSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Reservation confirmed!</p>
                    <p className="text-xs mt-0.5">Redirecting to your claims...</p>
                  </div>
                </div>
              )}

              {claimError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{claimError}</span>
                </div>
              )}

              {/* Status Checks */}
              {isExpired ? (
                <div className="p-4 bg-gray-100 rounded-xl text-center text-sm font-semibold text-gray-600">
                  This food donation has expired and cannot be claimed.
                </div>
              ) : remaining <= 0 ? (
                <div className="p-4 bg-[#FFF8E1] border border-[#FDE68A] rounded-xl text-center text-sm font-semibold text-[#D97706]">
                  All portions of this food have been claimed.
                </div>
              ) : !user ? (
                /* Unauthenticated State */
                <div className="space-y-4">
                  <div className="p-4 bg-[#F0F3ED] rounded-xl border border-[#E9ECE5] text-xs text-[#24352B] leading-relaxed">
                    You must sign in with a Recipient account to reserve food from this donation.
                  </div>
                  <button
                    onClick={() => navigate('/login', { state: { from: `/food/${id}` } })}
                    className="btn-primary w-full py-3 text-sm justify-center shadow-sm"
                  >
                    Sign in to Claim Food
                  </button>
                  <p className="text-center text-xs text-[#788078]">
                    New to FoodBridge?{' '}
                    <Link
                      to="/register"
                      state={{ from: `/food/${id}` }}
                      className="font-bold text-[#176B45] hover:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              ) : user.role === 'Donor' ? (
                /* Donor logged in trying to claim */
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-start gap-2 text-amber-800 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      You are currently logged in as a <strong>Donor</strong>. Food claiming is reserved for Recipient accounts.
                    </span>
                  </div>
                  <Link
                    to="/donor/dashboard"
                    className="btn-secondary w-full py-2 text-xs justify-center text-center block"
                  >
                    Go to Donor Dashboard
                  </Link>
                </div>
              ) : (
                /* Recipient Claim Form */
                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                      Quantity to Request ({donation.unit}) *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max={remaining}
                        step="1"
                        value={claimQty}
                        onChange={(e) => setClaimQty(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
                      />
                      <button
                        type="button"
                        onClick={() => setClaimQty(String(remaining))}
                        className="btn-secondary text-xs py-2.5 px-3 shrink-0"
                      >
                        Claim All ({remaining})
                      </button>
                    </div>
                    <span className="text-[11px] text-[#788078] mt-1 block">
                      Max available: {remaining} {donation.unit}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                      Your Contact Number for Pickup Coordination
                    </label>
                    <input
                      type="tel"
                      value={claimContact}
                      onChange={(e) => setClaimContact(e.target.value)}
                      placeholder="e.g. +1 555 456 7890"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
                    />
                  </div>

                  <div className="p-3 bg-[#F0F3ED] rounded-xl text-xs text-[#24352B] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#176B45] shrink-0 mt-0.5" />
                    <span>
                      Submitting this claim reserves your requested portion immediately. Please ensure pickup before deadline.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={claiming || claimSuccess}
                    className="btn-primary w-full py-3 text-base shadow-sm justify-center"
                  >
                    {claiming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming Claim...
                      </>
                    ) : (
                      'Confirm Claim'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;


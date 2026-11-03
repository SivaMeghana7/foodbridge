import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Cancel Modal State
  const [cancellingClaimId, setCancellingClaimId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchMyClaims = async () => {
    try {
      const res = await api.get('/claims/my');
      if (res.data.success) {
        setClaims(res.data.claims || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const handleCancelClaim = async (id) => {
    setIsCancelling(true);
    setError('');

    try {
      const res = await api.patch(`/claims/${id}/cancel`);
      if (res.data.success) {
        setActionSuccess('Claim cancelled successfully and food quantity restored.');
        setCancellingClaimId(null);
        fetchMyClaims();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel claim');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAFAF7]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E9ECE5] gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
              Food Reservations
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
              My Claims
            </h1>
            <p className="text-sm text-[#788078] mt-1">
              View your reserved food portions, pickup addresses, and order statuses.
            </p>
          </div>

          <Link to="/explore" className="btn-primary self-start sm:self-auto py-2.5 px-4 shadow-sm">
            <Search className="w-4 h-4" />
            Find More Food
          </Link>
        </div>

        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Fetching your claims..." />
        ) : claims.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="You haven't claimed any food yet"
            description="Explore available donations in your community to reserve fresh meals and groceries for pickup."
            actionText="Explore Available Food"
            actionLink="/explore"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claims.map((claim) => {
              const donation = claim.donationId;
              return (
                <div
                  key={claim._id}
                  className="card-foodbridge bg-white flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-44 w-full bg-[#F0F3ED] overflow-hidden">
                      <img
                        src={
                          donation?.imageUrl ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={donation?.foodName || 'Donation'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={
                            claim.status === 'Confirmed'
                              ? 'badge-available'
                              : claim.status === 'Collected'
                              ? 'badge-collected'
                              : 'badge-cancelled'
                          }
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#24352B] line-clamp-1">
                          {donation?.foodName || 'Food Item'}
                        </h3>
                        <p className="text-xs text-[#788078] font-medium mt-0.5">
                          Claimed on {new Date(claim.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Reserved Quantity Highlight */}
                      <div className="p-3 bg-[#F0F3ED] rounded-xl border border-[#E9ECE5] flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#24352B]">
                          Your Reserved Quantity:
                        </span>
                        <span className="font-extrabold text-sm text-[#176B45]">
                          {claim.quantityRequested} {donation?.unit || 'portions'}
                        </span>
                      </div>

                      {/* Donor & Pickup Info */}
                      <div className="space-y-2 text-xs text-[#788078]">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
                          <span className="truncate">
                            Donor: {donation?.donorName || 'Community Donor'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
                          <span>Donor Contact: {donation?.contact || 'N/A'}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#176B45] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {donation?.pickupLocation || 'Check details'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-5 pt-0 border-t border-[#E9ECE5]/60 mt-2">
                    <div className="flex items-center justify-between gap-2 pt-3">
                      {donation?._id ? (
                        <Link
                          to={`/food/${donation._id}`}
                          className="btn-secondary text-xs py-2 px-3 text-center flex-1"
                        >
                          View Listing
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">Listing Closed</span>
                      )}

                      {claim.status === 'Confirmed' && (
                        <button
                          onClick={() => setCancellingClaimId(claim._id)}
                          className="text-xs text-red-600 hover:text-red-700 font-bold py-2 px-3 rounded-lg border border-red-200 hover:bg-red-50 transition"
                        >
                          Cancel Claim
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingClaimId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-[#E9ECE5] max-w-sm w-full p-6 text-center shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#24352B]">
                Cancel Food Claim?
              </h3>
              <p className="text-xs text-[#788078] leading-relaxed">
                Cancelling this claim will immediately restore your reserved quantity back to the donor's available inventory for other community members to claim.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingClaimId(null)}
                  className="btn-secondary text-xs justify-center"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={() => handleCancelClaim(cancellingClaimId)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 px-4 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyClaims;


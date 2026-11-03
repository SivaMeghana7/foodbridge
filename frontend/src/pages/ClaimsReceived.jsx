import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Calendar,
  Check,
  Package,
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const ClaimsReceived = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchReceivedClaims = async () => {
    try {
      const res = await api.get('/claims/received');
      if (res.data.success) {
        setClaims(res.data.claims || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load received claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedClaims();
  }, []);

  const handleMarkCollected = async (claimId) => {
    setProcessingId(claimId);
    setError('');

    try {
      const res = await api.patch(`/claims/${claimId}/collect`);
      if (res.data.success) {
        setActionSuccess('Pickup verified and marked as Collected!');
        fetchReceivedClaims();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update claim status');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAFAF7]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {/* Header */}
        <div className="pb-6 border-b border-[#E9ECE5] mb-8">
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            Pickup Coordination
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
            Claims Received
          </h1>
          <p className="text-sm text-[#788078] mt-1">
            Review food claims reserved by community members and mark orders as collected upon physical handover.
          </p>
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
          <Loading message="Fetching received claims..." />
        ) : claims.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No claims received yet"
            description="When community members or organizations claim portions of your food donations, their requests will appear here for pickup verification."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E9ECE5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAFAF7] border-b border-[#E9ECE5] text-[#788078] uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Food Item</th>
                    <th className="py-3.5 px-4">Recipient Name</th>
                    <th className="py-3.5 px-4">Recipient Contact</th>
                    <th className="py-3.5 px-4">Quantity Reserved</th>
                    <th className="py-3.5 px-4">Date Claimed</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Pickup Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9ECE5]">
                  {claims.map((claim) => (
                    <tr key={claim._id} className="hover:bg-[#FAFAF7]/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sm text-[#24352B] block">
                          {claim.donationId?.foodName || 'Donation Listing'}
                        </span>
                        <span className="text-[11px] text-[#788078]">
                          {claim.donationId?.category || 'Surplus'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-[#24352B] font-semibold">
                          <User className="w-3.5 h-3.5 text-[#176B45]" />
                          <span>{claim.recipientName || claim.recipientId?.fullName}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[#788078]">
                          <Phone className="w-3.5 h-3.5 text-[#176B45]" />
                          <span>{claim.contact || claim.recipientId?.phone || 'N/A'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sm text-[#176B45]">
                          {claim.quantityRequested}{' '}
                          <span className="text-xs text-[#788078] font-normal">
                            {claim.donationId?.unit || 'units'}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#788078]">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
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
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {claim.status === 'Confirmed' ? (
                          <button
                            onClick={() => handleMarkCollected(claim._id)}
                            disabled={processingId === claim._id}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {processingId === claim._id ? 'Updating...' : 'Mark Collected'}
                          </button>
                        ) : (
                          <span className="text-xs text-[#788078] italic font-medium">
                            {claim.status === 'Collected'
                              ? 'Fulfilled ✓'
                              : 'Cancelled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClaimsReceived;


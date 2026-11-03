import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Clock,
  MapPin,
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    foodName: '',
    category: '',
    description: '',
    quantity: '',
    pickupLocation: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyDonations = async () => {
    try {
      const res = await api.get('/donations/my');
      if (res.data.success) {
        setDonations(res.data.donations || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      foodName: item.foodName,
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      pickupLocation: item.pickupLocation,
    });
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (Number(editForm.quantity) < editingItem.claimedQuantity) {
      setEditError(
        `Quantity cannot be less than the ${editingItem.claimedQuantity} ${editingItem.unit} already claimed.`
      );
      return;
    }

    setSavingEdit(true);

    try {
      const res = await api.put(`/donations/${editingItem._id}`, {
        ...editForm,
        quantity: Number(editForm.quantity),
      });

      if (res.data.success) {
        setActionSuccess('Donation updated successfully!');
        setEditingItem(null);
        fetchMyDonations();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update donation');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    setError('');

    try {
      const res = await api.delete(`/donations/${id}`);
      if (res.data.success) {
        setActionSuccess('Donation deleted successfully.');
        setDeletingId(null);
        fetchMyDonations();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to delete donation. Active claims may prevent deletion.'
      );
    } finally {
      setIsDeleting(false);
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
              Inventory Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
              My Donations
            </h1>
            <p className="text-sm text-[#788078] mt-1">
              Track, update, and manage the surplus food listings you have published.
            </p>
          </div>

          <Link to="/donate" className="btn-primary self-start sm:self-auto py-2.5 px-4 shadow-sm">
            <PlusCircle className="w-4 h-4" />
            New Donation
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
          <Loading message="Loading your donations list..." />
        ) : donations.length === 0 ? (
          <EmptyState
            icon={Package}
            title="You haven't posted any donations yet"
            description="Share excess food from your restaurant, catering, or home kitchen and help build community resilience."
            actionText="Donate Surplus Food"
            actionLink="/donate"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E9ECE5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAFAF7] border-b border-[#E9ECE5] text-[#788078] uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Food Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Total Qty</th>
                    <th className="py-3.5 px-4">Claimed</th>
                    <th className="py-3.5 px-4">Remaining</th>
                    <th className="py-3.5 px-4">Pickup Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9ECE5]">
                  {donations.map((item) => {
                    const remaining = Math.max(0, item.quantity - item.claimedQuantity);
                    return (
                      <tr key={item._id} className="hover:bg-[#FAFAF7]/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.foodName}
                              className="w-10 h-10 rounded-lg object-cover border border-[#E9ECE5] shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div>
                              <p className="font-bold text-sm text-[#24352B]">
                                {item.foodName}
                              </p>
                              <span className="text-[11px] text-[#788078]">
                                Until {new Date(item.availableUntil).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-[#788078] font-medium">
                          {item.category}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[#24352B]">
                          {item.quantity} {item.unit}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[#D97706]">
                          {item.claimedQuantity || 0} {item.unit}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#176B45]">
                          {remaining} {item.unit}
                        </td>

                        <td className="py-3.5 px-4 text-[#788078] max-w-[140px] truncate">
                          {item.pickupLocation}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={
                              item.status === 'Available'
                                ? 'badge-available'
                                : item.status === 'Partially Claimed'
                                ? 'badge-partially'
                                : item.status === 'Fully Claimed'
                                ? 'badge-claimed'
                                : item.status === 'Collected'
                                ? 'badge-collected'
                                : 'badge-expired'
                            }
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/food/${item._id}`}
                              className="p-1.5 text-[#788078] hover:text-[#176B45] hover:bg-[#F0F3ED] rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-[#788078] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit Donation"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(item._id)}
                              className="p-1.5 text-[#788078] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Donation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-[#E9ECE5] max-w-lg w-full p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#E9ECE5] mb-5">
                <h3 className="text-lg font-bold text-[#1E382A]">
                  Edit Donation Details
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 text-[#788078] hover:text-[#24352B] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#24352B] mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    value={editForm.foodName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, foodName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9ECE5] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#24352B] mb-1">
                    Total Quantity ({editingItem.unit})
                  </label>
                  <input
                    type="number"
                    min={editingItem.claimedQuantity || 1}
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, quantity: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9ECE5] text-sm"
                    required
                  />
                  <span className="text-[11px] text-[#788078] mt-1 block">
                    Already claimed: {editingItem.claimedQuantity || 0} {editingItem.unit} (Cannot lower below this)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#24352B] mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={editForm.pickupLocation}
                    onChange={(e) =>
                      setEditForm({ ...editForm, pickupLocation: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9ECE5] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#24352B] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E9ECE5] text-sm"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-[#E9ECE5] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="btn-primary text-xs"
                  >
                    {savingEdit ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl border border-[#E9ECE5] max-w-sm w-full p-6 text-center shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#24352B]">
                Delete Food Donation?
              </h3>
              <p className="text-xs text-[#788078] leading-relaxed">
                Are you sure you want to delete this listing? If there are active confirmed claims on it, deletion will be blocked by system rules.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="btn-secondary text-xs justify-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(deletingId)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 px-4 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDonations;


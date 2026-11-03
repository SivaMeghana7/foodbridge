import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  PlusCircle,
  Inbox,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/donor');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkCollected = async (claimId) => {
    try {
      const res = await api.patch(`/claims/${claimId}/collect`);
      if (res.data.success) {
        setActionMessage('Pickup marked as collected!');
        fetchDashboardData();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as collected');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAFAF7]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E9ECE5] gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
              Donor Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
              Welcome back, {user?.fullName}
            </h1>
            <p className="text-sm text-[#788078] mt-1">
              Here is what is happening with your surplus food donations today.
            </p>
          </div>

          <Link to="/donate" className="btn-primary self-start sm:self-auto py-2.5 px-4 shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Donate Food
          </Link>
        </div>

        {actionMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Fetching your donation analytics..." />
        ) : (
          <div className="space-y-8">
            {/* 4 Key Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Donations"
                value={data?.stats?.totalDonations || 0}
                icon={Package}
                subtitle="All time posts"
                colorVariant="green"
              />
              <StatCard
                title="Available Donations"
                value={data?.stats?.availableDonations || 0}
                icon={Clock}
                subtitle="Ready for pickup"
                colorVariant="amber"
              />
              <StatCard
                title="Total Quantity Donated"
                value={data?.stats?.totalQuantityDonated || 0}
                icon={TrendingUp}
                subtitle="Meals / units shared"
                colorVariant="blue"
              />
              <StatCard
                title="Total Quantity Claimed"
                value={data?.stats?.totalQuantityClaimed || 0}
                icon={CheckCircle2}
                subtitle="Units claimed by recipients"
                colorVariant="purple"
              />
            </div>

            {/* Middle Section: Recent Donations & Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Donations Table (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E9ECE5] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#24352B]">Recent Donations</h3>
                    <p className="text-xs text-[#788078]">Latest surplus listings published by you</p>
                  </div>
                  <Link
                    to="/my-donations"
                    className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {data?.recentDonations?.length === 0 ? (
                  <EmptyState
                    title="No donations yet"
                    description="You haven't posted any surplus food yet. Create your first donation to help someone today."
                    actionText="Post First Donation"
                    actionLink="/donate"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E9ECE5] text-[#788078] uppercase tracking-wider font-semibold">
                          <th className="py-3 px-2">Food Name</th>
                          <th className="py-3 px-2">Category</th>
                          <th className="py-3 px-2">Qty</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E9ECE5]">
                        {data?.recentDonations?.map((item) => {
                          const remaining = Math.max(0, item.quantity - item.claimedQuantity);
                          return (
                            <tr key={item._id} className="hover:bg-[#FAFAF7]">
                              <td className="py-3 px-2 font-bold text-[#24352B]">
                                {item.foodName}
                              </td>
                              <td className="py-3 px-2 text-[#788078]">{item.category}</td>
                              <td className="py-3 px-2">
                                <span className="font-bold text-[#176B45]">
                                  {remaining}
                                </span>{' '}
                                <span className="text-[#788078]">/ {item.quantity} {item.unit}</span>
                              </td>
                              <td className="py-3 px-2">
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
                              <td className="py-3 px-2 text-right">
                                <Link
                                  to={`/food/${item._id}`}
                                  className="text-[#176B45] font-semibold hover:underline"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Status Overview Card (1 Col) */}
              <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#24352B] mb-1">
                    Donation Status Overview
                  </h3>
                  <p className="text-xs text-[#788078] mb-6">
                    Current distribution of your listings
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#24352B] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#176B45]"></span>
                        Available
                      </span>
                      <span className="font-bold">{data?.stats?.statusCounts?.Available || 0}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#24352B] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                        Partially Claimed
                      </span>
                      <span className="font-bold">
                        {data?.stats?.statusCounts?.PartiallyClaimed || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#24352B] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]"></span>
                        Fully Claimed
                      </span>
                      <span className="font-bold">
                        {data?.stats?.statusCounts?.FullyClaimed || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#24352B] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00796B]"></span>
                        Collected & Fulfilled
                      </span>
                      <span className="font-bold">
                        {data?.stats?.statusCounts?.Collected || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#24352B] font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                        Expired
                      </span>
                      <span className="font-bold">
                        {data?.stats?.statusCounts?.Expired || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action card */}
                <div className="mt-8 p-4 bg-[#F0F3ED] rounded-xl border border-[#E9ECE5]">
                  <p className="text-xs font-bold text-[#1E382A] uppercase">Need quick help?</p>
                  <p className="text-xs text-[#788078] mt-1">
                    Have excess fresh food from an event or dinner service? Post it in 60 seconds.
                  </p>
                  <Link
                    to="/donate"
                    className="mt-3 block text-center btn-primary text-xs py-2 w-full"
                  >
                    Create New Donation
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Section: Recently Received Claims */}
            <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#24352B]">Recently Received Claims</h3>
                  <p className="text-xs text-[#788078]">
                    Food claims reserved by community members
                  </p>
                </div>
                <Link
                  to="/donor/claims"
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
                >
                  Manage All Claims <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {data?.recentClaims?.length === 0 ? (
                <p className="text-xs text-[#788078] py-4">
                  No claims have been submitted for your donations yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9ECE5] text-[#788078] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-2">Food Item</th>
                        <th className="py-3 px-2">Recipient</th>
                        <th className="py-3 px-2">Contact</th>
                        <th className="py-3 px-2">Qty Requested</th>
                        <th className="py-3 px-2">Claim Status</th>
                        <th className="py-3 px-2 text-right">Pickup Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9ECE5]">
                      {data?.recentClaims?.map((claim) => (
                        <tr key={claim._id} className="hover:bg-[#FAFAF7]">
                          <td className="py-3 px-2 font-bold text-[#24352B]">
                            {claim.donationId?.foodName || 'Donation Item'}
                          </td>
                          <td className="py-3 px-2 text-[#24352B]">
                            {claim.recipientId?.fullName || 'Recipient'}
                          </td>
                          <td className="py-3 px-2 text-[#788078]">
                            {claim.recipientId?.phone || 'N/A'}
                          </td>
                          <td className="py-3 px-2 font-bold text-[#176B45]">
                            {claim.quantityRequested} {claim.donationId?.unit || 'units'}
                          </td>
                          <td className="py-3 px-2">
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
                          <td className="py-3 px-2 text-right">
                            {claim.status === 'Confirmed' ? (
                              <button
                                onClick={() => handleMarkCollected(claim._id)}
                                className="btn-secondary text-[11px] py-1 px-2.5"
                              >
                                Mark Collected
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#788078] italic">
                                {claim.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DonorDashboard;


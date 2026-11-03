import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Package,
  MapPin,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import FoodCard from '../components/FoodCard';

const RecipientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/recipient');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recipient dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAFAF7]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E9ECE5] gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
              Recipient Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
              Welcome back, {user?.fullName}
            </h1>
            <p className="text-sm text-[#788078] mt-1">
              Find and claim available surplus food donations in your community.
            </p>
          </div>

          <Link to="/explore" className="btn-primary self-start sm:self-auto py-2.5 px-4 shadow-sm">
            <Search className="w-4 h-4" />
            Explore Available Food
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <Loading message="Fetching your food claims analytics..." />
        ) : (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Claims"
                value={data?.stats?.totalClaims || 0}
                icon={ShoppingBag}
                subtitle="All reservations"
                colorVariant="green"
              />
              <StatCard
                title="Active Claims"
                value={data?.stats?.activeClaims || 0}
                icon={Clock}
                subtitle="Awaiting pickup"
                colorVariant="amber"
              />
              <StatCard
                title="Completed Pickups"
                value={data?.stats?.completedPickups || 0}
                icon={CheckCircle2}
                subtitle="Successfully collected"
                colorVariant="blue"
              />
              <StatCard
                title="Total Quantity Claimed"
                value={data?.stats?.totalQuantityClaimed || 0}
                icon={TrendingUp}
                subtitle="Meals / units secured"
                colorVariant="purple"
              />
            </div>

            {/* Recent Claims Section */}
            <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#24352B]">Recent Claims</h3>
                  <p className="text-xs text-[#788078]">Your active and recent food pickup orders</p>
                </div>
                <Link
                  to="/my-claims"
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
                >
                  View All Claims <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {data?.recentClaims?.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="No claims yet"
                  description="You haven't reserved any food yet. Browse our marketplace to find fresh food available nearby."
                  actionText="Discover Food"
                  actionLink="/explore"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9ECE5] text-[#788078] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-2">Food Name</th>
                        <th className="py-3 px-2">Pickup Location</th>
                        <th className="py-3 px-2">Quantity</th>
                        <th className="py-3 px-2">Date Claimed</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9ECE5]">
                      {data?.recentClaims?.map((claim) => (
                        <tr key={claim._id} className="hover:bg-[#FAFAF7]">
                          <td className="py-3 px-2 font-bold text-[#24352B]">
                            {claim.donationId?.foodName || 'Donation Item'}
                          </td>
                          <td className="py-3 px-2 text-[#788078] max-w-[150px] truncate">
                            {claim.donationId?.pickupLocation || 'Check order'}
                          </td>
                          <td className="py-3 px-2 font-bold text-[#176B45]">
                            {claim.quantityRequested} {claim.donationId?.unit || 'units'}
                          </td>
                          <td className="py-3 px-2 text-[#788078]">
                            {new Date(claim.createdAt).toLocaleDateString()}
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
                            {claim.donationId?._id ? (
                              <Link
                                to={`/food/${claim.donationId._id}`}
                                className="text-[#176B45] font-semibold hover:underline"
                              >
                                View
                              </Link>
                            ) : (
                              <span className="text-[#788078] italic">Archived</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recommended Available Food Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#24352B]">
                    Recommended Available Food
                  </h3>
                  <p className="text-xs text-[#788078]">
                    Fresh surplus donations ready for pickup now
                  </p>
                </div>
                <Link
                  to="/explore"
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
                >
                  Explore All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {data?.recommendedFood?.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-[#E9ECE5] text-center text-xs text-[#788078]">
                  No new food listings at the moment. Please check back shortly!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {data?.recommendedFood?.map((item) => (
                    <FoodCard key={item._id} donation={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecipientDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  RotateCcw,
  Package,
  Layers,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const ExploreFood = () => {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('');

  const categories = [
    'All',
    'Cooked Food',
    'Bakery',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Packaged Food',
    'Other',
  ];

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (location.trim()) params.location = location.trim();

      const res = await api.get('/donations', { params });
      if (res.data.success) {
        setDonations(res.data.donations || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load available food items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchDonations();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, location]);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            Community Food Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E382A] mt-1">
            Discover food near you.
          </h1>
          <p className="text-sm text-[#788078] mt-1">
            Find available food donations shared by your community. Reserve portions for immediate pickup.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E9ECE5] p-5 mb-8 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search food name, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] bg-white focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3 relative">
              <MapPin className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Filter by city, area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              />
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1 flex items-center">
              <button
                onClick={handleReset}
                title="Reset Filters"
                className="btn-secondary w-full py-2.5 px-3 justify-center text-xs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E9ECE5]">
            <span className="text-xs font-semibold text-[#788078] mr-1">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition ${
                  category === cat
                    ? 'border-[#176B45] bg-[#176B45] text-white font-semibold'
                    : 'border-[#E9ECE5] bg-white text-[#788078] hover:border-[#176B45] hover:text-[#176B45]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <Loading message="Finding surplus food in your area..." />
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        ) : donations.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No surplus food available right now"
            description="There are currently no active listings matching your filters. Check back soon or reset your search criteria."
            actionText="Reset Filters"
            onAction={handleReset}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold text-[#788078]">
                Showing <span className="font-bold text-[#24352B]">{donations.length}</span> active food donation{donations.length === 1 ? '' : 's'}
              </p>
              <span className="text-xs text-[#176B45] font-semibold bg-[#F0F3ED] px-2.5 py-1 rounded-full border border-[#E9ECE5]">
                Newest First
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map((donation) => (
                <FoodCard
                  key={donation._id}
                  donation={donation}
                  onClaimClick={(item) => navigate(`/food/${item._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreFood;


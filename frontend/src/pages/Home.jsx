import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Utensils,
  ShoppingBag,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Salad,
  Croissant,
  Apple,
  Carrot,
  Milk,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredDonations, setFeaturedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data } = await api.get('/donations?limit=3');
        if (data.success && data.donations) {
          setFeaturedDonations(data.donations.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not fetch featured donations:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleDonateCTA = () => {
    if (!user) {
      navigate('/login', { state: { from: '/donate' } });
    } else if (user.role === 'Donor') {
      navigate('/donate');
    } else {
      navigate('/unauthorized', {
        state: {
          message: 'You are signed in as a Recipient. Donors can publish food listings.',
        },
      });
    }
  };

  const handleExploreCTA = () => {
    if (!user) {
      navigate('/login', { state: { from: '/explore' } });
    } else {
      navigate('/explore');
    }
  };

  const categories = [
    { name: 'Cooked Food', icon: Utensils, desc: 'Hot meals, caterings, gravies' },
    { name: 'Bakery', icon: Croissant, desc: 'Fresh bread, buns, pastries' },
    { name: 'Fruits', icon: Apple, desc: 'Apples, bananas, citrus, melons' },
    { name: 'Vegetables', icon: Carrot, desc: 'Farm greens, roots, fresh produce' },
    { name: 'Dairy', icon: Milk, desc: 'Milk, cheese, yogurt, butter' },
    { name: 'Packaged Food', icon: Package, desc: 'Canned items, pulses, cereals' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F3ED] to-[#FAFAF7] pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#E9ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#176B45]/10 text-[#176B45] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Community Food Rescue Network
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E382A] tracking-tight leading-[1.1]">
                Good food deserves a <span className="text-[#176B45]">second chance.</span>
              </h1>

              <p className="text-lg text-[#788078] max-w-2xl leading-relaxed">
                Connect surplus food with people who need it. Reduce waste, share resources, and create meaningful change in your community.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button onClick={handleDonateCTA} className="btn-primary text-base py-3.5 px-6 shadow-sm">
                  <Utensils className="w-5 h-5" />
                  Donate Surplus Food
                </button>
                <button onClick={handleExploreCTA} className="btn-secondary text-base py-3.5 px-6">
                  <ShoppingBag className="w-5 h-5 text-[#176B45]" />
                  Explore Available Food
                </button>
              </div>

              {/* Mini Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E9ECE5]">
                <div>
                  <h4 className="text-xl font-extrabold text-[#1E382A]">100%</h4>
                  <p className="text-xs text-[#788078] font-medium">Free Redistribution</p>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-[#1E382A]">Real-Time</h4>
                  <p className="text-xs text-[#788078] font-medium">Safe Quantity Locking</p>
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-[#1E382A]">Zero</h4>
                  <p className="text-xs text-[#788078] font-medium">Food Landfill Goal</p>
                </div>
              </div>
            </div>

            {/* Right Col: High Quality Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#176B45]/20 to-[#238052]/20 rounded-3xl blur-xl opacity-70"></div>
                <div className="relative rounded-2xl overflow-hidden border border-[#E9ECE5] shadow-xl bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                    alt="Freshly prepared healthy meals"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-5 bg-white border-t border-[#E9ECE5]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F0F3ED] flex items-center justify-center text-[#176B45]">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#788078]">Direct Community Bridge</p>
                          <p className="text-sm font-bold text-[#24352B]">Wholesome meals saved today</p>
                        </div>
                      </div>
                      <span className="badge-available">Verified Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED / LIVE DONATIONS PREVIEW */}
      {featuredDonations.length > 0 && (
        <section className="py-16 bg-white border-b border-[#E9ECE5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
                  Live Available Listings
                </span>
                <h2 className="text-3xl font-extrabold text-[#1E382A] mt-1">
                  Ready for Pickup Nearby
                </h2>
              </div>
              <Link to="/explore" className="text-sm font-bold text-[#176B45] hover:underline flex items-center gap-1.5">
                View all available food
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDonations.map((donation) => (
                <FoodCard key={donation._id} donation={donation} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES SECTION */}
      <section id="categories" className="py-20 bg-[#FAFAF7] border-b border-[#E9ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            Surplus Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E382A] mt-2">
            What Can You Share or Find?
          </h2>
          <p className="text-sm text-[#788078] max-w-xl mx-auto mt-3">
            From hot restaurant meals to bakery loaves and orchard fruits, every category is safely tracked and cataloged.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#E9ECE5] text-center shadow-xs hover:border-[#176B45] hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F0F3ED] text-[#176B45] flex items-center justify-center mb-4 group-hover:bg-[#176B45] group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[#24352B] text-base mb-1">{cat.name}</h3>
                  <p className="text-xs text-[#788078] leading-snug">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#E9ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E382A] mt-2">
            How FoodBridge Works
          </h2>
          <p className="text-sm text-[#788078] max-w-xl mx-auto mt-3">
            We eliminate friction so surplus food transfers safely and immediately from kitchens to tables.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-[#FAFAF7] border border-[#E9ECE5] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#176B45] text-white font-black text-xl flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="text-xl font-bold text-[#24352B]">Donors List Surplus</h3>
              <p className="text-sm text-[#788078] leading-relaxed">
                Restaurants, caterers, bakeries, or households submit available food items, specifying exact quantities, expiry windows, and pickup addresses.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-[#FAFAF7] border border-[#E9ECE5] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#238052] text-white font-black text-xl flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="text-xl font-bold text-[#24352B]">Recipients Claim Food</h3>
              <p className="text-sm text-[#788078] leading-relaxed">
                Individuals, NGOs, or volunteer groups browse nearby food, reserve needed portions with real-time atomic locking, and receive pickup details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-[#FAFAF7] border border-[#E9ECE5] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E382A] text-white font-black text-xl flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="text-xl font-bold text-[#24352B]">Handover & Verification</h3>
              <p className="text-sm text-[#788078] leading-relaxed">
                Food is collected at the designated pickup spot. The donor marks the claim as Collected, verifying fulfillment and updating community metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US & MISSION */}
      <section id="about" className="py-20 bg-[#F0F3ED] border-b border-[#E9ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
                Our Purpose & Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E382A] mt-2 mb-6">
                Bridging the Gap Between Abundance and Need
              </h2>
              <p className="text-[#788078] leading-relaxed mb-6">
                Every year, metric tons of perfectly edible food are discarded while vulnerable households and shelter kitchens face shortages. FoodBridge was born to solve this logistical mismatch through transparent, direct, and zero-fee software.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-[#24352B]">
                    Strict role segregation to protect donors and verify recipients.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-[#24352B]">
                    Atomic inventory tracking to prevent double-claiming and wasted trips.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-[#24352B]">
                    Community accountability with verified collection and status tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#E9ECE5] shadow-md space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#176B45]/10 text-[#176B45] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#24352B] text-lg">Safe, Transparent & Secure</h4>
                  <p className="text-xs text-[#788078]">Enterprise-grade security and data privacy</p>
                </div>
              </div>
              <p className="text-sm text-[#788078] leading-relaxed">
                Whether you are a bakery with 30 evening loaves or a shelter preparing 100 weekend dinners, FoodBridge guarantees reliable coordination so nothing goes to waste.
              </p>
              <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#E9ECE5] text-xs text-[#24352B] font-semibold flex items-center justify-between">
                <span>Join our zero-waste movement</span>
                <Link to="/register" className="text-[#176B45] font-bold hover:underline">
                  Get Started →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-[#176B45] to-[#1E382A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Ready to make an immediate impact?
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-base">
            Create an account today as a Food Donor or Food Recipient. Help us ensure no edible meal is thrown away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/register" className="btn-secondary text-base py-3.5 px-8 font-bold text-[#176B45] hover:bg-white">
              Create Free Account
            </Link>
            <Link to="/login" className="btn-outline text-base py-3.5 px-8 font-bold border-white/30 text-white hover:bg-white/10">
              Sign In to Your Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


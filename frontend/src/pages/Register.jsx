import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Users,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Donor', // default selection
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      const dest =
        location.state?.from?.pathname ||
        (user.role === 'Donor' ? '/donor/dashboard' : '/recipient/dashboard');
      navigate(dest, { replace: true });
    }
  }, [user, navigate, location]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Mobile Number is required';
    } else if (formData.phone.trim().length < 7) {
      errs.phone = 'Mobile Number must be at least 7 digits';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      errs.role = 'Please select an account type';
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
      const newUser = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      // Redirect to originally requested page or dashboard
      const redirectTo =
        location.state?.from?.pathname ||
        (newUser.role === 'Donor' ? '/donor/dashboard' : '/recipient/dashboard');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-stretch bg-[#FAFAF7]">
      {/* Left Column: Branding & Media (Visible on md and up) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E382A] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80"
            alt="Community food sharing"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E382A] via-[#1E382A]/90 to-[#1E382A]/70" />
        </div>

        {/* Top Brand */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#176B45] flex items-center justify-center text-white">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Food<span className="text-[#238052]">Bridge</span>
          </span>
        </div>

        {/* Center Quote / Message */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <span className="inline-block px-3 py-1 rounded-full bg-[#176B45]/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Zero Hunger &bull; Zero Waste
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Join thousands creating local food resilience together.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Whether you run a kitchen with surplus ingredients or represent a community center serving daily meals, FoodBridge ensures dignity, transparency, and instant coordination.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Real-time inventory reservations prevent double claiming</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Role-governed data protection and verified contacts</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-gray-400">
          FoodBridge Platform &bull; A sustainable hunger relief initiative.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#E9ECE5] shadow-xs">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] tracking-tight">
              Create an account
            </h2>
            <p className="text-sm text-[#788078] mt-1">
              Select your role and start sharing or claiming food today.
            </p>
          </div>

          {serverError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-2">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Donor' })}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    formData.role === 'Donor'
                      ? 'border-[#176B45] bg-[#F0F3ED] text-[#176B45] ring-2 ring-[#176B45]/20'
                      : 'border-[#E9ECE5] bg-white text-[#788078] hover:border-[#176B45]'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-2" />
                  <div>
                    <span className="block font-bold text-sm text-[#24352B]">DONOR</span>
                    <span className="block text-[11px] text-[#788078] mt-0.5 leading-tight">
                      Restaurants, Bakeries, Homes
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'Recipient' })}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    formData.role === 'Recipient'
                      ? 'border-[#176B45] bg-[#F0F3ED] text-[#176B45] ring-2 ring-[#176B45]/20'
                      : 'border-[#E9ECE5] bg-white text-[#788078] hover:border-[#176B45]'
                  }`}
                >
                  <Users className="w-5 h-5 mb-2" />
                  <div>
                    <span className="block font-bold text-sm text-[#24352B]">RECIPIENT</span>
                    <span className="block text-[11px] text-[#788078] mt-0.5 leading-tight">
                      Individuals, Shelters, NGOs
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Full Name / Organization Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Green Bakery or Sarah Johnson"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 555 123 4567"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.password ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#788078] hover:text-[#24352B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] transition ${
                    errors.confirmPassword ? 'border-red-400 bg-red-50/20' : 'border-[#E9ECE5]'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-base shadow-sm mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#788078] pt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-bold text-[#176B45] hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


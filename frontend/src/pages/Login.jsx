import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
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
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
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
      const loggedInUser = await login(formData.email.trim(), formData.password);

      // Determine redirect destination
      let dest = location.state?.from?.pathname || location.state?.from;
      if (!dest || dest === '/login' || dest === '/register') {
        dest =
          loggedInUser.role === 'Donor'
            ? '/donor/dashboard'
            : '/recipient/dashboard';
      }

      navigate(dest, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Invalid credentials. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-stretch bg-[#FAFAF7]">
      {/* Left Column: Branding (lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E382A] text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80"
            alt="Food bridge support"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E382A] via-[#1E382A]/90 to-[#1E382A]/70" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#176B45] flex items-center justify-center text-white">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Food<span className="text-[#238052]">Bridge</span>
          </span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="inline-block px-3 py-1 rounded-full bg-[#176B45]/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Secure Platform Sign-in
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back to your food rescue community.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Sign in to check pending pickups, manage active listings, review claimed portions, and view real-time community contributions.
          </p>
        </div>

        <div className="relative z-10 text-xs text-gray-400">
          Need assistance? Contact support@foodbridge.org
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#E9ECE5] shadow-xs">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] tracking-tight">
              Sign In to FoodBridge
            </h2>
            <p className="text-sm text-[#788078] mt-1">
              Enter your registered credentials to access your dashboard.
            </p>
          </div>

          {serverError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#24352B]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-base shadow-sm mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E9ECE5] text-center space-y-3">
            <p className="text-xs text-[#788078]">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                state={location.state}
                className="font-bold text-[#176B45] hover:underline"
              >
                Create new account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


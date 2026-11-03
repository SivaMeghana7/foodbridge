import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setErrorMsg('Full name and mobile number cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const res = await api.put('/users/profile', {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });

      if (res.data.success) {
        updateUser(res.data.user);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-[#FAFAF7]">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-4xl overflow-y-auto">
        <div className="pb-6 border-b border-[#E9ECE5] mb-8">
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E382A] mt-1">
            My Profile
          </h1>
          <p className="text-sm text-[#788078] mt-1">
            Manage your personal contact details and review your verified account status.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E9ECE5] p-6 sm:p-10 shadow-xs space-y-8">
          {/* Avatar and Header Info */}
          <div className="flex items-center gap-5 pb-6 border-b border-[#E9ECE5]">
            <div className="w-16 h-16 rounded-2xl bg-[#176B45] text-white flex items-center justify-center font-black text-2xl shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E382A]">
                {user?.fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge-available">{user?.role}</span>
                <span className="text-xs text-[#788078]">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#24352B] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
                    required
                  />
                </div>
              </div>

              {/* Mobile Phone */}
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9ECE5] text-sm text-[#24352B] focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
                    required
                  />
                </div>
              </div>

              {/* Email (Read-Only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#788078] mb-1.5">
                  Email Address (Primary Login)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-[#788078] mt-1 block">
                  Email addresses are fixed to protect account identity.
                </span>
              </div>

              {/* Account Type / Role (Read-Only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#788078] mb-1.5">
                  Account Type
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-[#788078] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={`${user?.role} Account`}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <span className="text-[11px] text-[#788078] mt-1 block">
                  Roles cannot be converted after registration.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-[#E9ECE5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 py-2 px-4 rounded-xl hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout from Account
              </button>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-2.5 px-6 shadow-sm w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;


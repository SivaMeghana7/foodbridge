import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  Menu,
  X,
  LogOut,
  User,
  PlusCircle,
  Search,
  LayoutDashboard,
  Package,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isDonor, isRecipient } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDonateClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { state: { from: '/donate' } });
      return;
    }
    if (user.role === 'Recipient') {
      e.preventDefault();
      navigate('/unauthorized', {
        state: {
          message: 'Only registered Donors can post food donations. Please login with a Donor account.',
        },
      });
    }
  };

  const handleFindFoodClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { state: { from: '/explore' } });
      return;
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9ECE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#176B45] flex items-center justify-center text-white shadow-xs group-hover:bg-[#145939] transition-colors">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#1E382A]">
                Food<span className="text-[#176B45]">Bridge</span>
              </span>
              <span className="block text-[10px] text-[#788078] font-medium uppercase tracking-wider -mt-1">
                Rescue & Share
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-[#176B45] ${
                location.pathname === '/' ? 'text-[#176B45]' : 'text-[#24352B]'
              }`}
            >
              Home
            </Link>
            <a
              href="/#about"
              className="text-sm font-semibold text-[#24352B] hover:text-[#176B45] transition-colors"
            >
              About Us
            </a>
            <a
              href="/#categories"
              className="text-sm font-semibold text-[#24352B] hover:text-[#176B45] transition-colors"
            >
              Categories
            </a>
            <a
              href="/#how-it-works"
              className="text-sm font-semibold text-[#24352B] hover:text-[#176B45] transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/donate"
              onClick={handleDonateClick}
              className={`text-sm font-semibold transition-colors hover:text-[#176B45] ${
                location.pathname === '/donate' ? 'text-[#176B45]' : 'text-[#24352B]'
              }`}
            >
              Donate Food
            </Link>
            <Link
              to="/explore"
              onClick={handleFindFoodClick}
              className={`text-sm font-semibold transition-colors hover:text-[#176B45] ${
                location.pathname === '/explore' ? 'text-[#176B45]' : 'text-[#24352B]'
              }`}
            >
              Find Food
            </Link>
          </nav>

          {/* User Auth Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isDonor ? '/donor/dashboard' : '/recipient/dashboard'}
                  className="btn-secondary text-sm py-2 px-3.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#176B45]" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-2 rounded-xl text-sm font-medium text-[#24352B] hover:bg-[#F0F3ED] transition-colors"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-[#176B45] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.fullName ? user.fullName.charAt(0) : 'U'}
                  </div>
                  <span className="font-semibold text-xs text-[#1E382A] max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#788078] hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 shadow-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#24352B] hover:bg-[#F0F3ED] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E9ECE5] bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="block py-2 text-base font-semibold text-[#24352B] hover:text-[#176B45]"
          >
            Home
          </Link>
          <a
            href="/#about"
            onClick={closeMenu}
            className="block py-2 text-base font-semibold text-[#24352B] hover:text-[#176B45]"
          >
            About Us
          </a>
          <a
            href="/#categories"
            onClick={closeMenu}
            className="block py-2 text-base font-semibold text-[#24352B] hover:text-[#176B45]"
          >
            Categories
          </a>
          <a
            href="/#how-it-works"
            onClick={closeMenu}
            className="block py-2 text-base font-semibold text-[#24352B] hover:text-[#176B45]"
          >
            How It Works
          </a>
          <Link
            to="/donate"
            onClick={(e) => {
              closeMenu();
              handleDonateClick(e);
            }}
            className="block py-2 text-base font-semibold text-[#24352B] hover:text-[#176B45]"
          >
            Donate Food
          </Link>
          <Link
            to="/explore"
            onClick={(e) => {
              closeMenu();
              handleFindFoodClick(e);
            }}
            className="block py-2 text-base font-semibold text-[#24352B] hover:text-[#176B45]"
          >
            Find Food
          </Link>

          <div className="pt-4 border-t border-[#E9ECE5]">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={isDonor ? '/donor/dashboard' : '/recipient/dashboard'}
                  onClick={closeMenu}
                  className="btn-secondary w-full justify-center"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#176B45]" />
                  Dashboard ({user.role})
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="btn-outline w-full justify-center"
                >
                  <User className="w-4 h-4 text-[#176B45]" />
                  Profile ({user.fullName})
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 text-sm text-red-600 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="btn-outline justify-center text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="btn-primary justify-center text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


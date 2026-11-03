import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Inbox,
  Search,
  User,
  LogOut,
  HeartHandshake,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isDonor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const donorLinks = [
    { to: '/donor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/donate', label: 'Donate Food', icon: PlusCircle },
    { to: '/my-donations', label: 'My Donations', icon: Package },
    { to: '/donor/claims', label: 'Claims Received', icon: Inbox },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const recipientLinks = [
    { to: '/recipient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore Food', icon: Search },
    { to: '/my-claims', label: 'My Claims', icon: ShoppingBag },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const links = isDonor ? donorLinks : recipientLinks;

  return (
    <aside className="w-64 bg-white border-r border-[#E9ECE5] min-h-[calc(100vh-5rem)] flex flex-col justify-between shrink-0">
      {/* Top Section */}
      <div className="p-5">
        {/* User Card */}
        <div className="p-3.5 bg-[#F0F3ED] rounded-xl mb-6 border border-[#E9ECE5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#176B45] text-white flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-[#24352B] truncate">
                {user?.fullName}
              </h4>
              <span className="inline-block text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-[#176B45]/10 text-[#176B45] mt-0.5">
                {user?.role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/donor/dashboard' || link.to === '/recipient/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#176B45] text-white shadow-xs'
                      : 'text-[#24352B] hover:bg-[#F0F3ED] hover:text-[#176B45]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <div className="p-5 border-t border-[#E9ECE5]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


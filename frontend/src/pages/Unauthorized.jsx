import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  const location = useLocation();

  const customMessage = location.state?.message;
  const attemptedRole = location.state?.attemptedRole;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAF7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E9ECE5] p-8 text-center shadow-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
            403 &bull; Access Restricted
          </span>
          <h1 className="text-2xl font-black text-[#1E382A] mt-1">
            Access Unauthorized
          </h1>
          <p className="text-sm text-[#788078] mt-2 leading-relaxed">
            {customMessage ||
              (attemptedRole
                ? `This section is strictly restricted to ${attemptedRole} accounts. Your account role is '${user?.role || 'Guest'}'.`
                : 'You do not have permission to access the requested resource or perform this action.')}
          </p>
        </div>

        <div className="p-4 bg-[#F0F3ED] rounded-xl text-xs text-[#24352B] text-left">
          <p className="font-bold mb-1">Why am I seeing this?</p>
          <p className="text-[#788078] leading-relaxed">
            FoodBridge maintains strict separation of responsibilities between surplus Donors (who post and fulfill food) and Recipients (who reserve and collect food).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {user ? (
            <Link
              to={user.role === 'Donor' ? '/donor/dashboard' : '/recipient/dashboard'}
              className="btn-primary w-full sm:w-auto text-xs py-2.5 px-4 justify-center"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to My Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn-primary w-full sm:w-auto text-xs py-2.5 px-4 justify-center"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Different Account
            </Link>
          )}

          <Link
            to="/"
            className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-4 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;


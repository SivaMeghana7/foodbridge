import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#FAFAF7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E9ECE5] p-8 text-center shadow-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#F0F3ED] text-[#176B45] flex items-center justify-center mx-auto border border-[#E9ECE5]">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider">
            404 &bull; Page Not Found
          </span>
          <h1 className="text-3xl font-black text-[#1E382A] mt-1">
            Page Not Found
          </h1>
          <p className="text-sm text-[#788078] mt-2 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary text-xs py-2.5 px-5">
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link to="/explore" className="btn-secondary text-xs py-2.5 px-5">
            Browse Food
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


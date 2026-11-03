import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, User, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FoodCard = ({ donation, onClaimClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    _id,
    foodName,
    category,
    quantity,
    claimedQuantity = 0,
    unit,
    imageUrl,
    pickupLocation,
    donorName,
    availableUntil,
    status,
  } = donation;

  const remaining = Math.max(0, (quantity || 0) - (claimedQuantity || 0));

  const formatExpiry = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = date - now;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMs < 0) return 'Expired';
      if (diffHours < 24) return `Expires in ${diffHours} hr${diffHours === 1 ? '' : 's'}`;
      const diffDays = Math.floor(diffHours / 24);
      return `Valid for ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } catch {
      return 'Available';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'Available':
        return <span className="badge-available">Available</span>;
      case 'Partially Claimed':
        return <span className="badge-partially">Partially Claimed</span>;
      case 'Fully Claimed':
        return <span className="badge-claimed">Fully Claimed</span>;
      case 'Collected':
        return <span className="badge-collected">Collected</span>;
      case 'Expired':
        return <span className="badge-expired">Expired</span>;
      default:
        return <span className="badge-available">{status}</span>;
    }
  };

  const handleClaim = (e) => {
    e.preventDefault();
    if (!user) {
      // Unauthenticated visitor -> redirect to login with return URL
      navigate('/login', { state: { from: `/food/${_id}` } });
      return;
    }

    if (user.role === 'Donor') {
      navigate('/unauthorized', {
        state: {
          message: 'Donors cannot claim food. Please register or login with a Recipient account.',
        },
      });
      return;
    }

    if (onClaimClick) {
      onClaimClick(donation);
    } else {
      navigate(`/food/${_id}`);
    }
  };

  return (
    <div className="card-foodbridge flex flex-col overflow-hidden bg-white group">
      {/* Food Image */}
      <div className="relative h-48 w-full overflow-hidden bg-[#F0F3ED]">
        <img
          src={imageUrl}
          alt={foodName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3">{getStatusBadge()}</div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-[#24352B] shadow-xs">
          {category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-[#24352B] line-clamp-1 group-hover:text-[#176B45] transition-colors">
              {foodName}
            </h3>
          </div>

          {/* Details list */}
          <div className="space-y-1.5 text-xs text-[#788078] mb-4">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
              <span className="truncate">{donorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
              <span className="truncate">{pickupLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
              <span>{formatExpiry(availableUntil)}</span>
            </div>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div>
          <div className="bg-[#FAFAF7] rounded-lg p-2.5 mb-4 border border-[#E9ECE5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#24352B]">
              <Package className="w-4 h-4 text-[#176B45]" />
              <span className="font-semibold">Remaining:</span>
            </div>
            <span className="font-bold text-sm text-[#176B45]">
              {remaining} <span className="font-normal text-xs text-[#788078]">/ {quantity} {unit}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/food/${_id}`}
              className="btn-secondary text-xs py-2 px-3 justify-center text-center"
            >
              Details
            </Link>
            {remaining > 0 && status !== 'Fully Claimed' && status !== 'Expired' ? (
              <button
                onClick={handleClaim}
                className="btn-primary text-xs py-2 px-3 justify-center"
              >
                Claim Food
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-100 text-gray-400 text-xs py-2 px-3 rounded-lg font-medium cursor-not-allowed text-center"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;


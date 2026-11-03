import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records to display at the moment.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-[#E9ECE5] shadow-xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-[#F0F3ED] flex items-center justify-center text-[#176B45] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-[#24352B] mb-2">{title}</h3>
      <p className="text-[#788078] max-w-md text-sm mb-6">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;


import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  colorVariant = 'green',
}) => {
  const colorStyles = {
    green: {
      bg: 'bg-[#F0F3ED]',
      icon: 'text-[#176B45]',
      border: 'border-[#E9ECE5]',
    },
    amber: {
      bg: 'bg-[#FFF8E1]',
      icon: 'text-[#D97706]',
      border: 'border-[#FDE68A]',
    },
    blue: {
      bg: 'bg-[#E0F2FE]',
      icon: 'text-[#0284C7]',
      border: 'border-[#BAE6FD]',
    },
    purple: {
      bg: 'bg-[#F3E8FF]',
      icon: 'text-[#9333EA]',
      border: 'border-[#E9D5FF]',
    },
  };

  const style = colorStyles[colorVariant] || colorStyles.green;

  return (
    <div className="bg-white rounded-xl border border-[#E9ECE5] p-6 shadow-xs transition hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[#788078] tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${style.bg} ${style.icon} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[#24352B] tracking-tight">
          {value !== undefined && value !== null ? value : 0}
        </span>
        {subtitle && (
          <span className="text-xs text-[#788078] font-medium">{subtitle}</span>
        )}
      </div>
      {trend && (
        <div className="mt-3 text-xs font-medium text-[#176B45] flex items-center gap-1">
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;


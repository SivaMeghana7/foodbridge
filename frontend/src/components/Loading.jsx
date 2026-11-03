import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAF7]/80 backdrop-blur-sm">
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg border border-[#E9ECE5]">
          <Loader2 className="w-10 h-10 text-[#176B45] animate-spin mb-3" />
          <p className="text-[#24352B] font-medium text-sm">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="w-8 h-8 text-[#176B45] animate-spin mb-2" />
      <p className="text-[#788078] text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;


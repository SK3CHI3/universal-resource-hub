
import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
        <span className="text-white font-bold text-lg">U</span>
      </div>
      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
        Universal Resource Hub
      </span>
    </div>
  );
};

import React from 'react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent"></div>
          <span className="mt-4 font-bold text-slate-700 tracking-wider text-sm">DIGITECH SYSTEMS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
    </div>
  );
};

export default Loader;

// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Search, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-20 bg-[#0B0E14] border-b border-[#1F2937] flex items-center justify-between px-8 z-10 flex-shrink-0">
      {/* 🔍 Left Side: Universal Command Search Bar */}
      <div className="relative w-full max-w-xl group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-200">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Ask or search anything..."
          className="w-full bg-[#11151D] border border-[#242F41] rounded-xl pl-12 pr-16 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-inner"
        />
        {/* Apple style shortcut tag simulation */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <span className="text-[10px] font-bold text-gray-500 bg-[#161B26] px-1.5 py-0.5 border border-[#242F41] rounded-md shadow-sm">
            ⌘ K
          </span>
        </div>
      </div>

      {/* 🔔 Right Side: Actions Controls & Profile Ring */}
      <div className="flex items-center space-x-6">
        {/* Real-time Alert notification trigger */}
        <button
          className="relative p-2.5 bg-[#11151D] border border-[#242F41] rounded-xl text-gray-400 hover:text-gray-200 transition-colors duration-200 group"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Bell className="w-5 h-5 group-hover:animate-swing" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF4B4B] rounded-full ring-2 ring-[#0B0E14]"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;



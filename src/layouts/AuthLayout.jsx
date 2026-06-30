// src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-deep-dark flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Premium Logo Section */}
      <div className="mb-8 flex items-center space-x-4 z-10">
        <img 
          src="/logo.png" 
          alt="DeadlineAI Logo" 
          className="h-20 w-20 object-contain drop-shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:drop-shadow-[0_0_50px_rgba(124,58,237,0.8)] transition-all duration-300"
        />
        <span className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text">DeadlineAI</span>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
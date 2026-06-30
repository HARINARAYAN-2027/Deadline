import React from 'react';

export default function Loader({ label = 'Loading', size = '16' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-dark px-6 text-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <img 
            src="/logo.png" 
            alt="DeadlineAI Logo" 
            className="relative mb-0 h-56 w-56 object-contain drop-shadow-[0_0_60px_rgba(124,58,237,0.6)] animate-floatUp"
          />
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-[0.25em] gradient-text">DEADLINEAI</h1>

        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.35em]">
          <span className="animate-pulse text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{label}</span>
          <span className="text-cyan-400 animate-bounce" style={{animationDelay: '0.1s'}}>.</span>
          <span className="text-cyan-400 animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
          <span className="text-cyan-400 animate-bounce" style={{animationDelay: '0.3s'}}>.</span>
        </div>
      </div>
    </div>
  );
}

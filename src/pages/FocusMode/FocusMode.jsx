// src/pages/FocusMode/FocusMode.jsx
import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Flame, Shield, Sparkles } from 'lucide-react';

const FocusMode = () => {
  // Pomodoro standard state rules (25 minutes deep blocks)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((secondsLeft) => secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* ⏱️ Top Section Header Header */}
      <div className="border-b border-purple-500/10 pb-5">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Focus Mode</h2>
        <p className="text-xs text-gray-400 mt-1">Deep work session timer with distraction blocking.</p>
      </div>

      {/* 🚀 Main Core Double Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Massive Circular Countdown Dial Card */}
        <div className="glass-card p-8 rounded-2xl lg:col-span-2 flex flex-col items-center justify-center min-h-[400px] border-purple-500/20">
          <div className="relative w-64 h-64 flex items-center justify-center rounded-full border-4 border-gray-800/80 shadow-2xl shadow-indigo-600/5 group">
            
            {/* Soft pulse layer backing when counting down */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-purple-500/5 border-4 border-purple-500 animate-pulse opacity-20 pointer-events-none"></div>
            )}

            <div className="text-center z-10">
              <span className="text-5xl font-black text-white tracking-tight font-mono block">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 block">
                {isActive ? 'SESSION ACTIVE' : 'ENGINE PAUSED'}
              </span>
            </div>
          </div>

          {/* Controls Toggles Bar layout buttons */}
          <div className="flex items-center space-x-4 mt-8">
            <button 
              onClick={toggleTimer}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-150 shadow-md ${
                isActive 
                  ? 'btn-premium' 
                  : 'btn-premium'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? 'Pause Block' : 'Start Focus'}</span>
            </button>

            <button 
              onClick={resetTimer}
              className="p-3 glass-card border border-purple-500/20 rounded-lg text-gray-400 hover:text-purple-400 hover:border-purple-500/40 transition-all duration-150"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Environment Armor Status Configuration */}
        <div className="space-y-4">
          
          {/* Distraction lockdown shield tracker */}
          <div className="glass-card border border-purple-500/20 p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Distraction Filter</h4>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">All notifications currently locked to silent mode.</p>
            </div>
          </div>

          {/* Session target instructions list */}
          <div className="glass-card border border-purple-500/20 p-5 rounded-2xl">
            <div className="flex items-center space-x-2 text-purple-400 mb-3">
              <Flame className="w-4 h-4" />
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Focus Directive</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium mt-2">
              "The human brain drops execution velocity by 40% when shifting between contexts. Choose one task, set your timer, and stay focused until the timer resets."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default FocusMode;
// src/pages/Settings/Settings.jsx
import React from 'react';
import { Sliders, Bell, Eye, Lock } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-purple-500/10 pb-5">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Configure your app preferences and notification settings.</p>
      </div>

      <div className="glass-card border border-purple-500/20 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide">Priority Notifications</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Receive alerts for high-priority tasks.</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 cursor-pointer" />
        </div>

        <div className="flex items-center justify-between border-b border-purple-500/10 pb-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide">Dark Mode</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Premium glassmorphic dark theme enabled.</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 cursor-pointer" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lock className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide">Privacy Mode</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Keep your data secure and private.</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-600 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
// src/pages/Habits/Habits.jsx
import React, { useState } from 'react';
import { Target, CheckCircle, Circle } from 'lucide-react';

const Habits = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning Technical Planning", streak: 5, active: [true, true, true, true, true, false, false] },
    { id: 2, name: "Daily 30 min Study Sprint", streak: 12, active: [true, true, true, true, true, true, true] },
    { id: 3, name: "No Social Media (After 9 PM)", streak: 4, active: [true, true, true, true, false, false, false] },
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-purple-500/10 pb-5">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Habit Tracker</h2>
        <p className="text-xs text-gray-400 mt-1">Track daily habits and maintain consistency streaks.</p>
      </div>

      <div className="space-y-4">
        {habits.map(h => (
          <div key={h.id} className="glass-card border border-purple-500/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/40 transition-all duration-200">
            <div>
              <h4 className="text-sm font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">{h.name}</h4>
              <p className="text-[10px] text-transparent bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text font-bold mt-1 uppercase tracking-wider">🔥 {h.streak} DAY STREAK</p>
            </div>

            {/* Week days bubble charts markers */}
            <div className="flex space-x-2">
              {h.active.map((day, idx) => (
                <div key={idx} className={`w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold transition-all ${
                  day ? 'glass-card border-purple-500/30 text-purple-300' : 'glass-card border-gray-700/50 text-gray-600'
                }`}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Habits;
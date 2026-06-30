// src/layouts/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Brain,
  Calendar,
  BarChart3,
  Timer,
  Award,
  Sliders,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const { metrics, tasks } = useTasks();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'AI Planner', path: '/ai-planner', icon: Brain },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Focus Mode', path: '/focus-mode', icon: Timer },
    { name: 'Profile', path: '/profile', icon: Award },
    { name: 'Settings', path: '/settings', icon: Sliders },
  ];

  const handleLogoutAction = async () => {
    const res = await logout();
    if (res.success) {
      navigate('/login');
    }
  };

  const displayName = user?.displayName || user?.name || (loading ? 'Syncing...' : 'Guest Node');
  const displayEmail = user?.email || (loading ? 'Loading session...' : 'No session active');
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'G';

  const riskPercentage = metrics.riskPercentage ?? 0;
  const hasRiskMetrics = metrics.riskPercentage !== null;
  const riskLabel = !hasRiskMetrics
    ? 'Awaiting AI sync'
    : riskPercentage >= 70
      ? 'High Risk'
      : riskPercentage >= 40
        ? 'Moderate Risk'
        : 'Low Risk';
  const atRiskCount = tasks.filter((t) => t.status !== 'Done' && t.priority === 'High').length;

  return (
    <div className="w-64 bg-[#11151D] border-r border-[#242F41] h-screen flex flex-col justify-between shrink-0">
      <div>
        <div className="p-6 border-b border-gray-800/40 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/10">
            ⚡
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider uppercase">DeadlineAI</h1>
            <span className="text-[9px] text-gray-500 font-bold block mt-0.5">Tactical Engine</span>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 group ${
                  isActive
                    ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-600/5'
                    : 'text-gray-400 hover:bg-[#161B26] hover:text-gray-200 border border-transparent'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-400'
                  }`}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800/60 bg-[#0B0E14]/40 space-y-3">
        <div className="bg-[#161B26] border border-[#242F41] p-3 rounded-xl">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Deadline Risk</div>
          <div
            className={`text-sm font-black mb-2 ${
              !hasRiskMetrics ? 'text-gray-500' : riskPercentage >= 70 ? 'text-rose-400' : riskPercentage >= 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {hasRiskMetrics ? `${riskPercentage}% · ${riskLabel}` : riskLabel}
          </div>
          <div className="relative w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: hasRiskMetrics ? `${Math.min(riskPercentage, 100)}%` : '0%' }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-semibold">
            {atRiskCount > 0 ? `${atRiskCount} high-priority task${atRiskCount === 1 ? '' : 's'} open` : 'No high-priority tasks flagged'}
          </p>
        </div>

        <div className="flex items-center space-x-3 p-1">
          {user?.photoURL || user?.photo ? (
            <img
              src={user?.photoURL || user?.photo}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full border border-gray-700 object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-xs flex items-center justify-center shrink-0 border border-gray-700">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-black text-gray-200 truncate">{displayName}</h4>
            <p className="text-[10px] text-gray-500 font-semibold truncate mt-0.5">{displayEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogoutAction}
          disabled={loading}
          className="w-full bg-[#161B26] hover:bg-rose-950/20 border border-gray-800/80 hover:border-rose-900/30 text-gray-400 hover:text-rose-400 disabled:opacity-50 font-bold text-[11px] py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center space-x-2 group"
        >
          <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Disconnect Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

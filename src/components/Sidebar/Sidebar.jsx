// src/components/Sidebar/Sidebar.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Timer, 
  User, 
  Settings,
  AlertTriangle,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';

const Sidebar = () => {
  const { user, loading, logout } = useAuth();
  const { metrics = { riskPercentage: 0 }, tasks = [] } = useTasks(); // Safe defaults crash se bachane ke liye
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Nav items list matching the exact interface specification
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'AI Planner', path: '/ai-planner', icon: MessageSquare },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Focus Mode', path: '/focus-mode', icon: Timer },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const displayName = user?.displayName || user?.name || (loading ? 'Syncing...' : 'Guest Node');
  const displayEmail = user?.email || (loading ? 'Loading session...' : 'No session active');
  
  const initials = useMemo(() => {
    return displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'G';
  }, [displayName]);

  const riskPercentage = metrics?.riskPercentage ?? 0;
  const hasRiskMetrics = metrics?.riskPercentage !== undefined && metrics?.riskPercentage !== null;
  
  const riskLabel = !hasRiskMetrics
    ? 'Awaiting AI sync'
    : riskPercentage >= 70
      ? 'High Risk'
      : riskPercentage >= 40
        ? 'Moderate Risk'
        : 'Low Risk';

  const atRiskCount = tasks.filter((t) => t.status !== 'Done' && t.priority === 'High').length;

  const highPriorityWarnings = useMemo(() => {
    const now = Date.now();
    return tasks.filter((task) => {
      if (task.status === 'Done' || task.priority !== 'High') return false;
      const deadline = new Date(task.deadline || task.scheduledTime || '');
      return !Number.isNaN(deadline.getTime()) && deadline.getTime() <= now;
    }).length;
  }, [tasks]);

  const badgePulseRef = useRef(null);

  useEffect(() => {
    if (highPriorityWarnings > 0 && badgePulseRef.current) {
      badgePulseRef.current.classList.add('animate-pulse');
      const timeout = setTimeout(() => {
        badgePulseRef.current?.classList.remove('animate-pulse');
      }, 2200);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [highPriorityWarnings]);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0E1729] via-[#1a1f3a] to-[#0E1729] border-r border-purple-500/10 flex flex-col h-screen justify-between flex-shrink-0 backdrop-blur-xl">
      {/* Top Brand Logo Section */}
      <div>
        <div className="p-6 flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain drop-shadow-[0_0_20px_rgba(124,58,237,0.4)]" />
          <div>
            <h1 className="font-extrabold text-lg text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text tracking-wide">DeadlineAI</h1>
            <p className="text-[10px] text-gray-500 font-medium">Help me finish.</p>
          </div>
        </div>

        {/* Middleware Pages Menu Route Links */}
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'glass-card bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-300 border-purple-500/30'
                      : 'text-gray-400 hover:glass-card hover:text-gray-200 hover:bg-white/5'
                  }`
                }
              >
                <IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Live Risk Telemetry Section */}
      <div className="p-4 space-y-4">
        <div className="glass-card p-4 rounded-2xl">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Deadline Risk
          </div>
          <div
            className={`font-extrabold text-sm mb-3 flex items-center space-x-1.5 ${
              !hasRiskMetrics
                ? 'text-gray-500'
                : riskPercentage >= 70
                  ? 'text-rose-400'
                  : riskPercentage >= 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{hasRiskMetrics ? `${riskPercentage}% · ${riskLabel}` : riskLabel}</span>
          </div>
          
          {/* Circular/Linear Arc Meter Emulation Wrapper */}
          <div className="relative w-full bg-gradient-to-r from-gray-700/50 to-gray-600/50 h-2 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: hasRiskMetrics ? `${Math.min(riskPercentage, 100)}%` : '0%' }}
            ></div>
          </div>
          {highPriorityWarnings > 0 ? (
            <div
              ref={badgePulseRef}
              className="mb-2 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-gradient-to-r from-rose-500/15 to-orange-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-300"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400 animate-pulse" />
              {highPriorityWarnings} overdue high-priority task{highPriorityWarnings === 1 ? '' : 's'}
            </div>
          ) : null}
          <div className="text-[11px] text-gray-400 font-medium">
            {atRiskCount > 0
              ? `You have ${atRiskCount} high-priority task${atRiskCount === 1 ? '' : 's'} at risk. Let's plan smartly!`
              : 'No high-priority tasks flagged. Keep momentum.'}
          </div>
        </div>

        {/* Minimalist User Identity Block footer */}
        <div className="flex items-center justify-between gap-3 p-3 glass-card rounded-xl border-purple-500/20">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {user?.photoURL || user?.photo ? (
              <img
                src={user?.photoURL || user?.photo}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg border border-purple-500/30 object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
                {initials}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text truncate">{displayName}</h4>
              <p className="text-[10px] text-gray-500 truncate">{displayEmail}</p>
            </div>
          </div>
          
          {/* Logout Button */}
          {user?.uid && user?.uid !== 'guest' && (
            <button
              onClick={async () => {
                setIsLoggingOut(true);
                await logout();
                navigate('/login');
              }}
              disabled={isLoggingOut}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all disabled:opacity-50 shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
// src/pages/Dashboard/Dashboard.jsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, metrics, loading } = useTasks();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const planned = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Done').length;
    const pending = tasks.filter((t) => t.status === 'To Do').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;

    return { planned, completed, pending, inProgress };
  }, [tasks]);

  const todaysPlan = useMemo(
    () => tasks.filter((t) => t.status !== 'Done').slice(0, 6),
    [tasks]
  );

  const upcomingDeadlines = useMemo(
    () => tasks.filter((t) => t.source === 'ai-deadline' && t.status !== 'Done').slice(0, 4),
    [tasks]
  );

  const todayLabel = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const priorityStyles = {
    High: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    Medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    Low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  const productivityScore = metrics.productivityScore;
  const riskPercentage = metrics.riskPercentage;
  const hasAiMetrics = productivityScore !== null && riskPercentage !== null;

  const riskLabel =
    riskPercentage >= 70 ? 'High Risk' : riskPercentage >= 40 ? 'Moderate Risk' : 'Low Risk';

  return (
    <div className="space-y-6">
      {/* Premium AI Assistant Card */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-start space-x-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Assistant</h3>
              <span className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-400/50 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">BETA</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              {user?.name
                ? `${user.name}, metrics below update live whenever AI Planner ingests your schedule.`
                : 'Metrics below update live whenever AI Planner ingests your schedule.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/ai-planner')}
          className="btn-premium text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-2 shrink-0 relative z-10"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chat with AI</span>
        </button>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl group">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tasks Planned</span>
          <span className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mt-2 block">{loading ? '—' : stats.planned}</span>
          <span className="text-[10px] text-cyan-400 font-bold mt-1 block">
            {stats.pending} pending · {stats.inProgress} in progress
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl group">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tasks Completed</span>
          <span className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text mt-2 block">{loading ? '—' : stats.completed}</span>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
            {stats.planned > 0 ? `${Math.round((stats.completed / stats.planned) * 100)}% completion rate` : 'No tasks yet'}
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl group">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Risk Status</span>
          <span className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text mt-2 block">
            {loading || !hasAiMetrics ? '—' : `${riskPercentage}%`}
          </span>
          <span
            className={`text-[10px] font-bold mt-1 block ${
              riskPercentage >= 70 ? 'text-rose-400' : riskPercentage >= 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {hasAiMetrics ? riskLabel : 'Run AI Planner to calculate risk'}
          </span>
        </div>
        <div className="glass-card p-5 rounded-2xl group">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Productivity Score</span>
          <span className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mt-2 block">
            {loading || !hasAiMetrics ? '—' : `${productivityScore}%`}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
            {hasAiMetrics
              ? productivityScore >= 75
                ? 'Strong momentum'
                : productivityScore >= 40
                  ? 'Room to improve'
                  : 'Needs attention'
              : 'Synced from latest AI telemetry'}
          </span>
        </div>
      </div>

      {/* Premium Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Today's Plan</h4>
            <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{todayLabel}</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-xs text-gray-500 font-semibold py-4 text-center">Loading tasks...</p>
            ) : todaysPlan.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold py-4 text-center">
                No plan yet — use AI Planner to ingest today's tasks.
              </p>
            ) : (
              todaysPlan.map((t) => (
                <div key={t.id} className="glass-card p-4 rounded-lg flex items-center justify-between gap-4 group hover:bg-white/5 transition-all">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shrink-0"></div>
                    <span className="text-xs font-bold text-gray-200 truncate">{t.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border shrink-0 ${
                      priorityStyles[t.priority] || priorityStyles.Medium
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl h-fit">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Upcoming Deadlines</h4>
          <div className="space-y-3">
            {loading ? (
              <p className="text-xs text-gray-500 font-semibold py-2 text-center">Loading...</p>
            ) : upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold py-2 text-center">No upcoming deadlines.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div key={t.id} className="glass-card p-3 rounded-lg flex items-center justify-between hover:bg-white/5 transition-all group">
                  <div>
                    <h5 className="text-xs font-bold text-gray-200 group-hover:text-purple-300 transition-colors">{t.name}</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">{t.deadline}</p>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-400">{t.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

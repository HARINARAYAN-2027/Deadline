// src/pages/Analytics/Analytics.jsx
import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';

const Analytics = () => {
  const { tasks, metrics, loading } = useTasks();

  const stats = useMemo(() => {
    const planned = tasks.length;
    const completed = tasks.filter((task) => task.status === 'Done').length;
    const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
    const pending = planned - completed;

    return { planned, completed, pending, inProgress };
  }, [tasks]);

  const parseTaskDate = (task) => {
    const raw = typeof task.deadline === 'string' ? task.deadline.trim() : '';
    if (!raw) return null;

    const now = new Date();
    const lower = raw.toLowerCase();

    if (lower.includes('today')) {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    if (lower.includes('tomorrow')) {
      const date = new Date(now);
      date.setDate(date.getDate() + 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }

    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed);
    }

    const monthMap = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    const match = raw.match(/(\d{1,2})\s+([A-Za-z]{3,9})/);
    if (match) {
      const day = Number(match[1]);
      const monthName = match[2].slice(0, 3).toLowerCase();
      const monthIndex = monthMap[monthName];
      if (monthIndex !== undefined && day >= 1 && day <= 31) {
        const date = new Date(now.getFullYear(), monthIndex, day);
        date.setHours(0, 0, 0, 0);
        return date;
      }
    }

    return null;
  };

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const summary = dayLabels.map((day) => ({ day, planned: 0, completed: 0 }));

    tasks.forEach((task) => {
      const taskDate = parseTaskDate(task);
      if (!taskDate) return;

      const diff = Math.floor((taskDate - weekStart) / (24 * 60 * 60 * 1000));
      if (diff < 0 || diff >= 7) return;

      summary[diff].planned += 1;
      if (task.status === 'Done') {
        summary[diff].completed += 1;
      }
    });

    return summary;
  }, [tasks]);

  const completionRate = stats.planned ? Math.round((stats.completed / stats.planned) * 100) : 0;
  const insight = metrics.aiInsights?.[0] ||
    (completionRate >= 80
      ? 'Excellent throughput — keep iterating with high-priority focus blocks.'
      : completionRate >= 50
        ? 'Maintain momentum by batching similar work and closing quick wins first.'
        : 'Rebalance overdue tasks and reduce context-switching to improve delivery.');

  return (
    <div className="space-y-6">
      
      {/* 📊 Top Control Action Header */}
      <div className="border-b border-purple-500/10 pb-5">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Analytics</h2>
        <p className="text-xs text-gray-400 mt-1">Deep visual insights into your productivity and task performance.</p>
      </div>

      {/* 🚀 Core Grid Metrics Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Primary Core: Bar Graph Core Simulation Container */}
        <div className="glass-card p-5 rounded-2xl md:col-span-2 flex flex-col justify-between border-purple-500/20">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Schedule Overview</h3>
              </div>
              
              {/* Custom Graph Legend Block */}
              <div className="flex items-center space-x-4 text-[10px] font-bold tracking-wider">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-950 border border-indigo-900"></div>
                  <span className="text-gray-500">PLANNED</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-indigo-500"></div>
                  <span className="text-indigo-400">COMPLETED</span>
                </div>
              </div>
            </div>

            {/* Weekly Schedule chart from live task data */}
            <div className="h-64 flex items-end justify-between px-4 pt-4 border-b border-gray-800/60 relative">
              {weeklyStats.map((stat) => (
                <div key={stat.day} className="flex flex-col items-center space-y-3 w-12 group">
                  <div className="flex items-end space-x-1 w-full justify-center h-full">
                    <div
                      className="w-3.5 rounded-t-md bg-indigo-950 border border-indigo-900/60 transition-all duration-300 group-hover:bg-indigo-900"
                      style={{ height: `${Math.min(stat.planned, 12) * 10 + 10}px` }}
                      title={`${stat.planned} planned`}
                    />
                    <div
                      className="w-3.5 rounded-t-md bg-gradient-to-t from-purple-500 to-pink-500 shadow-md shadow-purple-500/10 transition-all duration-300 group-hover:shadow-lg"
                      style={{ height: `${Math.min(stat.completed, 12) * 10 + 10}px` }}
                      title={`${stat.completed} completed`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{stat.day}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-[11px] text-gray-500 font-medium px-2">
            <span>Data Matrix Range: Active Stream</span>
            <span className="text-indigo-400 font-bold">Updated real-time</span>
          </div>
        </div>

        {/* Right Core: Core Insights Cards */}
        <div className="space-y-4">
          
          {/* Productivity Score breakdown card */}
          <div className="glass-card p-5 rounded-2xl flex items-center justify-between border-purple-500/20">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Completion Rate</span>
              <span className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mt-1 block">{loading ? '—' : `${completionRate}%`}</span>
              <span className="text-[11px] text-emerald-400 font-medium mt-1.5 block">
                {loading ? 'Calculating...' : `${stats.completed} of ${stats.planned} tasks completed`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Productivity Insights Engine Directive card */}
          <div className="glass-card p-5 rounded-2xl border-purple-500/20">
            <div className="flex items-center space-x-2 text-purple-400 mb-3">
              <Target className="w-4 h-4" />
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Insights</h4>
            </div>
            <div className="space-y-3 mt-4">
              <div className="p-3 glass-card rounded-lg border border-purple-500/10 text-xs font-medium text-gray-300 leading-relaxed">
                {insight}
              </div>
              <div className="p-3 glass-card rounded-lg border border-purple-500/10 text-xs font-medium text-gray-300 leading-relaxed">
                {metrics.riskPercentage != null
                  ? `Current risk: ${metrics.riskPercentage}% based on task urgency and deadlines.`
                  : 'Run AI Planner to derive risk metrics from your active task set.'}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;
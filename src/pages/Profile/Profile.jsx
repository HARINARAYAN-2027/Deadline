// src/pages/Profile/Profile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Mail, BookOpen, ShieldCheck, Milestone, Phone, Save, PencilLine, Zap, Target, Trophy, Calendar, TrendingUp, Award, Flame, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { defaultProfile, fetchUserProfile, persistUserProfile } from '../../services/profileService';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, metrics } = useTasks();
  const userId = user?.uid || 'guest';

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const seedName =
    user?.displayName ||
    user?.name ||
    (user?.email ? user.email.split('@')[0] : '') ||
    '';

  const seedEmail = user?.email || '';

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const stored = await fetchUserProfile(userId);
      const next = stored || defaultProfile({ displayName: seedName, email: seedEmail });

      if (!stored) {
        await persistUserProfile(userId, next);
      }

      if (active) {
        setProfile(next);
      }
    };

    hydrate();

    return () => {
      active = false;
    };
  }, [userId, seedName, seedEmail]);

  useEffect(() => {
    if (!profile) return;
    const nextName = seedName || profile.displayName;
    const nextEmail = seedEmail || profile.email;

    if (nextName === profile.displayName && nextEmail === profile.email) return;
    setProfile((prev) => ({ ...prev, displayName: nextName, email: nextEmail }));
  }, [seedName, seedEmail, profile]);

  const initials = useMemo(() => {
    const label = profile?.displayName || seedName || 'Guest';
    return (
      label
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'G'
    );
  }, [profile, seedName]);

  const joinedLabel = useMemo(() => {
    const timestamp = profile?.createdAt;
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }, [profile]);

  const stats = useMemo(() => {
    const planned = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Done').length;
    const hasAi = metrics?.lastUpdated !== null && metrics?.lastUpdated !== undefined;
    return { planned, completed, hasAi };
  }, [tasks, metrics]);

  const milestones = useMemo(() => {
    const items = [
      {
        id: 'first-task',
        title: 'Task Created',
        desc: 'Added at least one task into your workspace.',
        unlocked: stats.planned > 0,
        icon: Target,
        color: 'from-purple-500 to-pink-500',
      },
      {
        id: 'first-complete',
        title: 'First Completion',
        desc: 'Marked at least one task as done.',
        unlocked: stats.completed > 0,
        icon: Trophy,
        color: 'from-amber-500 to-orange-500',
      },
      {
        id: 'ai-sync',
        title: 'AI Sync Online',
        desc: 'AI Planner has ingested a structured plan at least once.',
        unlocked: stats.hasAi,
        icon: Zap,
        color: 'from-cyan-500 to-blue-500',
      },
      {
        id: 'half-done',
        title: 'Halfway There',
        desc: 'Complete 50% of your planned tasks.',
        unlocked: stats.planned > 0 && stats.completed >= stats.planned * 0.5,
        icon: Flame,
        color: 'from-rose-500 to-red-500',
      },
      {
        id: 'power-user',
        title: 'Power User',
        desc: 'Plan 10+ tasks in workspace.',
        unlocked: stats.planned >= 10,
        icon: Award,
        color: 'from-indigo-500 to-purple-500',
      },
      {
        id: 'completion-master',
        title: 'Completion Master',
        desc: 'Complete all planned tasks.',
        unlocked: stats.planned > 0 && stats.completed === stats.planned,
        icon: TrendingUp,
        color: 'from-emerald-500 to-green-500',
      },
    ];

    return items.map((item) => ({
      ...item,
      status: item.unlocked ? 'Unlocked' : 'Locked',
    }));
  }, [stats]);

  const completionRate = useMemo(() => {
    if (stats.planned === 0) return 0;
    return Math.round((stats.completed / stats.planned) * 100);
  }, [stats]);

  const profileCompletion = useMemo(() => {
    let completed = 0;
    let total = 7;
    if (profile?.displayName) completed++;
    if (profile?.email) completed++;
    if (profile?.institute) completed++;
    if (profile?.department) completed++;
    if (profile?.phone) completed++;
    if (profile?.bio) completed++;
    if (stats.planned > 0) completed++;
    return Math.round((completed / total) * 100);
  }, [profile, stats]);

  const productivityStats = useMemo(() => {
    const avgTasksPerDay = stats.planned > 0 ? (stats.planned / 30).toFixed(1) : 0;
    const daysActive = profile?.createdAt ? Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const uncompletedTasks = stats.planned - stats.completed;
    
    return {
      avgTasksPerDay,
      daysActive: daysActive > 0 ? daysActive : 'New',
      completionRate,
      uncompletedTasks,
      aiIntegrationDays: stats.hasAi ? '✓ Active' : 'Pending',
    };
  }, [stats, profile, completionRate]);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile || saving) return;
    setSaving(true);

    const next = await persistUserProfile(userId, {
      ...profile,
      displayName: seedName || profile.displayName,
      email: seedEmail || profile.email,
    });

    setProfile(next);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Gradient Text */}
      <div className="border-b border-purple-500/10 pb-5">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">Identity Matrix Center</h2>
        <p className="text-xs text-gray-400 mt-1">Manage your profile, achievements, and performance metrics.</p>
      </div>

      {/* 📊 Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tasks Planned</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">{stats.planned}</div>
          <p className="text-[10px] text-gray-500 mt-1">{productivityStats.avgTasksPerDay} per day</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-transparent bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text">{stats.completed}</div>
          <p className="text-[10px] text-gray-500 mt-1">{completionRate}% completion rate</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Days Active</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">{productivityStats.daysActive}</div>
          <p className="text-[10px] text-gray-500 mt-1">Member since {joinedLabel}</p>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">{profileCompletion}%</div>
          <p className="text-[10px] text-gray-500 mt-1">Complete your profile</p>
        </div>
      </div>

      {/* 🎯 Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Avatar Card with Profile Info */}
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center border-purple-500/20">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl">
            {initials}
          </div>
          
          <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text mt-4">
            {profile?.displayName || (authLoading ? 'Syncing...' : seedName || 'Guest Node')}
          </h3>
          <p className="text-[11px] font-bold text-gray-500 mt-1.5 flex items-center justify-center space-x-2">
            <span>{userId === 'guest' ? 'Guest Session' : 'Google Session'}</span>
            <span className="text-gray-700">•</span>
            <span>Active since {joinedLabel}</span>
          </p>

          {/* Profile Completion Bar */}
          <div className="w-full mt-6 pt-6 border-t border-purple-500/10">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Completion</span>
              <span className="text-xs font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>

          {/* User Details */}
          <div className="w-full space-y-3 mt-6 text-left">
            <div className="flex items-center space-x-3 text-xs p-3 rounded-lg bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
              <Mail className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-gray-300 font-medium truncate">
                {profile?.email || (authLoading ? 'Loading...' : seedEmail || 'No session')}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs p-3 rounded-lg bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-gray-300 font-medium truncate">
                {profile?.institute ? `${profile.institute}${profile.department ? ` (${profile.department})` : ''}` : 'Add institute'}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs p-3 rounded-lg bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
              <Phone className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="text-gray-300 font-medium truncate">
                {profile?.phone || 'Add phone number'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEditing((p) => !p)}
            disabled={!profile}
            className="mt-6 w-full btn-premium py-3 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <PencilLine className="w-4 h-4" />
            <span>{editing ? 'Close Editor' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Right: Achievements & Milestones */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text uppercase tracking-widest flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Achievements</span>
            </h4>
            {editing ? (
              <button
                type="submit"
                form="profile-edit-form"
                disabled={saving || !profile}
                className="btn-premium px-4 py-2 rounded-lg text-xs flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            ) : null}
          </div>

          {editing ? (
            <form id="profile-edit-form" onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Name (from login)
                  </label>
                  <input
                    value={seedName || profile?.displayName || ''}
                    disabled
                    className="w-full glass-card rounded-xl px-4 py-3 text-xs text-gray-200 disabled:opacity-70 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Email (from login)
                  </label>
                  <input
                    value={seedEmail || profile?.email || ''}
                    disabled
                    className="w-full glass-card rounded-xl px-4 py-3 text-xs text-gray-200 disabled:opacity-70 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Institute
                  </label>
                  <input
                    value={profile?.institute || ''}
                    onChange={handleChange('institute')}
                    placeholder="Your institute"
                    className="w-full glass-card rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Department
                  </label>
                  <input
                    value={profile?.department || ''}
                    onChange={handleChange('department')}
                    placeholder="Your department"
                    className="w-full glass-card rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      value={profile?.phone || ''}
                      onChange={handleChange('phone')}
                      placeholder="Your phone number"
                      className="w-full glass-card rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">
                    Bio
                  </label>
                  <input
                    value={profile?.bio || ''}
                    onChange={handleChange('bio')}
                    placeholder="Short bio"
                    className="w-full glass-card rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {milestones.map((ms) => {
                const Icon = ms.icon;
                return (
                  <div
                    key={ms.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      ms.status === 'Unlocked'
                        ? 'glass-card border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg'
                        : 'border-gray-800 bg-gray-900/20 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${ms.color} ${ms.status === 'Unlocked' ? '' : 'opacity-40'}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs font-extrabold text-gray-200 uppercase tracking-wide">{ms.title}</h5>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">{ms.desc}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                          ms.status === 'Unlocked'
                            ? 'text-purple-400 border-purple-500/30 bg-purple-500/10'
                            : 'text-gray-600 border-gray-800'
                        }`}
                      >
                        {ms.status}
                      </span>
                      {ms.status === 'Unlocked' && (
                        <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Completion Progress Chart */}
      <div className="glass-card p-6 rounded-2xl border-purple-500/20">
        <h4 className="text-sm font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text uppercase tracking-widest flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span>Performance Metrics</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Completion Rate */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completion Rate</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">{completionRate}%</div>
            <div className="mt-3 w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Tasks Remaining */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">In Progress</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">{productivityStats.uncompletedTasks}</div>
            <p className="text-xs text-gray-500 mt-2">tasks to complete</p>
          </div>

          {/* AI Integration */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Planning</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className={`text-3xl font-black ${stats.hasAi ? 'text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text' : 'text-gray-500'}`}>
              {productivityStats.aiIntegrationDays}
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.hasAi ? 'Actively using AI' : 'Start planning with AI'}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;

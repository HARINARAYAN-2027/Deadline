// src/utils/constants.js

export const APP_CONFIG = {
  NAME: 'DeadlineAI',
  SLOGAN: "Don't just remind me. Help me finish.",
  VERSION: 'v2.6.0-react',
};

export const PRIORITY_LEVELS = {
  HIGH: { label: 'High', color: 'border-rose-500/30 text-rose-400 bg-rose-500/5' },
  MEDIUM: { label: 'Medium', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' },
  LOW: { label: 'Low', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
};

export const DEFAULT_DASHBOARD_STATE = {
  user_name: 'Hari',
  productivity_score: 82,
  tasks_planned: 24,
  tasks_completed: 18,
  focus_time: '24h 15m',
  risk_percentage: 52,
};
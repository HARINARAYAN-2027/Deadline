// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Core Pages Imports
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import Tasks from '../pages/Tasks/Tasks';
import AIPlanner from '../pages/AIPlanner/AIPlanner';
import CalendarPage from '../pages/Calendar/Calendar';
import Analytics from '../pages/Analytics/Analytics';
import FocusMode from '../pages/FocusMode/FocusMode';
import Habits from '../pages/Habits/Habits';
import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🔐 Auth Group - Ab default lander yahi hoga */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* 🚀 Core Protected App Workspace */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/focus-mode" element={<FocusMode />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 🔄 Fallback Rule: Ab seedhe Login par land karao dummy bypass rokne ke liye */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
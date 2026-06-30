// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AppRoutes from './routes/AppRoutes';
import { TaskProvider } from './context/TaskContext';
import Loader from './components/Loader';
import NotificationManager from './components/Notification';

function App() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  if (isBooting) {
    return <Loader label="Loading" />;
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TaskProvider>
        <div className="min-h-screen bg-deep-dark text-[#F3F4F6] selection:bg-gradient-to-r selection:from-purple-600 selection:to-pink-600">
          {/* Notification Engine background validation hooks loop active */}
          <NotificationManager /> 
          
          <AppRoutes />
        </div>
      </TaskProvider>
      <SpeedInsights />
    </Router>
  );
}

export default App;

// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateWithGoogle } from '../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    const response = await authenticateWithGoogle();
    if (response.success) {
      console.log("Logged in user identity:", response.user);
      navigate('/dashboard'); // Login hote hi direct dashboard landing
    } else {
      setError(response.error || "Google authentication dropped.");
    }
  };

  return (
    <div className="w-full max-w-md glass-card p-8 rounded-3xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Access Terminal</h2>
        <p className="text-xs text-gray-400 mt-2">Synchronize your local identity dashboard matrix.</p>
      </div>

      {error && (
        <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs p-4 rounded-xl mb-6 font-medium text-center backdrop-blur-sm relative z-10">
          {error}
        </div>
      )}

      {/* Google Login Premium Button Block */}
      <button 
        type="button"
        onClick={handleGoogleLogin}
        className="w-full btn-premium text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center space-x-3 relative z-10 group/btn"
      >
        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="url(#googleGradient)" />
          <text x="12" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">G</text>
          <defs>
            <linearGradient id="googleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="25%" stopColor="#EA4335" />
              <stop offset="50%" stopColor="#FBBC04" />
              <stop offset="75%" stopColor="#34A853" />
              <stop offset="100%" stopColor="#4285F4" />
            </linearGradient>
          </defs>
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default Login;

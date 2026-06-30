// src/pages/Signup/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import { authenticateWithGoogle } from '../../services/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Fallback normal register routing bypass simulation
    navigate('/dashboard');
  };

  const handleGoogleSignup = async () => {
    setError('');
    const response = await authenticateWithGoogle();
    if (response.success) {
      console.log("Registered new user identity via Google Auth:", response.user);
      navigate('/dashboard'); // Successful registration landing
    } else {
      setError(response.error || "Google authorization sequence dropped.");
    }
  };

  return (
    <div className="w-full max-w-md bg-[#161B26] border border-[#242F41] p-8 rounded-2xl shadow-xl relative group">
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Create Terminal</h2>
        <p className="text-xs text-gray-400 mt-1">Register your credentials token inside the network grid.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl mb-4 font-medium text-center">
          {error}
        </div>
      )}

      {/* Google Signup Premium Button Block */}
      <button 
        type="button"
        onClick={handleGoogleSignup}
        className="w-full bg-[#11151D] hover:bg-[#192231] text-gray-200 border border-[#242F41] font-bold text-xs py-3 rounded-xl transition-all duration-150 flex items-center justify-center space-x-2 shadow-inner mb-6"
      >
        <Chrome className="w-4 h-4 text-rose-500" />
        <span>Sign up with Google</span>
      </button>

      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-gray-800/60"></div>
        <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">or legacy entry</span>
        <div className="flex-grow border-t border-gray-800/60"></div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Full Name Input Node */}
        <div className="relative">
          <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            required
            placeholder="Enter full identity name" 
            className="w-full bg-[#11151D] border border-[#242F41] rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Email Input Node */}
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
          <input 
            type="email" 
            required
            placeholder="Configure system email" 
            className="w-full bg-[#11151D] border border-[#242F41] rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Secure Access Key Node */}
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
          <input 
            type="password" 
            required
            placeholder="Create secure access key" 
            className="w-full bg-[#11151D] border border-[#242F41] rounded-xl pl-11 pr-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Form Submission Access Trigger */}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10"
        >
          <span>Register New Node</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Route Switcher Redirection Link */}
      <div className="mt-6 text-center">
        <p className="text-[11px] text-gray-500">
          Already verified user? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Access terminal login</Link>
        </p>
      </div>

    </div>
  );
};

export default Signup;
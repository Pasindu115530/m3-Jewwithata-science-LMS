'use client';

import React, { useState } from 'react';
import { FlaskConical, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('mia.sharma@sciencepractical.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(activeTab);
  };

  const handleDemoLogin = (role: 'student' | 'teacher') => {
    setActiveTab(role);
    if (role === 'student') {
      setEmail('mia.sharma@sciencepractical.edu');
    } else {
      setEmail('sarah.jenkins@sciencepractical.edu');
    }
    setPassword('demo123456');
    setTimeout(() => {
      onLoginSuccess(role);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8F5FF] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background soft glowing circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-purple-300/40 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-indigo-300/40 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl clay-card p-6 sm:p-10 relative z-10 bg-white/90 backdrop-blur-2xl">
        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <div
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <FlaskConical className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
            Science Practical LMS
          </h2>
          <p className="text-xs text-purple-600 font-medium">
            Sign in to access virtual labs, Zoom classes, and practical grades
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex p-1.5 bg-purple-100/70 rounded-full mb-6 border border-purple-200/60">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setEmail('mia.sharma@sciencepractical.edu');
            }}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'student'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setEmail('sarah.jenkins@sciencepractical.edu');
            }}
            className={`flex-1 py-2.5 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            <span>Teacher Portal</span>
          </button>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-purple-50 border border-purple-100 text-xs flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-purple-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> One-Click Demo Login:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDemoLogin('student')}
              className="px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700 transition"
            >
              Demo Student
            </button>
            <button
              onClick={() => handleDemoLogin('teacher')}
              className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700 transition"
            >
              Demo Teacher
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1.5 pl-1">
              {activeTab === 'student' ? 'Student Email' : 'Teacher Email'}
            </label>
            <div className="clay-input flex items-center px-4 py-3">
              <Mail className="w-4 h-4 text-purple-400 mr-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sciencepractical.edu"
                className="w-full bg-transparent border-none outline-none text-xs text-purple-950 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-purple-900 mb-1.5 pl-1">
              Password
            </label>
            <div className="clay-input flex items-center px-4 py-3">
              <Lock className="w-4 h-4 text-purple-400 mr-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent border-none outline-none text-xs text-purple-950 font-semibold"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-purple-800 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="text-purple-600 font-bold hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Large Rounded Button */}
          <button
            type="submit"
            className="w-full clay-btn py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition"
          >
            <span>Sign In to {activeTab === 'student' ? 'Student' : 'Teacher'} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-100"></div>
          </div>
          <span className="relative px-3 bg-white text-[11px] font-bold text-purple-400 uppercase">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Google Login */}
        <button
          onClick={() => onLoginSuccess(activeTab)}
          type="button"
          className="w-full py-3 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-100 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-purple-600 hover:underline"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};

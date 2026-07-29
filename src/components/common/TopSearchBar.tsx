'use client';

import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, Check, Flame, X } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { UserRole } from '../../types';

interface TopSearchBarProps {
  userRole: UserRole;
  userName: string;
  userAvatar: string;
  onRoleChange: (role: UserRole) => void;
  onOpenZoomModal: () => void;
  onOpenSearch?: (query: string) => void;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  userRole,
  userName,
  userAvatar,
  onRoleChange,
  onOpenZoomModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Title / Search Bar */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
        <div className="relative w-full clay-input flex items-center px-4 py-2.5">
          <Search className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for practicals, experiments, teachers, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-purple-950 placeholder-purple-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-purple-400 hover:text-purple-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Action Controls & Profile Pill */}
      <div className="flex items-center gap-3.5 w-full md:w-auto justify-end">
        {/* Streak Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-orange-100/80 border border-orange-200/80 text-orange-600 text-xs font-bold shadow-xs">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
          <span>7 Day Streak!</span>
        </div>

        {/* Live Zoom Quick Button */}
        <button
          onClick={onOpenZoomModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Class</span>
        </button>

        {/* Notifications Icon with Popup */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md flex items-center justify-center text-purple-600 relative transition transform hover:scale-105"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-purple-100/80 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="font-bold text-sm text-purple-950">Notifications</h4>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl transition border ${
                      n.read
                        ? 'bg-purple-50/30 border-purple-50 text-gray-600'
                        : 'bg-purple-50/80 border-purple-200/60 text-purple-950 font-medium'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-xs font-bold text-purple-900">{n.title}</h5>
                      <span className="text-[10px] text-purple-400 font-medium whitespace-nowrap">{n.timeAgo}</span>
                    </div>
                    <p className="text-xs text-purple-700/80 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Selector Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-white/80 border border-white/90 shadow-sm hover:shadow-md transition"
          >
            <span className="text-xs font-bold text-purple-900 hidden sm:inline">{userName}</span>
            <img
              src={userAvatar}
              alt={userName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border-2 border-purple-300"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-purple-100 z-50">
              <div className="px-3 py-2 border-b border-purple-50 mb-2">
                <p className="text-xs font-bold text-purple-950">{userName}</p>
                <p className="text-[11px] text-purple-500 capitalize">Role: {userRole}</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onRoleChange('student');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    userRole === 'student'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <span>Student View</span>
                  {userRole === 'student' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    onRoleChange('teacher');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    userRole === 'teacher'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <span>Teacher View</span>
                  {userRole === 'teacher' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    onRoleChange('public');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    userRole === 'public'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <span>Public Landing</span>
                  {userRole === 'public' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

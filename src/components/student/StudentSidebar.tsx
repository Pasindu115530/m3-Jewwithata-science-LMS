'use client';

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Video,
  FileCheck,
  HelpCircle,
  CreditCard,
  History,
  FlaskConical,
  Image,
  User,
  Settings,
  LogOut,
  Crown,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface StudentSidebarProps {
  student: StudentProfile;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onLogout: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  student,
  activeMenu,
  onSelectMenu,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lessons', label: 'Free Lessons', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'zoom', label: 'Today’s Zoom Class', icon: Video, badge: 'LIVE' },
    { id: 'labs', label: 'Lab Simulators', icon: FlaskConical },
    { id: 'assignments', label: 'Assignments', icon: FileCheck },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'payment-history', label: 'Payment History', icon: History },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="clay-sidebar w-full lg:w-72 p-5 flex flex-col justify-between min-h-[calc(100vh-32px)] shrink-0 my-2">
      <div className="space-y-6">
        {/* Large Rounded Profile Banner (Like Reference Image) */}
        <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
          <div className="relative mb-2">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-4 border-white/90 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white shadow-xs"></span>
          </div>
          <h3 className="font-extrabold text-white text-base">Hi, {student.name.split(' ')[0]}! 👋</h3>
          <p className="text-[11px] text-purple-100/90 font-medium">{student.grade} • {student.stream}</p>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMenu(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition transform ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-md scale-[1.02]'
                    : 'text-purple-100 hover:bg-white/15 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-purple-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-extrabold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Upgrade Card */}
      <div className="pt-4 space-y-3">
        <div className="clay-card-pink p-4 rounded-3xl text-white relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-amber-200 animate-bounce" />
            <span className="font-extrabold text-xs uppercase tracking-wider">Science Pro</span>
          </div>
          <p className="text-[11px] text-white/90 leading-tight mb-3">
            Unlock 50+ advanced virtual lab simulations & 1-on-1 teacher reviews!
          </p>
          <button className="w-full py-2 rounded-full bg-white text-pink-600 text-xs font-extrabold shadow-sm hover:bg-purple-50 transition">
            Upgrade Now
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-purple-200 hover:bg-white/10 hover:text-white font-bold text-xs transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

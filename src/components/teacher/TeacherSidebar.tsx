'use client';

import React from 'react';
import {
  LayoutDashboard,
  Video,
  CheckSquare,
  Users,
  Calendar,
  FileSpreadsheet,
  FileCheck,
  CreditCard,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { TeacherProfile } from '../../types';

interface TeacherSidebarProps {
  teacher: TeacherProfile;
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  onLogout: () => void;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  teacher,
  activeMenu,
  onSelectMenu,
  onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Today’s Classes', icon: Video, badge: '4 Today' },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'students', label: 'Student Roster', icon: Users },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'tests', label: 'Tests & Quizzes', icon: FileSpreadsheet },
    { id: 'assignments', label: 'Assignments', icon: FileCheck },
    { id: 'payment-approval', label: 'Payment Approvals', icon: CreditCard, badge: '3 Pending' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="clay-sidebar w-full lg:w-72 p-5 flex flex-col justify-between min-h-[calc(100vh-32px)] shrink-0 my-2">
      <div className="space-y-6">
        {/* Teacher Profile Banner */}
        <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
          <div className="relative mb-2">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-4 border-white/90 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white shadow-xs"></span>
          </div>
          <h3 className="font-extrabold text-white text-base">{teacher.name}</h3>
          <p className="text-[11px] text-purple-100/90 font-medium">{teacher.title}</p>
        </div>

        {/* Navigation Menu */}
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
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[9px] font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-white/20">
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

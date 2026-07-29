'use client';

import React, { useState } from 'react';
import { mockTeacher } from '@/data/mockData';
import { TopSearchBar } from '@/components/common/TopSearchBar';
import { TeacherSidebar } from '@/components/teacher/TeacherSidebar';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';
import { TimetableModule } from '@/components/shared/TimetableModule';
import { QuizzesModule } from '@/components/shared/QuizzesModule';
import { AssignmentsModule } from '@/components/shared/AssignmentsModule';
import { PaymentsModule } from '@/components/shared/PaymentsModule';
import { ZoomClassModal } from '@/components/common/ZoomClassModal';
import { useRouter } from 'next/navigation';

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);

  const handleSelectMenu = (menu: string) => {
    setActiveMenu(menu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F5FF] text-[#2E2842] font-sans p-3 sm:p-5 flex flex-col lg:flex-row gap-5 items-start">
      <TeacherSidebar
        teacher={mockTeacher}
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        onLogout={() => router.push('/')}
      />

      <main className="flex-1 w-full min-w-0 max-w-7xl mx-auto py-2 space-y-4">
        <TopSearchBar
          userRole="teacher"
          userName={mockTeacher.name}
          userAvatar={mockTeacher.avatar}
          onRoleChange={(role) => {
            if (role === 'student') router.push('/student/dashboard/');
            if (role === 'public') router.push('/');
          }}
          onOpenZoomModal={() => setZoomModalOpen(true)}
        />

        {(activeMenu === 'dashboard' || activeMenu === 'classes') && (
          <TeacherDashboard onOpenZoomModal={() => setZoomModalOpen(true)} />
        )}
        {activeMenu === 'attendance' && (
          <TeacherDashboard onOpenZoomModal={() => setZoomModalOpen(true)} />
        )}
        {activeMenu === 'students' && (
          <TeacherDashboard onOpenZoomModal={() => setZoomModalOpen(true)} />
        )}
        {activeMenu === 'timetable' && (
          <TimetableModule onOpenZoomModal={() => setZoomModalOpen(true)} />
        )}
        {activeMenu === 'tests' && <QuizzesModule />}
        {activeMenu === 'assignments' && <AssignmentsModule />}
        {activeMenu === 'payment-approval' && <PaymentsModule />}
        {activeMenu === 'settings' && (
          <div className="clay-card p-8 space-y-4">
            <h3 className="text-2xl font-black text-purple-950">Teacher Administration Settings</h3>
            <p className="text-xs text-purple-600 font-medium">{mockTeacher.name} • {mockTeacher.email}</p>
          </div>
        )}
      </main>

      <ZoomClassModal
        isOpen={zoomModalOpen}
        onClose={() => setZoomModalOpen(false)}
      />
    </div>
  );
}

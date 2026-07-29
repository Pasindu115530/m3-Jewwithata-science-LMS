'use client';

import React, { useState } from 'react';
import { mockStudent } from '@/data/mockData';
import { TopSearchBar } from '@/components/common/TopSearchBar';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { TimetableModule } from '@/components/shared/TimetableModule';
import { QuizzesModule } from '@/components/shared/QuizzesModule';
import { AssignmentsModule } from '@/components/shared/AssignmentsModule';
import { PaymentsModule } from '@/components/shared/PaymentsModule';
import { GalleryModule } from '@/components/shared/GalleryModule';
import { ZoomClassModal } from '@/components/common/ZoomClassModal';
import { InteractiveLabModal } from '@/components/student/InteractiveLabModal';
import { useRouter } from 'next/navigation';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [activeLabType, setActiveLabType] = useState<'titration' | 'optics' | 'pendulum' | null>(null);

  const handleSelectMenu = (menu: string) => {
    setActiveMenu(menu);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F5FF] text-[#2E2842] font-sans p-3 sm:p-5 flex flex-col lg:flex-row gap-5 items-start">
      <StudentSidebar
        student={mockStudent}
        activeMenu={activeMenu}
        onSelectMenu={handleSelectMenu}
        onLogout={() => router.push('/')}
      />

      <main className="flex-1 w-full min-w-0 max-w-7xl mx-auto py-2 space-y-4">
        <TopSearchBar
          userRole="student"
          userName={mockStudent.name}
          userAvatar={mockStudent.avatar}
          onRoleChange={(role) => {
            if (role === 'teacher') router.push('/teacher/dashboard/');
            if (role === 'public') router.push('/');
          }}
          onOpenZoomModal={() => setZoomModalOpen(true)}
        />

        {activeMenu === 'dashboard' && (
          <StudentDashboard
            onSelectMenu={handleSelectMenu}
            onOpenZoomModal={() => setZoomModalOpen(true)}
            onOpenLabSimulator={(labType) => setActiveLabType(labType)}
          />
        )}
        {activeMenu === 'lessons' && (
          <StudentDashboard
            onSelectMenu={handleSelectMenu}
            onOpenZoomModal={() => setZoomModalOpen(true)}
            onOpenLabSimulator={(labType) => setActiveLabType(labType)}
          />
        )}
        {activeMenu === 'timetable' && (
          <TimetableModule onOpenZoomModal={() => setZoomModalOpen(true)} />
        )}
        {activeMenu === 'zoom' && (
          <div className="clay-card p-8 text-center space-y-4">
            <h3 className="text-2xl font-black text-purple-950">Today’s Science Live Zoom Practical</h3>
            <p className="text-xs text-purple-600 font-medium">Click below to launch the live stream and interactive worksheet!</p>
            <button
              onClick={() => setZoomModalOpen(true)}
              className="clay-btn px-8 py-3.5 text-xs font-bold inline-flex items-center gap-2"
            >
              Launch Live Class Window →
            </button>
          </div>
        )}
        {activeMenu === 'labs' && (
          <div className="clay-card p-8 text-center space-y-4">
            <h3 className="text-2xl font-black text-purple-950">Virtual Science Lab Simulators</h3>
            <p className="text-xs text-purple-600 font-medium font-mono">Choose a simulator experiment to run in real-time:</p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveLabType('titration')}
                className="clay-btn px-6 py-3 text-xs font-bold"
              >
                🧪 Acid-Base Titration
              </button>
              <button
                onClick={() => setActiveLabType('optics')}
                className="clay-btn px-6 py-3 text-xs font-bold"
              >
                🔍 Refraction & Optics
              </button>
              <button
                onClick={() => setActiveLabType('pendulum')}
                className="clay-btn px-6 py-3 text-xs font-bold"
              >
                ⚛️ Pendulum Oscillation
              </button>
            </div>
          </div>
        )}
        {activeMenu === 'assignments' && <AssignmentsModule />}
        {activeMenu === 'quizzes' && <QuizzesModule />}
        {(activeMenu === 'payments' || activeMenu === 'payment-history') && <PaymentsModule />}
        {activeMenu === 'gallery' && <GalleryModule />}
        {(activeMenu === 'profile' || activeMenu === 'settings') && (
          <div className="clay-card p-8 space-y-4">
            <h3 className="text-2xl font-black text-purple-950">Student Profile & Settings</h3>
            <p className="text-xs text-purple-600 font-medium font-mono">ID: {mockStudent.studentId} • {mockStudent.email}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-purple-50 font-bold">
                <span>Grade Stream:</span> <span className="text-purple-700">{mockStudent.grade} ({mockStudent.stream})</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 font-bold">
                <span>Overall Attendance:</span> <span className="text-emerald-700">{mockStudent.attendanceRate}%</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <ZoomClassModal
        isOpen={zoomModalOpen}
        onClose={() => setZoomModalOpen(false)}
      />

      <InteractiveLabModal
        labType={activeLabType}
        onClose={() => setActiveLabType(null)}
      />
    </div>
  );
}

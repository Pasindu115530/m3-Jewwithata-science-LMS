'use client';

import React, { useState } from 'react';
import { LandingPage } from '@/components/public/LandingPage';
import { ZoomClassModal } from '@/components/common/ZoomClassModal';
import { InteractiveLabModal } from '@/components/student/InteractiveLabModal';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [activeLabType, setActiveLabType] = useState<'titration' | 'optics' | 'pendulum' | null>(null);

  const handleSelectRole = (role: UserRole) => {
    if (role === 'student') {
      router.push('/student/dashboard/');
    } else if (role === 'teacher') {
      router.push('/teacher/dashboard/');
    }
  };

  return (
    <>
      <LandingPage
        onSelectRole={handleSelectRole}
        onNavigateToLogin={() => router.push('/login/')}
        onOpenZoomModal={() => setZoomModalOpen(true)}
        onOpenLabSimulator={(labType) => setActiveLabType(labType)}
      />

      {/* Global Interactive Modals */}
      <ZoomClassModal
        isOpen={zoomModalOpen}
        onClose={() => setZoomModalOpen(false)}
      />

      <InteractiveLabModal
        labType={activeLabType}
        onClose={() => setActiveLabType(null)}
      />
    </>
  );
}

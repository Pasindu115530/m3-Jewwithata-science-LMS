'use client';

import React from 'react';
import { LoginPage } from '@/components/public/LoginPage';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

export default function LoginRoutePage() {
  const router = useRouter();

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'student') {
      router.push('/student/dashboard/');
    } else {
      router.push('/teacher/dashboard/');
    }
  };

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onBackToHome={() => router.push('/')}
    />
  );
}

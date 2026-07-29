'use client';

import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GalleryModule } from '@/components/shared/GalleryModule';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#F8F5FF] font-sans antialiased text-[#2E2842]">
      <Navbar activeSection="gallery" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <GalleryModule />
      </main>

      <Footer />
    </div>
  );
}

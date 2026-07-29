'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { mockLessons } from '@/data/mockData';
import { InteractiveLabModal } from '@/components/student/InteractiveLabModal';
import { Clock, Play, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chemistry' | 'physics' | 'biology'>('chemistry');
  const [activeLabType, setActiveLabType] = useState<'titration' | 'optics' | 'pendulum' | null>(null);

  const filteredLessons = mockLessons.filter(
    (les) => les.subject.toLowerCase() === activeTab
  );

  return (
    <div className="min-h-screen bg-[#F8F5FF] font-sans antialiased text-[#2E2842]">
      <Navbar activeSection="courses" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Interactive Practical Courses</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-purple-950 tracking-tight">
            Virtual Science Laboratories & Simulations
          </h1>
          <p className="text-sm text-purple-800/80 font-medium">
            Explore step-by-step simulations across Chemistry, Physics, and Biology.
          </p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex justify-center gap-3">
          {(['chemistry', 'physics', 'biology'] as const).map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveTab(subject)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold capitalize transition ${
                activeTab === subject
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-purple-900 border border-purple-100 hover:bg-purple-50'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Lessons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="clay-card p-5 flex flex-col justify-between hover:scale-[1.02] transition"
            >
              <div>
                <img
                  src={lesson.thumbnail}
                  alt={lesson.title}
                  width={400}
                  height={220}
                  loading="lazy"
                  className="w-full h-48 rounded-2xl object-cover border border-purple-100 mb-4"
                />
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">
                  {lesson.subject} • {lesson.difficulty}
                </span>
                <h3 className="font-bold text-base text-purple-950 mt-2 mb-1">{lesson.title}</h3>
                <p className="text-xs text-purple-700/80 font-medium line-clamp-2">{lesson.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-purple-100">
                <span className="text-xs text-purple-600 flex items-center gap-1 font-semibold">
                  <Clock className="w-4 h-4" /> {lesson.duration}
                </span>
                <button
                  onClick={() => setActiveLabType(lesson.labType as any)}
                  className="clay-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Simulator</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <InteractiveLabModal
        labType={activeLabType}
        onClose={() => setActiveLabType(null)}
      />
    </div>
  );
}

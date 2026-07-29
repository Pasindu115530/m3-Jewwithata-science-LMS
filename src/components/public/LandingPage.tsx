'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Video,
  Calendar,
  FileCheck,
  HelpCircle,
  Play,
  ArrowRight,
  Star,
  CheckCircle,
  Atom,
  Microscope,
  Sparkles,
  Users,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { mockLessons, mockZoomClasses, mockTimetable, mockGallery } from '../../data/mockData';
import { UserRole } from '../../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onNavigateToLogin: () => void;
  onOpenZoomModal: () => void;
  onOpenLabSimulator: (labType: 'titration' | 'optics' | 'pendulum') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onNavigateToLogin,
  onOpenZoomModal,
  onOpenLabSimulator
}) => {
  const [activeTab, setActiveTab] = useState<'chemistry' | 'physics' | 'biology'>('chemistry');

  const filteredLessons = mockLessons.filter(
    (les) => les.subject.toLowerCase() === activeTab
  );

  return (
    <div className="min-h-screen bg-[#F8F5FF] font-sans antialiased text-[#2E2842] overflow-x-hidden">
      <Navbar
        userRole="public"
        onSelectRole={onSelectRole}
        activeSection="home"
      />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-8 pb-16 max-w-7xl mx-auto">
        <div className="clay-card p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white/90 via-purple-50/50 to-purple-100/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-extrabold shadow-2xs animate-bounce">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Next-Gen 3D Soft UI LMS for Practical Education</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-purple-950 tracking-tight leading-[1.15]">
                Interactive Science Practical <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Learning Platform
                </span>
              </h1>

              <p className="text-sm sm:text-base text-purple-800/80 max-w-xl font-medium leading-relaxed">
                Learn science through virtual lab experiments, HD video demonstrations, automated practical quizzes, and interactive live Zoom practical classes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectRole('student');
                  }}
                  className="clay-btn px-6 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition transform"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onSelectRole('student');
                  }}
                  className="clay-btn-secondary px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Student Login</span>
                </button>

                <button
                  onClick={() => {
                    onSelectRole('teacher');
                  }}
                  className="px-5 py-3.5 rounded-full bg-indigo-100/90 text-indigo-700 hover:bg-indigo-200 text-xs sm:text-sm font-bold transition flex items-center gap-2"
                >
                  <span>Teacher Portal</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-purple-700/80 font-semibold">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> 10,000+ Students</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> 250+ Virtual Experiments</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Live Zoom Integration</span>
              </div>
            </div>

            {/* Right Hero Visual / Interactive Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden p-2 bg-gradient-to-tr from-purple-300 via-indigo-200 to-pink-200 shadow-2xl animate-float-slow">
                <img
                  src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1000"
                  alt="Science Practical Hero"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover rounded-[28px] border-2 border-white/80"
                />

                {/* Floating Interactive Badge 1 */}
                <div className="absolute top-6 left-6 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <FlaskConical className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-400 uppercase font-extrabold">Active Simulator</p>
                    <p className="text-xs font-bold text-purple-950">Acid-Base Titration</p>
                  </div>
                </div>

                {/* Floating Interactive Badge 2 */}
                <div className="absolute bottom-6 right-6 p-3.5 rounded-2xl bg-purple-900/90 text-white backdrop-blur-md shadow-xl border border-purple-500/40 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <p className="text-xs font-bold">Zoom Practical Live Now!</p>
                    <button
                      onClick={onOpenZoomModal}
                      className="text-[11px] text-purple-300 underline font-semibold hover:text-white"
                    >
                      Click to Join Live Class →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold uppercase tracking-wider">
            Comprehensive Learning System
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-purple-950 mt-3">
            Designed specifically for <span className="text-purple-600">Practical Excellence</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <FlaskConical className="w-6 h-6 text-purple-600" />,
              title: 'Interactive Practicals',
              desc: 'Step-by-step virtual lab simulations where students can adjust parameters, perform measurements, and calculate error margins.'
            },
            {
              icon: <Video className="w-6 h-6 text-pink-600" />,
              title: 'Zoom Live Classes',
              desc: 'Attend scheduled HD live Zoom practical sessions with certified professors and participate in live lab discussions.'
            },
            {
              icon: <FileCheck className="w-6 h-6 text-indigo-600" />,
              title: 'Assignments & Reports',
              desc: 'Upload practical observations, graphs, and worksheets directly to your student portal for teacher evaluation.'
            },
            {
              icon: <Calendar className="w-6 h-6 text-amber-600" />,
              title: 'Weekly Timetable',
              desc: 'Never miss a lab class. Stay organized with automated class schedules, reminders, and Zoom meeting links.'
            },
            {
              icon: <HelpCircle className="w-6 h-6 text-emerald-600" />,
              title: 'Automated Quizzes',
              desc: 'Test your knowledge on practical apparatus setups, chemical equations, and ray diagrams with instant feedback.'
            },
            {
              icon: <Sparkles className="w-6 h-6 text-violet-600" />,
              title: '3D Soft UI Dashboard',
              desc: 'Enjoy a clean, friendly, tactile design inspired by modern claymorphism for effortless navigation.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="clay-card p-6 clay-card-interactive flex flex-col justify-between"
            >
              <div className="clay-badge-icon bg-purple-50 mb-4">{item.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-purple-950 mb-2">{item.title}</h3>
                <p className="text-xs text-purple-800/70 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Virtual Lab Simulators Preview */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="clay-card p-8 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-purple-800/80 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/40">
                VIRTUAL SCIENCE LAB SIMULATOR
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white">
                Try a Virtual Practical Right Now
              </h3>
            </div>
            {/* Subject Tabs */}
            <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-full border border-slate-700">
              {(['chemistry', 'physics', 'biology'] as const).map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveTab(subject)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                    activeTab === subject
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="bg-slate-800/80 border border-purple-500/30 rounded-3xl p-5 flex flex-col justify-between hover:border-purple-400 transition">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase border border-purple-500/30">
                      {lesson.subject} • {lesson.difficulty}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1">{lesson.title}</h4>
                    <p className="text-xs text-slate-300/80 mt-1 line-clamp-2">{lesson.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700/80">
                  <span className="text-xs text-purple-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {lesson.duration}
                  </span>
                  <button
                    onClick={() => onOpenLabSimulator(lesson.labType as any)}
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Simulator</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Live Classes & Timetable Preview */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upcoming Zoom Live Classes */}
        <div className="lg:col-span-6 clay-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="clay-badge-icon bg-pink-100 text-pink-600">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-purple-950">Upcoming Live Zoom Classes</h3>
                <p className="text-xs text-purple-500">Scheduled for today & tomorrow</p>
              </div>
            </div>
            <button
              onClick={onOpenZoomModal}
              className="text-xs text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {mockZoomClasses.map((zoom) => (
              <div key={zoom.id} className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={zoom.teacherAvatar}
                    alt={zoom.teacherName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-purple-950">{zoom.title}</h4>
                    <p className="text-[11px] text-purple-600 font-medium">{zoom.teacherName} • {zoom.time} ({zoom.date})</p>
                  </div>
                </div>

                <button
                  onClick={onOpenZoomModal}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${
                    zoom.isLiveNow
                      ? 'bg-red-500 text-white animate-pulse shadow-md'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {zoom.isLiveNow ? 'Join Live Now' : 'Schedule'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timetable Preview */}
        <div className="lg:col-span-6 clay-card p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="clay-badge-icon bg-indigo-100 text-indigo-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-purple-950">Weekly Timetable Preview</h3>
                <p className="text-xs text-purple-500">Grade 12 Science Stream</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {mockTimetable.slice(0, 4).map((tt) => (
              <div key={tt.id} className="p-3.5 rounded-2xl bg-white border border-purple-100/90 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${tt.color}`}>
                    {tt.subject}
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-purple-950">{tt.topic}</h5>
                    <p className="text-[10px] text-purple-500">{tt.teacher} • {tt.room}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full">
                  {tt.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase">
            Practical Moments
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">
            Student Laboratory Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockGallery.map((item) => (
            <div key={item.id} className="clay-card p-3 group overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold">
                  {item.category}
                </span>
              </div>
              <h4 className="font-bold text-xs text-purple-950 px-1">{item.title}</h4>
              <p className="text-[10px] text-purple-500 px-1 mt-0.5">{item.date} • ❤️ {item.likes} Likes</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="clay-card p-8 bg-gradient-to-br from-purple-100/60 via-white to-purple-50/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-black text-purple-950">Loved by Students & Educators</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The virtual titration simulator helped me understand pH curve calculation before doing my actual school lab test!',
                name: 'Mia Sharma',
                role: 'Grade 12 Science Student',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
              },
              {
                quote: 'Managing 128 practical students became so easy with automated attendance and Zoom practical integration.',
                name: 'Prof. Sarah Jenkins',
                role: 'Lead Chemistry Lecturer',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
              },
              {
                quote: 'The 3D clay soft UI is so clean and enjoyable to use every day for checking my practical timetable.',
                name: 'Alex Vance',
                role: 'Physics Stream Student',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
              }
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-3xl bg-white/90 border border-purple-100 shadow-2xs space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-purple-900 font-medium italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-purple-200"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-purple-950">{t.name}</h5>
                    <p className="text-[10px] text-purple-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

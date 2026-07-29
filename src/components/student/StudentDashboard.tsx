'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Video,
  FileCheck,
  HelpCircle,
  CreditCard,
  History,
  Award,
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle,
  Clock,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mockStudent,
  mockLessons,
  mockZoomClasses,
  mockAssignments,
  mockQuizzes,
  mockPayments,
  mockNotifications,
  mockTasks,
  weeklyLearningChartData,
  attendanceChartData
} from '../../data/mockData';

interface StudentDashboardProps {
  onSelectMenu: (menu: string) => void;
  onOpenZoomModal: () => void;
  onOpenLabSimulator: (labType: 'titration' | 'optics' | 'pendulum') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectMenu,
  onOpenZoomModal,
  onOpenLabSimulator
}) => {
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP WELCOME BANNER (With Science Student Banner Visual & Direct Join Class) */}
      <div className="clay-card-purple p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Interactive Science Practical Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Good Morning, {mockStudent.name.split(' ')[0]}! 🧪
          </h2>

          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
            Today’s science lesson: <span className="font-bold underline text-white">Acid-Base Titration & Convex Lens Optics</span>. Your Zoom live class starts in 15 minutes!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenZoomModal}
              className="px-5 py-3 rounded-full bg-white text-purple-900 font-extrabold text-xs shadow-lg hover:bg-purple-50 transition transform hover:scale-105 flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>Join Live Zoom Class</span>
            </button>

            <button
              onClick={() => onOpenLabSimulator('titration')}
              className="px-5 py-3 rounded-full bg-purple-900/40 text-white border border-white/40 font-bold text-xs hover:bg-purple-900/60 transition flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Lab Simulator</span>
            </button>
          </div>
        </div>

        {/* Banner Visual Art */}
        <div className="relative w-full md:w-64 h-44 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl shrink-0">
          <img
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600"
            alt="Student Lab Experiment"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent flex items-end p-3">
            <p className="text-[11px] font-bold text-white flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-300" /> Grade 12 Advanced Lab
            </p>
          </div>
        </div>
      </div>

      {/* 2. BELOW BANNER: 8 LARGE ROUNDED CARDS (Soft Neumorphic Styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Free Lessons */}
        <div
          onClick={() => onSelectMenu('lessons')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-purple-100 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-extrabold">
              24 Unlocked
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Free Lessons</h4>
            <p className="text-2xl font-black text-purple-950 mt-1">24 Practicals</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              +4 new this week
            </p>
          </div>
        </div>

        {/* Card 2: Timetable */}
        <div
          onClick={() => onSelectMenu('timetable')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-blue-100 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-extrabold">
              Today: 5 Classes
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Timetable</h4>
            <p className="text-2xl font-black text-purple-950 mt-1">5 Sessions</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">
              Next: Chemistry @ 10:30 AM
            </p>
          </div>
        </div>

        {/* Card 3: Today's Zoom Class */}
        <div
          onClick={onOpenZoomModal}
          className="clay-card p-5 clay-card-interactive bg-gradient-to-br from-pink-50/80 to-purple-50/80 border-pink-200/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-pink-100 text-pink-600">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-pink-500 text-white text-[10px] font-extrabold animate-pulse">
              LIVE NOW
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-pink-600 uppercase tracking-wider">Today's Zoom Class</h4>
            <p className="text-lg font-black text-purple-950 mt-1 line-clamp-1">Organic Reactions</p>
            <button className="mt-2 text-xs font-extrabold text-pink-600 hover:underline flex items-center gap-1">
              Click to Join Live Class →
            </button>
          </div>
        </div>

        {/* Card 4: Assignments */}
        <div
          onClick={() => onSelectMenu('assignments')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-amber-100 text-amber-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-extrabold">
              2 Pending
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Assignments</h4>
            <p className="text-2xl font-black text-purple-950 mt-1">2 Due Soon</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              Titration report due Jul 30
            </p>
          </div>
        </div>

        {/* Card 5: Quizzes */}
        <div
          onClick={() => onSelectMenu('quizzes')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-indigo-100 text-indigo-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-extrabold">
              Tomorrow
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Quizzes</h4>
            <p className="text-xl font-black text-purple-950 mt-1">Optics Practical</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">
              10 Questions • 15 Mins
            </p>
          </div>
        </div>

        {/* Card 6: Payments */}
        <div
          onClick={() => onSelectMenu('payments')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-emerald-100 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
              $45 Due
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Payments</h4>
            <p className="text-2xl font-black text-purple-950 mt-1">$45.00</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              Pay Now via Portal
            </p>
          </div>
        </div>

        {/* Card 7: Payment History */}
        <div
          onClick={() => onSelectMenu('payment-history')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-violet-100 text-violet-600">
              <History className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-extrabold">
              4 Paid Slips
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Payment History</h4>
            <p className="text-2xl font-black text-purple-950 mt-1">Invoices</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">
              Download PDF Receipts
            </p>
          </div>
        </div>

        {/* Card 8: Attendance */}
        <div
          onClick={() => onSelectMenu('profile')}
          className="clay-card p-5 clay-card-interactive flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="clay-badge-icon bg-teal-100 text-teal-600">
              <Award className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-[10px] font-extrabold">
              94.5% Rate
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Attendance</h4>
            <p className="text-2xl font-black text-purple-950 mt-1">94.5%</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              Excellent Standing
            </p>
          </div>
        </div>
      </div>

      {/* 3. CHARTS SECTION & RIGHT WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Analytics & Progress Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Learning Progress Chart */}
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-base text-purple-950">Weekly Learning & Lab Progress</h3>
                <p className="text-xs text-purple-500">Study hours vs virtual experiments completed</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                This Week
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyLearningChartData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7E7694' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7E7694' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      border: '1px solid #E9D5FF',
                      boxShadow: '0 10px 25px rgba(139, 92, 246, 0.15)'
                    }}
                  />
                  <Bar dataKey="hours" name="Study Hours" fill="#8B5CF6" radius={[12, 12, 0, 0]} />
                  <Bar dataKey="labs" name="Labs Finished" fill="#F472B6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Donut & Lab Completion Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donut Attendance */}
            <div className="clay-card p-6 flex flex-col justify-between">
              <h4 className="font-extrabold text-sm text-purple-950 mb-2">Attendance Distribution</h4>
              <div className="h-44 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceChartData}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {attendanceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-xl font-black text-purple-950">94.5%</p>
                  <p className="text-[10px] text-purple-500 font-bold uppercase">Present</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-bold pt-2">
                <span className="flex items-center gap-1 text-purple-700"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Present</span>
                <span className="flex items-center gap-1 text-peach-600"><span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span> Late</span>
                <span className="flex items-center gap-1 text-pink-600"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Absent</span>
              </div>
            </div>

            {/* Experiment Completion Gauge */}
            <div className="clay-card p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-purple-950 mb-1">Practical Syllabus Completion</h4>
                <p className="text-xs text-purple-500 mb-4">18 of 24 required practicals finished</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>Chemistry Practicals</span>
                      <span className="text-purple-600">80%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-purple-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full w-[80%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>Physics Practicals</span>
                      <span className="text-pink-600">70%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-pink-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full w-[70%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-purple-900 mb-1">
                      <span>Biology Practicals</span>
                      <span className="text-emerald-600">75%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-emerald-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[75%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenLabSimulator('titration')}
                className="mt-4 w-full py-2.5 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold hover:bg-purple-200 transition"
              >
                Resume Unfinished Practical →
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Widgets (Tasks, Notifications, Recent Lesson) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Tasks Interactive Checklist */}
          <div className="clay-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-extrabold text-sm text-purple-950">Today's Tasks</h4>
              <span className="text-xs text-purple-500 font-bold">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    task.completed
                      ? 'bg-purple-50/40 border-purple-100 text-purple-400 line-through'
                      : 'bg-white border-purple-100 text-purple-950 font-bold hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                      task.completed ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-300'
                    }`}>
                      {task.completed && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs">{task.text}</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-normal">{task.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Recent Lesson */}
          <div className="clay-card p-6 space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold">
              CONTINUE LESSON
            </span>
            <h4 className="font-extrabold text-sm text-purple-950">{mockLessons[0].title}</h4>
            <img
              src={mockLessons[0].thumbnail}
              alt={mockLessons[0].title}
              referrerPolicy="no-referrer"
              className="w-full h-32 rounded-2xl object-cover border border-purple-100"
            />
            <p className="text-xs text-purple-700/80 leading-relaxed">{mockLessons[0].description}</p>
            <button
              onClick={() => onOpenLabSimulator('titration')}
              className="w-full clay-btn py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Launch Virtual Lab
            </button>
          </div>

          {/* Quick Links Widget */}
          <div className="clay-card p-6 space-y-3">
            <h4 className="font-extrabold text-sm text-purple-950">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onSelectMenu('timetable')}
                className="p-3 rounded-2xl bg-purple-50 text-purple-800 font-bold hover:bg-purple-100 transition text-left"
              >
                📅 Class Timetable
              </button>
              <button
                onClick={() => onSelectMenu('quizzes')}
                className="p-3 rounded-2xl bg-indigo-50 text-indigo-800 font-bold hover:bg-indigo-100 transition text-left"
              >
                📝 Take Quiz
              </button>
              <button
                onClick={() => onSelectMenu('payments')}
                className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold hover:bg-emerald-100 transition text-left"
              >
                💳 Pay Fees
              </button>
              <button
                onClick={() => onSelectMenu('gallery')}
                className="p-3 rounded-2xl bg-pink-50 text-pink-800 font-bold hover:bg-pink-100 transition text-left"
              >
                🖼️ Science Gallery
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM BANNER: KEEP LEARNING SCIENCE QUOTE */}
      <div className="clay-card p-6 sm:p-8 bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 border border-purple-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base text-purple-950">Keep Learning • Science Quote of the Day</h4>
            <p className="text-xs sm:text-sm text-purple-800/90 font-medium italic mt-0.5">
              "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less."
            </p>
            <p className="text-[11px] font-extrabold text-purple-600 mt-1">— Marie Curie (Nobel Laureate in Physics & Chemistry)</p>
          </div>
        </div>

        <button
          onClick={() => onSelectMenu('lessons')}
          className="clay-btn px-6 py-3 text-xs font-bold whitespace-nowrap shadow-md hover:scale-105 transition"
        >
          Explore All Lessons →
        </button>
      </div>
    </div>
  );
};

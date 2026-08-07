"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  MessageCircle,
  Sparkles,
  Search,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui";
import { siteConfig } from "@/lib/site";

// ── TYPES ────────────────────────────────────────────────────────────────────

export interface ClassSession {
  name: string;      // e.g. "Theory Class", "Paper Class"
  dayTime: string;   // e.g. "Friday • 3:30 PM – 5:30 PM"
  location: string;  // e.g. "Maharagama Physical Hall"
  isLiveStream?: boolean;
}

export type ThemePreset = "red" | "green" | "purple" | "brown" | "yellow" | "blue";

export interface GradeScheduleItem {
  id: string;
  gradeBadge1: string; // "GRADE"
  gradeBadge2: string; // "06", "07", etc.
  grade: string;       // "Grade 6"
  title: string;
  subtitle: string;
  instructor: string;
  mode: "Physical" | "Online" | "Hybrid";
  location: string;
  image?: string;
  theme: ThemePreset;
  schedules: ClassSession[];
}

// ── COLOR THEME PRESETS ──────────────────────────────────────────────────────

const THEME_STYLES: Record<ThemePreset, {
  bg: string;
  dayBadgeBg: string;
  dayBadgeText: string;
  titleColor: string;
  textColor: string;
  accentGlow: string;
  border: string;
  isLight?: boolean;
}> = {
  red: {
    bg: "bg-gradient-to-r from-red-950 via-rose-900 to-red-900",
    dayBadgeBg: "bg-red-500/20 border border-red-400/30",
    dayBadgeText: "text-red-200",
    titleColor: "text-white",
    textColor: "text-red-100/80",
    accentGlow: "shadow-[0_0_30px_rgba(239,68,68,0.25)]",
    border: "border-red-500/30",
  },
  green: {
    bg: "bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950",
    dayBadgeBg: "bg-emerald-500/20 border border-emerald-400/30",
    dayBadgeText: "text-emerald-200",
    titleColor: "text-white",
    textColor: "text-emerald-100/80",
    accentGlow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    border: "border-emerald-500/30",
  },
  purple: {
    bg: "bg-gradient-to-r from-purple-950 via-violet-900 to-indigo-950",
    dayBadgeBg: "bg-purple-500/20 border border-purple-400/30",
    dayBadgeText: "text-purple-200",
    titleColor: "text-white",
    textColor: "text-purple-100/80",
    accentGlow: "shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    border: "border-purple-500/30",
  },
  brown: {
    bg: "bg-gradient-to-r from-[#2A170B] via-[#432311] to-[#1F1108]",
    dayBadgeBg: "bg-amber-700/25 border border-amber-600/30",
    dayBadgeText: "text-amber-200",
    titleColor: "text-amber-100",
    textColor: "text-amber-200/80",
    accentGlow: "shadow-[0_0_30px_rgba(180,83,9,0.25)]",
    border: "border-amber-700/40",
  },
  yellow: {
    bg: "bg-gradient-to-r from-[#5e4001] via-[#946506] to-[#cf8c0c]",
    dayBadgeBg: "bg-yellow-400/20 border border-yellow-300/30",
    dayBadgeText: "text-yellow-100",
    titleColor: "text-white",
    textColor: "text-amber-100/85",
    accentGlow: "shadow-[0_0_30px_rgba(207,140,12,0.3)]",
    border: "border-[#cf8c0c]/40",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-950 via-sky-900 to-indigo-950",
    dayBadgeBg: "bg-blue-500/20 border border-blue-400/30",
    dayBadgeText: "text-blue-200",
    titleColor: "text-white",
    textColor: "text-blue-100/80",
    accentGlow: "shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    border: "border-blue-500/30",
  },
};

// ── TIMETABLE DATASET ────────────────────────────────────────────────────────

export const gradeSchedules: GradeScheduleItem[] = [
  {
    id: "g6",
    gradeBadge1: "GRADE",
    gradeBadge2: "06",
    grade: "Grade 6",
    title: "06 ශ්‍රේණිය (Grade 6 Science)",
    subtitle: "Science Foundation • Theory, Practicals & Paper Practice",
    instructor: "With Kalhara Nakandala",
    mode: "Physical",
    location: "Maharagama & Zoom",
    image: "/images/banners/timetableg6.avif",
    theme: "red",
    schedules: [
      {
        name: "Smart Science Theory Class",
        dayTime: "Friday • 3:30 PM – 5:30 PM",
        location: "Maharagama Physical Hall",
      },
      {
        name: "Smart Science Paper Class",
        dayTime: "Monday • 6:30 PM – 8:00 PM",
        location: "Zoom Online Live",
        isLiveStream: true,
      },
    ],
  },
  {
    id: "g7",
    gradeBadge1: "GRADE",
    gradeBadge2: "07",
    grade: "Grade 7",
    title: "07 ශ්‍රේණිය (Grade 7 Science)",
    subtitle: "Science Explorer • Concepts, Experiments & Question Analysis",
    instructor: "With Kalhara Nakandala",
    mode: "Physical",
    location: "Maharagama & Zoom",
    image: "/images/banners/timetableg7.avif",
    theme: "green",
    schedules: [
      {
        name: "Smart Science Theory Class",
        dayTime: "Thursday • 4:00 PM – 6:00 PM",
        location: "Maharagama Physical Hall",
      },
      {
        name: "Smart Science Paper Class",
        dayTime: "Monday • 8:00 PM – 9:30 PM",
        location: "Zoom Online Live",
      },
    ],
  },
  {
    id: "g8",
    gradeBadge1: "GRADE",
    gradeBadge2: "08",
    grade: "Grade 8",
    title: "08 ශ්‍රේණිය (Grade 8 Science)",
    subtitle: "Science Theory & Diagram Analysis Class",
    instructor: "With Kalhara Nakandala",
    mode: "Physical",
    location: "Nugegoda & Zoom",
    image: "/images/banners/timetableg8.avif",
    theme: "purple",
    schedules: [
      {
        name: "Smart Science Theory Class",
        dayTime: "Monday • 4:00 PM – 6:00 PM",
        location: "Nugegoda Physical Center",
      },
      {
        name: "Smart Science Paper Class",
        dayTime: "Sunday • 8:00 PM – 9:30 PM",
        location: "Zoom Online Live",
        isLiveStream: true,
      },
    ],
  },
  {
    id: "g9",
    gradeBadge1: "GRADE",
    gradeBadge2: "09",
    grade: "Grade 9",
    title: "09 ශ්‍රේණිය (Grade 9 Science)",
    subtitle: "Revision + Paper Practice & Speed Discussions",
    instructor: "With Kalhara Nakandala",
    mode: "Online",
    location: "Zoom Online",
    image: "/images/banners/timetableg9.avif",
    theme: "brown",
    schedules: [
      {
        name: "Theory & Revision Class",
        dayTime: "Wednesday • 5:00 PM – 7:00 PM",
        location: "Zoom Online Live",
        isLiveStream: true,
      },
      {
        name: "Smart Science Paper Class",
        dayTime: "Wednesday • 6:30 PM – 8:00 PM",
        location: "Zoom Online Live",
        isLiveStream: true,
      },
    ],
  },
  {
    id: "g10",
    gradeBadge1: "GRADE",
    gradeBadge2: "10",
    grade: "Grade 10",
    title: "10 ශ්‍රේණිය (Grade 10 O/L Science)",
    subtitle: "O/L Target Theory & Speed Paper Discussion",
    instructor: "With Kalhara Nakandala",
    mode: "Physical",
    location: "Maharagama Center",
    image: "/images/banners/timetableg10.avif",
    theme: "yellow",
    schedules: [
      {
        name: "O/L Science Theory Class",
        dayTime: "Saturday • 8:30 AM – 11:00 AM",
        location: "Maharagama Center",
      },
      {
        name: "O/L Target Paper Discussion",
        dayTime: "Saturday • 11:15 AM – 1:00 PM",
        location: "Maharagama Center",
      },
    ],
  },
  {
    id: "g11",
    gradeBadge1: "GRADE",
    gradeBadge2: "11",
    grade: "Grade 11",
    title: "11 ශ්‍රේණිය (Grade 11 Final O/L Science)",
    subtitle: "Final O/L Marathon • Theory, Target Papers & Revision",
    instructor: "With Kalhara Nakandala",
    mode: "Hybrid",
    location: "Maharagama & Zoom",
    image: "/images/banners/timetableg11.avif",
    theme: "blue",
    schedules: [
      {
        name: "FIRST SESSION • Theory & Core Concepts",
        dayTime: "Sunday • 7:30 AM – 10:30 AM",
        location: "Maharagama Physical Hall",
      },
      {
        name: "SECOND SESSION • O/L Essay Paper Discussion",
        dayTime: "Sunday • 11:00 AM – 1:30 PM",
        location: "Maharagama Physical Hall",
      },
      {
        name: "THIRD SESSION • Zoom Revision & Q&A",
        dayTime: "Sunday • 2:00 PM – 5:00 PM",
        location: "Zoom Online Live Stream",
        isLiveStream: true,
      },
    ],
  },
];

// ── SUB-COMPONENT: GRADE CARD ────────────────────────────────────────────────

function GradeCard({ item }: { item: GradeScheduleItem }) {
  const styles = THEME_STYLES[item.theme] || THEME_STYLES.blue;
  const isLight = styles.isLight;

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.8rem] transition-all duration-300 hover:scale-[1.005] ${styles.bg} ${styles.accentGlow} ${styles.border}`}
    >
      {/* Right Banner Image - Instructor Face & Upper Body Focal Point */}
      {item.image && (
        <div className="absolute right-0 top-0 bottom-0 h-full w-64 sm:w-80 lg:w-96 hidden lg:block overflow-hidden rounded-r-[1.8rem] z-0 pointer-events-none">
          <Image
            src={item.image}
            alt={item.title}
            fill
            quality={75}
            sizes="(max-width: 1024px) 100vw, 384px"
            className="object-cover object-[center_top] scale-115 transition-transform duration-500 group-hover:scale-125"
          />
        </div>
      )}

      {/* Inner Content Flex Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-[125px] p-4 sm:p-4.5 md:py-3.5 md:px-5 lg:pr-96 gap-4 sm:gap-5">

        {/* Left Vertical Grade Badge */}
        <div
          className={`flex flex-row md:flex-col items-center justify-center gap-1.5 md:gap-0 px-4 py-2 md:py-3 rounded-[1.4rem] min-w-[90px] sm:min-w-[105px] shrink-0 text-center font-black tracking-tight ${styles.dayBadgeBg} ${styles.dayBadgeText}`}
        >
          <span className="text-xs uppercase leading-none font-black tracking-widest opacity-80">
            {item.gradeBadge1}
          </span>
          <span className="text-2xl sm:text-3xl uppercase leading-none font-black mt-0.5">
            {item.gradeBadge2}
          </span>
        </div>

        {/* Middle Grade Content & Class Times */}
        <div className="flex-1 flex flex-col justify-center space-y-1.5 pr-0 md:pr-4 z-20">
          {/* Header Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${isLight ? "bg-slate-900 text-white" : "bg-white/20 text-white backdrop-blur-md"
                }`}
            >
              {item.grade}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${item.mode === "Online"
                  ? "bg-sky-500 text-white"
                  : item.mode === "Physical"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-500 text-slate-950"
                }`}
            >
              {item.mode}
            </span>
            <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-white/60"}`}>
              📍 {item.location}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2
              className={`text-lg sm:text-xl font-black tracking-tight leading-snug ${isLight ? "text-slate-950" : styles.titleColor
                }`}
            >
              {item.title}
            </h2>
            <p
              className={`text-xs font-semibold ${isLight ? "text-slate-600" : styles.textColor
                }`}
            >
              {item.subtitle} • <span className="font-extrabold">{item.instructor}</span>
            </p>
          </div>

          {/* Class Schedule Times Breakdown */}
          <div className={`mt-1 space-y-1 border-t pt-2 ${isLight ? "border-slate-300/80" : "border-white/15"}`}>
            {item.schedules.map((sched, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-extrabold tracking-wider uppercase ${isLight ? "text-slate-950" : "text-white"}`}>
                    🕒 {sched.dayTime}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${isLight ? "bg-slate-900 text-white" : "bg-white/20 text-white"}`}>
                    {sched.name}
                  </span>
                  {sched.isLiveStream && (
                    <span className="flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-black text-white animate-pulse">
                      <Video size={11} /> LIVE STREAM
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enrol & Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            <Link
              href="/student/register"
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black transition-all hover:scale-105 ${isLight
                  ? "bg-[#002583] text-white shadow-md hover:bg-navy-900"
                  : "bg-white text-slate-950 shadow-md hover:bg-slate-100"
                }`}
            >
              Enrol Now <ChevronRight size={14} />
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Hello Sir, I want to inquire about ${item.grade} class schedule.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${isLight
                  ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                  : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                }`}
            >
              <MessageCircle size={14} className="text-emerald-400" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN TIMETABLE POSTER COMPONENT ──────────────────────────────────────────

export function TimetablePoster() {
  const [selectedGrade, setSelectedGrade] = useState<string>("All grades");
  const [selectedMode, setSelectedMode] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const grades = ["All grades", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];
  const modes = ["All", "Physical", "Online", "Hybrid"];

  const filteredSchedule = gradeSchedules.filter((item) => {
    // Grade filter
    if (selectedGrade !== "All grades" && item.grade !== selectedGrade) return false;

    // Mode filter
    if (selectedMode !== "All" && item.mode !== selectedMode && !item.location.includes(selectedMode)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchGrade = item.grade.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchSched = item.schedules.some(s => s.name.toLowerCase().includes(q) || s.dayTime.toLowerCase().includes(q));
      if (!matchTitle && !matchGrade && !matchLoc && !matchSched) return false;
    }

    return true;
  });

  return (
    <div className="w-full">
      {/* Top Filter Controls */}
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {grades.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${selectedGrade === g
                    ? "bg-[#002583] text-white shadow-md scale-[1.03]"
                    : "bg-white/80 text-zinc-700 hover:bg-white border border-zinc-200/80"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Bar: Search & Mode Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grade, day, or class title..."
              className="w-full rounded-2xl border border-zinc-200/90 bg-white/90 pl-10 pr-4 py-2 text-xs text-zinc-800 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500">Mode:</span>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`rounded-xl px-3 py-1 text-xs font-extrabold transition ${selectedMode === m
                    ? "bg-[#FFB800] text-[#002583]"
                    : "bg-white/70 text-zinc-600 hover:bg-white"
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Schedule Container */}
      <section className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

        {/* Top Poster Title "GRADES" */}
        <div className="relative z-10 text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#002583]/20 bg-[#002583]/10 px-4 py-1.5 text-xs font-extrabold tracking-widest text-[#002583] uppercase backdrop-blur-md">
            <Sparkles size={14} className="text-[#FFB800] animate-pulse" />
            {siteConfig.teacher} • SCIENCE LMS
          </div>

          <h1 className="mt-2 text-6xl sm:text-8xl font-black tracking-tighter uppercase text-[#002583] leading-none font-sans drop-shadow-sm">
            GRADES
          </h1>
        </div>

        {/* Cards Stack */}
        <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
          {filteredSchedule.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-soft">
              <Calendar size={48} className="mx-auto text-amber-500 opacity-60" />
              <p className="mt-4 text-lg font-bold text-zinc-800">No grades match your filter</p>
              <p className="mt-1 text-sm text-zinc-500">Try clearing filters or search criteria.</p>
              <button
                onClick={() => {
                  setSelectedGrade("All grades");
                  setSelectedMode("All");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-full bg-[#FFB800] px-6 py-2.5 text-xs font-black text-[#002583]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredSchedule.map((item) => (
              <GradeCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Bottom Poster Title "TIMETABLE" */}
        <div className="relative z-10 text-center mt-10">
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase text-[#002583] leading-none font-sans drop-shadow-sm">
            TIMETABLE
          </h1>
          <p className="mt-3 text-xs font-black text-[#002583]/60 tracking-wider">
            KALHARA NAKANDALA • SCIENCE TUITION CLASS SCHEDULE
          </p>
        </div>
      </section>
    </div>
  );
}

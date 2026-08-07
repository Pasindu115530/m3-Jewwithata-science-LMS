"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Search,
  MessageCircle,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Card } from "@/components/ui";
import { classes } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site";

export function ClassesPoster() {
  const [selectedGrade, setSelectedGrade] = useState<string>("All grades");
  const [selectedMode, setSelectedMode] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const grades = ["All grades", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];
  const modes = ["All", "Physical", "Online"];

  const filteredClasses = classes.filter((c) => {
    // Grade filter
    if (selectedGrade !== "All grades" && c.grade !== selectedGrade) return false;

    // Mode filter
    if (selectedMode !== "All") {
      const paperSchedule = c.paperClass?.schedule.toLowerCase() || "";
      const theoryNote = c.theoryClass?.note.toLowerCase() || "";
      const fullText = `${c.title} ${c.fullTitle || ""} ${paperSchedule} ${theoryNote}`.toLowerCase();
      if (selectedMode === "Online" && !fullText.includes("zoom") && !fullText.includes("online")) return false;
      if (selectedMode === "Physical" && !fullText.includes("maharagama") && !fullText.includes("nugegoda") && !fullText.includes("physical")) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q) || (c.fullTitle && c.fullTitle.toLowerCase().includes(q));
      const matchGrade = c.grade.toLowerCase().includes(q);
      const matchPaper = c.paperClass && (c.paperClass.name.toLowerCase().includes(q) || c.paperClass.schedule.toLowerCase().includes(q));
      const matchTheory = c.theoryClass && (c.theoryClass.name.toLowerCase().includes(q) || c.theoryClass.note.toLowerCase().includes(q));
      if (!matchTitle && !matchGrade && !matchPaper && !matchTheory) return false;
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
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedGrade === g
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
              placeholder="Search grade, subject, or class title..."
              className="w-full rounded-2xl border border-zinc-200/90 bg-white/90 pl-10 pr-4 py-2 text-xs text-zinc-800 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500">Mode:</span>
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`rounded-xl px-3 py-1 text-xs font-extrabold transition ${
                  selectedMode === m
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

      {/* Main Container */}
      <section className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

        {/* Top Poster Title "CLASSES" */}
        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#002583]/20 bg-[#002583]/10 px-4 py-1.5 text-xs font-extrabold tracking-widest text-[#002583] uppercase backdrop-blur-md">
            <Sparkles size={14} className="text-[#FFB800] animate-pulse" />
            {siteConfig.teacher} • SCIENCE LMS
          </div>

          <h1 className="mt-2 text-6xl sm:text-8xl font-black tracking-tighter uppercase text-[#002583] leading-none font-sans drop-shadow-sm">
            CLASSES
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-bold text-[#002583]/70 max-w-xl mx-auto">
            Compare theory, revision, paper, online and physical class options for Grades 6 to 11.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="relative z-10">
          {filteredClasses.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-soft">
              <BookOpen size={48} className="mx-auto text-amber-500 opacity-60" />
              <p className="mt-4 text-lg font-bold text-zinc-800">No classes match your filter</p>
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((c) => (
                <Card
                  key={c.grade + c.title}
                  className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 p-0 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(0,37,131,0.12)]"
                >
                  {c.titleImage && (
                    <div className="relative w-full overflow-hidden">
                      <Image
                        src={c.titleImage}
                        alt={c.fullTitle || c.title}
                        width={600}
                        height={340}
                        className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-4 text-base font-extrabold tracking-tight text-zinc-900">
                      {c.fullTitle || `${c.grade} (${c.title})`}
                    </h3>
                    {c.paperClass && (
                      <div className="mb-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            {c.paperClass.name}
                          </span>
                          <span className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                            {c.paperClass.status}
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-medium text-zinc-700">{c.paperClass.schedule}</p>
                      </div>
                    )}
                    {c.theoryClass && (
                      <div className="mb-4 rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-3.5 backdrop-blur-md">
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                            <span className="inline-block h-2 w-2 rounded-full bg-zinc-400" />
                            {c.theoryClass.name}
                          </span>
                          <span className="rounded-full bg-zinc-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
                            {c.theoryClass.status}
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-normal leading-relaxed text-zinc-500">{c.theoryClass.note}</p>
                      </div>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
                      <Link href="/student/register" className="gradient-button flex-1 py-2.5 text-xs">
                        Enrol now <ChevronRight size={14} className="ml-1 inline" />
                      </Link>
                      <a
                        href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello Sir, I want to inquire about ${c.grade} class options.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill text-xs py-2 px-3 hover:bg-white"
                      >
                        <MessageCircle size={15} className="text-emerald-500" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Poster Title "SCIENCE CLASSES" */}
        <div className="relative z-10 text-center mt-12">
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase text-[#002583] leading-none font-sans drop-shadow-sm">
            SCIENCE CLASSES
          </h1>
          <p className="mt-3 text-xs font-black text-[#002583]/60 tracking-wider">
            KALHARA NAKANDALA • SCIENCE TUITION CLASS DIRECTORY
          </p>
        </div>
      </section>
    </div>
  );
}

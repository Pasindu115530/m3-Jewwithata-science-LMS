"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  fetchStudentAnnouncements, 
  AnnouncementItem, 
  AnnouncementCategory, 
  AnnouncementPriority 
} from "@/lib/services/announcements";
import { 
  Bell, 
  Search, 
  Pin, 
  CheckCheck, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Radio, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";

interface StudentProfile {
  grade?: string;
  enrolledClasses?: string[];
  enrollments?: Record<string, any>;
}

export default function StudentNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [studentGrade, setStudentGrade] = useState<string>("Grade 10");
  const [enrolledClasses, setEnrolledClasses] = useState<string[]>([]);
  const [userUid, setUserUid] = useState<string>("");

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "pinned" | "exam" | "zoom">("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);

        // Load read notifications from local storage
        try {
          const stored = localStorage.getItem(`read_notifs_${user.uid}`);
          if (stored) {
            setReadIds(new Set(JSON.parse(stored)));
          }
        } catch (e) {
          console.error("Error reading localStorage:", e);
        }

        try {
          // 1. Fetch Student Profile
          const studentDoc = await getDoc(doc(db, "users", user.uid));
          let grade = "Grade 10";
          let enrolled: string[] = [];

          if (studentDoc.exists()) {
            const data = studentDoc.data() as StudentProfile;
            grade = data.grade || "Grade 10";
            enrolled = data.enrolledClasses || [];
          }

          setStudentGrade(grade);
          setEnrolledClasses(enrolled);

          // 2. Fetch Targeted Announcements
          const list = await fetchStudentAnnouncements(grade, enrolled);
          setAnnouncements(list);
        } catch (err) {
          console.error("Error loading notifications:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = (id?: string) => {
    if (!id || !userUid) return;
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(`read_notifs_${userUid}`, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const markAllAsRead = () => {
    if (!userUid) return;
    const allIds = announcements.map((a) => a.id).filter(Boolean) as string[];
    const next = new Set(allIds);
    setReadIds(next);
    try {
      localStorage.setItem(`read_notifs_${userUid}`, JSON.stringify(allIds));
    } catch (e) {}
  };

  // Filtered
  const filteredNotifs = announcements.filter((item) => {
    const isRead = item.id ? readIds.has(item.id) : false;

    // Search
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetClass.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category / State filter
    if (activeFilter === "unread") return !isRead;
    if (activeFilter === "pinned") return item.pinned;
    if (activeFilter === "exam") return item.category === "Exam Notice";
    if (activeFilter === "zoom") return item.category === "Zoom Update" || item.category === "Class Schedule";

    return true;
  });

  const unreadCount = announcements.filter((a) => a.id && !readIds.has(a.id)).length;

  const getPriorityBadge = (p: AnnouncementPriority) => {
    if (p === "Urgent") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700 border border-red-200 shadow-sm animate-pulse">
          <AlertTriangle size={12} /> Urgent
        </span>
      );
    }
    if (p === "Important") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 border border-amber-200 shadow-sm">
          <Sparkles size={12} /> Important
        </span>
      );
    }
    return null;
  };

  const getCategoryBadge = (cat: AnnouncementCategory) => {
    switch (cat) {
      case "Exam Notice":
        return <Badge tone="yellow">📝 Exam Notice</Badge>;
      case "Class Schedule":
        return <Badge tone="blue">📅 Class Schedule</Badge>;
      case "Assignment":
        return <Badge tone="pink">📚 Assignment / Tute</Badge>;
      case "Zoom Update":
        return <Badge tone="blue">🎥 Zoom Update</Badge>;
      case "Urgent":
        return <Badge tone="pink">🚨 Urgent Alert</Badge>;
      default:
        return <Badge tone="yellow">📢 Notice</Badge>;
    }
  };

  return (
    <StudentGuard>
      <DashboardShell role="student" active="Notifications">
        {/* ── TOP HEADER & AUDIENCE BANNER ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#002583] text-[#FFB800] shadow-md">
              <Bell size={24} className="stroke-[2.5]" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#002583]">
                Class Notifications
              </h1>
              <p className="text-xs sm:text-sm font-medium text-ink/60">
                Announcements sent for <strong className="text-[#002583] font-bold">{studentGrade}</strong> &amp; your enrolled classes.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-2.5 text-xs font-extrabold text-[#002583] shadow-sm backdrop-blur-md transition hover:bg-white active:scale-95"
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
        </div>

        {/* ── AUDIENCE CHIPS STRIP ── */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#FFB800]/20 px-3 py-1 text-xs font-black text-[#002583] border border-[#FFB800]/40">
            🎯 Your Grade: {studentGrade}
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            🔔 {unreadCount} Unread {unreadCount === 1 ? "Notice" : "Notices"}
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
            📚 Broadcasts: All Classes + {studentGrade}
          </span>
        </div>

        {/* ── SEARCH & FILTER TABS ── */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/75 p-3.5 shadow-card backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Search notifications, exams, schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/80 bg-white/80 py-2 pl-9 pr-3 text-xs sm:text-sm outline-none transition focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/40"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: `Unread (${unreadCount})` },
              { id: "pinned", label: "📌 Pinned" },
              { id: "exam", label: "Exams" },
              { id: "zoom", label: "Live & Zoom" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeFilter === tab.id
                    ? "bg-[#002583] text-white shadow-sm"
                    : "bg-white/80 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── NOTIFICATIONS FEED ── */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 size={36} className="animate-spin text-[#002583]" />
              <p className="mt-3 text-sm font-bold text-ink/60">Checking for new class announcements...</p>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <EmptyState
              emoji="🔔"
              title="No notifications to show"
              description={
                searchQuery || activeFilter !== "all"
                  ? "No announcements match your search or selected filter."
                  : `You're all caught up! There are currently no new announcements for ${studentGrade}. Check back later before your live class.`
              }
              actionLabel="Return to My Courses"
              actionHref="/student/courses"
            />
          ) : (
            filteredNotifs.map((item) => {
              const isRead = item.id ? readIds.has(item.id) : false;

              return (
                <Card
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`relative cursor-pointer overflow-hidden rounded-3xl border p-5 sm:p-6 shadow-card backdrop-blur-md transition-all duration-200 hover:shadow-lg ${
                    !isRead
                      ? "border-amber-300 bg-amber-50/40 hover:bg-amber-50/60"
                      : "border-white/80 bg-white/85 hover:bg-white"
                  } ${item.pinned ? "border-l-4 border-l-[#FFB800]" : !isRead ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-zinc-200"}`}
                >
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left Header */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Target Class Badge */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#002583]/10 px-2.5 py-0.5 text-xs font-black text-[#002583]">
                          <Users size={12} /> {item.targetClass}
                        </span>

                        {/* Category Badge */}
                        {getCategoryBadge(item.category)}

                        {/* Priority Badge */}
                        {getPriorityBadge(item.priority)}

                        {/* Pinned Badge */}
                        {item.pinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-800 border border-amber-300">
                            <Pin size={11} className="fill-amber-600 text-amber-600" /> Pinned
                          </span>
                        )}

                        {/* Unread indicator */}
                        {!isRead && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-black text-red-600 border border-red-200 animate-pulse">
                            ● New
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                        {item.title}
                      </h2>
                    </div>

                    {/* Mark read button */}
                    {!isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(item.id);
                        }}
                        className="self-end sm:self-auto rounded-xl border border-zinc-200 bg-white/80 px-3 py-1 text-[11px] font-extrabold text-zinc-600 hover:bg-zinc-100 transition"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="mt-3.5 rounded-2xl bg-white/70 p-4 text-xs sm:text-sm leading-relaxed text-zinc-700 border border-zinc-100 whitespace-pre-line">
                    {item.message}
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 text-[11px] font-bold text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-600 font-extrabold">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      Teacher: {item.authorName || "Kalhara Nakandala"}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Clock size={12} /> Target Grade: {item.targetGrade}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DashboardShell>
    </StudentGuard>
  );
}

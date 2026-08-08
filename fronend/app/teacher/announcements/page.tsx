"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { TeacherGuard } from "@/components/teacher-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement, 
  fetchTeacherAnnouncements, 
  AnnouncementItem, 
  AnnouncementCategory, 
  AnnouncementPriority 
} from "@/lib/services/announcements";
import { 
  Megaphone, 
  Plus, 
  Pencil, 
  Trash2, 
  Pin, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  X, 
  Loader2, 
  Sparkles,
  Layers,
  Send,
  Eye,
  Radio,
  FileText,
  GraduationCap
} from "lucide-react";

const TARGET_OPTIONS = [
  { label: "📢 All Classes (Broadcast)", value: "All Classes", grade: "All Classes" },
  { label: "Grade 6 Science (All)", value: "Grade 6", grade: "Grade 6" },
  { label: "Grade 7 Science (All)", value: "Grade 7", grade: "Grade 7" },
  { label: "Grade 8 Science (All)", value: "Grade 8", grade: "Grade 8" },
  { label: "Grade 9 Science (All)", value: "Grade 9", grade: "Grade 9" },
  { label: "Grade 10 Science (Theory)", value: "Grade 10 Theory", grade: "Grade 10" },
  { label: "Grade 10 Science (Revision)", value: "Grade 10 Revision", grade: "Grade 10" },
  { label: "Grade 11 Science (Theory)", value: "Grade 11 Theory", grade: "Grade 11" },
  { label: "Grade 11 Science (Paper Class)", value: "Grade 11 Paper", grade: "Grade 11" },
];

const CATEGORIES: { label: string; value: AnnouncementCategory; icon: any }[] = [
  { label: "General Notice", value: "General", icon: Megaphone },
  { label: "Exam Notice", value: "Exam Notice", icon: GraduationCap },
  { label: "Class Schedule", value: "Class Schedule", icon: Calendar },
  { label: "Assignment / Tute", value: "Assignment", icon: FileText },
  { label: "Zoom Update", value: "Zoom Update", icon: Radio },
  { label: "Urgent Alert", value: "Urgent", icon: AlertTriangle },
];

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetClass, setTargetClass] = useState("All Classes");
  const [targetGrade, setTargetGrade] = useState("All Classes");
  const [category, setCategory] = useState<AnnouncementCategory>("General");
  const [priority, setPriority] = useState<AnnouncementPriority>("Normal");
  const [pinned, setPinned] = useState(false);

  // Dynamic class options fetched from Firestore
  const [classOptions, setClassOptions] = useState<{ label: string; value: string; grade: string }[]>(TARGET_OPTIONS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Load announcements and active classes
  const loadData = async () => {
    setLoading(true);
    try {
      const [annList, classesSnap] = await Promise.all([
        fetchTeacherAnnouncements(),
        getDocs(collection(db, "classes")).catch(() => null),
      ]);

      setAnnouncements(annList);

      if (classesSnap && !classesSnap.empty) {
        const dynamicList = [...TARGET_OPTIONS];
        classesSnap.docs.forEach((d) => {
          const c = d.data();
          const label = `${c.grade || ""} ${c.title || ""} (${c.type || "Theory"})`.trim();
          if (label && !dynamicList.some((opt) => opt.value === label)) {
            dynamicList.push({
              label: `🎯 ${label}`,
              value: label,
              grade: c.grade || "Grade 10",
            });
          }
        });
        setClassOptions(dynamicList);
      }
    } catch (err: any) {
      console.error("Error loading announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setMessage("");
    setTargetClass("All Classes");
    setTargetGrade("All Classes");
    setCategory("General");
    setPriority("Normal");
    setPinned(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AnnouncementItem) => {
    if (!item.id) return;
    setEditingId(item.id);
    setTitle(item.title);
    setMessage(item.message);
    setTargetClass(item.targetClass || "All Classes");
    setTargetGrade(item.targetGrade || "All Classes");
    setCategory(item.category || "General");
    setPriority(item.priority || "Normal");
    setPinned(item.pinned || false);
    setError(null);
    setIsModalOpen(true);
  };

  const handleTargetChange = (val: string) => {
    setTargetClass(val);
    const found = classOptions.find((opt) => opt.value === val);
    if (found) {
      setTargetGrade(found.grade);
    } else {
      setTargetGrade(val.includes("Grade") ? val.split(" ")[0] + " " + val.split(" ")[1] : "All Classes");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError("Please provide both an announcement title and message content.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      const authorName = currentUser?.displayName || "Kalhara Nakandala";
      const authorUid = currentUser?.uid || "teacher";

      if (editingId) {
        await updateAnnouncement(editingId, {
          title: title.trim(),
          message: message.trim(),
          targetClass,
          targetGrade,
          category,
          priority,
          pinned,
        });
      } else {
        await createAnnouncement({
          title: title.trim(),
          message: message.trim(),
          targetClass,
          targetGrade,
          category,
          priority,
          pinned,
          authorName,
          authorUid,
        });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      console.error("Error saving announcement:", err);
      setError(err?.message || "Failed to save announcement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this announcement? Students will no longer see this notice.")) {
      try {
        await deleteAnnouncement(id);
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      } catch (err: any) {
        alert("Failed to delete announcement: " + (err?.message || "Unknown error"));
      }
    }
  };

  const handleTogglePin = async (item: AnnouncementItem) => {
    if (!item.id) return;
    try {
      const newPinned = !item.pinned;
      await updateAnnouncement(item.id, { pinned: newPinned });
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, pinned: newPinned } : a))
      );
    } catch (err) {
      console.error("Error updating pin state:", err);
    }
  };

  // Filtered list
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.targetClass.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      selectedGradeFilter === "All" ||
      a.targetGrade === selectedGradeFilter ||
      a.targetClass.toLowerCase().includes(selectedGradeFilter.toLowerCase()) ||
      a.targetGrade === "All Classes";

    const matchesCategory =
      selectedCategoryFilter === "All" || a.category === selectedCategoryFilter;

    return matchesSearch && matchesGrade && matchesCategory;
  });

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
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800 border border-amber-200 shadow-sm">
          <Sparkles size={12} /> Important
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#002583]/70 border border-blue-100">
        Normal
      </span>
    );
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
        return <Badge tone="yellow">📢 General Notice</Badge>;
    }
  };

  return (
    <TeacherGuard>
      <DashboardShell role="teacher" active="Announcements">
        {/* ── TOP BANNER & ACTION BAR ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFB800] text-[#002583] shadow-md">
                <Megaphone size={22} className="stroke-[2.5]" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#002583]">
                  Class Announcements
                </h1>
                <p className="text-xs sm:text-sm font-medium text-ink/60">
                  Broadcast notices to specific classes, grades, or all students.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB800] to-[#f5a600] px-5 py-3 font-extrabold text-[#002583] shadow-button transition hover:-translate-y-0.5 hover:brightness-105 active:scale-95"
          >
            <Plus size={18} className="stroke-[2.5]" />
            New Announcement
          </button>
        </div>

        {/* ── QUICK METRICS STRIP ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur-md">
            <p className="text-xs font-bold text-ink/55 uppercase tracking-wider">Total Notices</p>
            <p className="mt-1 text-2xl font-black text-[#002583]">{announcements.length}</p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur-md">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pinned Notices</p>
            <p className="mt-1 text-2xl font-black text-amber-600">
              {announcements.filter((a) => a.pinned).length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur-md">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Urgent / High</p>
            <p className="mt-1 text-2xl font-black text-red-600">
              {announcements.filter((a) => a.priority === "Urgent" || a.priority === "Important").length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur-md">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Active Audience</p>
            <p className="mt-1 text-2xl font-black text-emerald-600">Grades 6–11</p>
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Search announcements by title, class, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none transition focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Grade Filter */}
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 text-xs font-bold text-ink outline-none focus:border-[#FFB800]"
            >
              <option value="All">All Target Grades</option>
              <option value="All Classes">All Classes Broadcast</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2 text-xs font-bold text-ink outline-none focus:border-[#FFB800]"
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Exam Notice">Exam Notice</option>
              <option value="Class Schedule">Class Schedule</option>
              <option value="Assignment">Assignment</option>
              <option value="Zoom Update">Zoom Update</option>
              <option value="Urgent">Urgent Alert</option>
            </select>
          </div>
        </div>

        {/* ── ANNOUNCEMENTS LIST ── */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 size={36} className="animate-spin text-[#002583]" />
              <p className="mt-3 text-sm font-bold text-ink/60">Loading class announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <EmptyState
              emoji="📢"
              title="No announcements found"
              description={
                searchQuery || selectedGradeFilter !== "All" || selectedCategoryFilter !== "All"
                  ? "No notices match your selected filters. Try changing your search keywords or filter criteria."
                  : "You haven't posted any class announcements yet. Click 'New Announcement' to broadcast an update to your students."
              }
              actionLabel="+ Post First Announcement"
              onAction={openCreateModal}
            />
          ) : (
            filteredAnnouncements.map((item) => (
              <Card
                key={item.id}
                className={`relative overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-5 sm:p-6 shadow-card backdrop-blur-md transition-all duration-200 hover:shadow-lg ${
                  item.pinned ? "border-l-4 border-l-[#FFB800]" : "border-l-4 border-l-[#002583]"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left Badges & Title */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Target Class Badge */}
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#002583]/10 px-3 py-1 text-xs font-black text-[#002583]">
                        <Users size={13} /> {item.targetClass}
                      </span>

                      {/* Category Badge */}
                      {getCategoryBadge(item.category)}

                      {/* Priority Badge */}
                      {getPriorityBadge(item.priority)}

                      {/* Pinned Badge */}
                      {item.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-800 border border-amber-300">
                          <Pin size={12} className="fill-amber-600 text-amber-600" /> Pinned to Top
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                      {item.title}
                    </h2>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      onClick={() => handleTogglePin(item)}
                      title={item.pinned ? "Unpin notice" : "Pin notice to top"}
                      className={`p-2 rounded-xl border transition ${
                        item.pinned
                          ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-zinc-200 bg-white/70 text-zinc-500 hover:bg-zinc-100"
                      }`}
                    >
                      <Pin size={16} className={item.pinned ? "fill-amber-600 text-amber-600" : ""} />
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit notice"
                      className="p-2 rounded-xl border border-zinc-200 bg-white/70 text-[#002583] hover:bg-blue-50 transition"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete notice"
                      className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Announcement Body */}
                <div className="mt-3.5 rounded-2xl bg-zinc-50/70 p-4 text-xs sm:text-sm leading-relaxed text-zinc-700 border border-zinc-100 whitespace-pre-line">
                  {item.message}
                </div>

                {/* Footer Meta info */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 text-[11px] font-bold text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    Target Grade: <strong className="text-zinc-600">{item.targetGrade}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    Teacher Broadcast: {item.authorName}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* ── CREATE / EDIT MODAL ── */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/90 bg-white p-6 sm:p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFB800]/20 text-[#002583]">
                  <Megaphone size={24} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#002583]">
                    {editingId ? "Edit Class Announcement" : "Create New Announcement"}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-ink/60">
                    Send targeted notifications to students in separate classes.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* 1. Target Class Selection */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink/75 mb-1.5">
                    Target Class / Audience <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => handleTargetChange(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-bold text-ink outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/40"
                  >
                    {classOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-ink/50">
                    Only students registered or enrolled in this class/grade will receive this notification on their dashboard.
                  </p>
                </div>

                {/* 2. Title */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink/75 mb-1.5">
                    Announcement Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Special Paper Class Discussion this Sunday at 8:30 AM"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-bold text-ink outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/40"
                  />
                </div>

                {/* 3. Category & Priority Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-ink/75 mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-bold text-ink outline-none focus:border-[#FFB800]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-ink/75 mb-1.5">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                      className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-bold text-ink outline-none focus:border-[#FFB800]"
                    >
                      <option value="Normal">Normal Notification</option>
                      <option value="Important">Important (Amber Highlight)</option>
                      <option value="Urgent">Urgent (Red Alert Banner)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Pinned Toggle */}
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-3.5">
                  <input
                    type="checkbox"
                    id="pinned-checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="h-4 w-4 rounded text-[#FFB800] focus:ring-[#FFB800]"
                  />
                  <label htmlFor="pinned-checkbox" className="text-xs font-extrabold text-zinc-700 cursor-pointer select-none">
                    Pin notice to the very top of Student Notification Feed
                  </label>
                </div>

                {/* 5. Message Content */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink/75 mb-1.5">
                    Message Body / Notice Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write detailed instructions, zoom guidelines, homework deadlines, or exam hall updates..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/40"
                  />
                </div>

                {/* 6. Live Student Preview */}
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-2">
                    <Eye size={13} /> Live Student Dashboard Preview:
                  </p>
                  <div className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-full bg-[#002583]/10 px-2.5 py-0.5 text-[11px] font-black text-[#002583]">
                        {targetClass}
                      </span>
                      {getCategoryBadge(category)}
                      {getPriorityBadge(priority)}
                    </div>
                    <h3 className="font-extrabold text-sm text-[#002583] mt-1">
                      {title || "Notice Title Here..."}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                      {message || "Notice message will appear here for students..."}
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-2xl border border-zinc-200 bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#002583] px-6 py-2.5 text-xs font-black text-white shadow-button transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Send size={15} /> {editingId ? "Update Notice" : "Broadcast Announcement"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardShell>
    </TeacherGuard>
  );
}

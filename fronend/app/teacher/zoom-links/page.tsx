"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  deleteDoc,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db, app } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { TeacherGuard } from "@/components/teacher-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  Video, 
  Loader2, 
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  Pencil,
  X,
  Play,
  CheckCircle2,
  Trash2,
  Users,
  Copy,
  Check,
  Wand2,
  Link as LinkIcon
} from "lucide-react";

export interface ClassItem {
  id: string;
  title: string;
  grade: string;
  type?: string;
  mode?: string;
}

export interface LiveClassItem {
  id: string;
  classId?: string;
  zoomMeetingId: string;
  meetingUUID?: string;
  joinUrl: string;
  startUrl?: string;
  passcode: string;
  topic: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  startTime: string;
  durationMinutes: number;
  description?: string;
  status: "scheduled" | "active" | "completed";
  attendanceProcessed?: boolean;
  createdAt?: any;
}

export default function ZoomLinksPage() {
  const [courses, setCourses] = useState<ClassItem[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LiveClassItem | null>(null);
  const [creationMode, setCreationMode] = useState<"manual" | "auto">("manual");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Fields
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [topic, setTopic] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [zoomMeetingId, setZoomMeetingId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("08:30");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState("");

  const functions = getFunctions(app);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Teacher Courses
      const coursesSnap = await getDocs(collection(db, "classes"));
      const courseItems = coursesSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ClassItem[];
      setCourses(courseItems);
      if (courseItems.length > 0 && !selectedCourseId) {
        setSelectedCourseId(courseItems[0].id);
      }

      // 2. Fetch Live Classes Meetings
      const liveSnap = await getDocs(collection(db, "liveClasses"));
      const liveItems = liveSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as LiveClassItem[];

      liveItems.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setLiveClasses(liveItems);
    } catch (err) {
      console.error("Error fetching Zoom meetings data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const today = new Date().toISOString().split("T")[0];
    setMeetingDate(today);
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setCreationMode("manual");
    setTopic("");
    setJoinUrl("");
    setZoomMeetingId("");
    setPasscode("");
    setError(null);
    const today = new Date().toISOString().split("T")[0];
    setMeetingDate(today);
    setMeetingTime("08:30");
    setDurationMinutes(60);
    setDescription("");
    if (courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: LiveClassItem) => {
    setEditingItem(item);
    setCreationMode("manual");
    setSelectedCourseId(item.courseId || (courses.length > 0 ? courses[0].id : ""));
    setTopic(item.topic || "");
    setJoinUrl(item.joinUrl || "");
    setZoomMeetingId(item.zoomMeetingId || "");
    setPasscode(item.passcode || "");
    setDescription(item.description || "");
    setDurationMinutes(item.durationMinutes || 60);
    setError(null);

    if (item.startTime) {
      try {
        const d = new Date(item.startTime);
        const dateStr = d.toISOString().split("T")[0];
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        setMeetingDate(dateStr);
        setMeetingTime(`${hours}:${mins}`);
      } catch (e) {
        setMeetingDate(new Date().toISOString().split("T")[0]);
        setMeetingTime("08:30");
      }
    }
    setIsModalOpen(true);
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      setError("Please select a course for this meeting.");
      return;
    }

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    if (!selectedCourse) return;

    setSubmitting(true);
    setError(null);

    try {
      // Build ISO Start Time string
      const startTimeIso = new Date(`${meetingDate}T${meetingTime}:00`).toISOString();

      if (creationMode === "auto" && !editingItem) {
        // Attempt automatic Zoom API creation via Cloud Function
        try {
          const createZoomFn = httpsCallable(functions, "createZoomMeeting");
          await createZoomFn({
            topic,
            courseId: selectedCourse.id,
            courseTitle: selectedCourse.title,
            grade: selectedCourse.grade,
            startTime: startTimeIso,
            durationMinutes: Number(durationMinutes),
            description,
          });
          setIsModalOpen(false);
          await fetchData();
          return;
        } catch (apiErr: any) {
          console.warn("Zoom API auto-creation failed, falling back to manual add prompt:", apiErr);
          setError(
            `Zoom API Error: ${apiErr.message || "Failed to call Zoom API"}. Switching to Manual Link entry. Please paste your Zoom URL below.`
          );
          setCreationMode("manual");
          setSubmitting(false);
          return;
        }
      }

      // Manual Creation or Editing existing item directly in Firestore
      if (!joinUrl.trim()) {
        setError("Please enter a valid Zoom Join Link.");
        setSubmitting(false);
        return;
      }

      // Extract Meeting ID from URL if empty
      let extractedId = zoomMeetingId.trim();
      if (!extractedId && joinUrl) {
        const match = joinUrl.match(/\/j\/(\d+)/);
        if (match) {
          extractedId = match[1];
        }
      }

      const meetingData = {
        classId: selectedCourse.id,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        grade: selectedCourse.grade,
        topic: topic.trim(),
        joinUrl: joinUrl.trim(),
        startUrl: joinUrl.trim(),
        zoomMeetingId: extractedId || "Manual-" + Date.now(),
        meetingUUID: extractedId || "UUID-" + Date.now(),
        passcode: passcode.trim(),
        startTime: startTimeIso,
        durationMinutes: Number(durationMinutes),
        description: description.trim(),
        status: editingItem ? editingItem.status : "scheduled",
        attendanceProcessed: editingItem ? (editingItem.attendanceProcessed ?? false) : false,
        updatedAt: new Date().toISOString(),
      };

      if (editingItem) {
        await updateDoc(doc(db, "liveClasses", editingItem.id), meetingData);
      } else {
        await addDoc(collection(db, "liveClasses"), {
          ...meetingData,
          createdAt: new Date().toISOString(),
        });
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error("Error saving Zoom meeting:", err);
      setError(err.message || "Failed to save Zoom meeting.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (item: LiveClassItem) => {
    if (!confirm(`Are you sure you want to delete the meeting "${item.topic}"?`)) return;

    try {
      // Try Cloud Function delete if API meeting
      if (item.zoomMeetingId && !item.zoomMeetingId.startsWith("Manual-")) {
        try {
          const deleteZoomFn = httpsCallable(functions, "deleteZoomMeeting");
          await deleteZoomFn({
            classId: item.id,
            zoomMeetingId: item.zoomMeetingId,
          });
        } catch (cfErr) {
          console.warn("Cloud function delete warning (proceeding with Firestore delete):", cfErr);
        }
      }
      // Delete document directly from Firestore
      await deleteDoc(doc(db, "liveClasses", item.id));
      fetchData();
    } catch (err) {
      console.error("Error deleting meeting:", err);
      alert("Failed to delete meeting.");
    }
  };

  const handleProcessAttendance = async (item: LiveClassItem) => {
    try {
      const processAttFn = httpsCallable(functions, "processAttendance");
      await processAttFn({ classId: item.id });
      alert("Attendance processed successfully!");
      fetchData();
    } catch (err: any) {
      console.error("Error processing attendance:", err);
      alert(err.message || "Failed to process attendance.");
    }
  };

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <TeacherGuard>
      <DashboardShell role="teacher" active="Zoom Links">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
              Teacher Portal
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Zoom Meetings & Live Classes</h1>
            <p className="mt-2 text-ink/55">
              Schedule live classes and manage Zoom links manually or automatically for enrolled students.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="gradient-button px-6 py-3 text-xs shadow-md shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} /> Add / Schedule Zoom Link
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading Zoom meetings...</p>
          </div>
        ) : liveClasses.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              emoji="📹"
              title="No Zoom Meetings Created"
              description="Add your Zoom meeting link manually or create a meeting for an upcoming theory or paper class."
              actionLabel="Add Zoom Link"
              actionOnClick={openCreateModal}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveClasses.map((item) => {
              const startDate = new Date(item.startTime);
              const formattedDate = startDate.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const formattedTime = startDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const isCompleted = item.status === "completed";

              return (
                <Card key={item.id} className="flex flex-col justify-between p-6 bg-white/90">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge tone="purple">{item.grade}</Badge>
                      <div className="flex items-center gap-1.5">
                        <Badge tone={isCompleted ? "green" : "lavender"}>
                          {isCompleted ? "Completed" : "Scheduled"}
                        </Badge>
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg p-1 text-ink/40 hover:bg-lavender-100 hover:text-lavender-700 transition"
                          title="Edit Meeting Link"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-ink leading-snug">{item.topic}</h3>
                    <p className="mt-1 text-xs font-bold text-lavender-700">{item.courseTitle}</p>

                    <div className="mt-4 space-y-2 text-xs font-bold text-ink/70">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-lavender-600 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-lavender-600 shrink-0" />
                        <span>{formattedTime} ({item.durationMinutes} mins)</span>
                      </div>
                      {item.passcode && (
                        <div className="flex items-center gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-amber-900">
                          <span>🔑 Passcode: <span className="font-mono text-sm">{item.passcode}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 pt-4 border-t border-ink/5">
                    {/* Host Start / Join Button */}
                    <a
                      href={item.startUrl || item.joinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-lavender-600 px-4 py-2.5 text-xs font-black text-white hover:bg-lavender-700 transition shadow-sm"
                    >
                      <Play size={14} /> Start / Join Meeting
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(item.id, item.joinUrl)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lavender-100 px-3 py-2 text-xs font-bold text-lavender-700 hover:bg-lavender-200 transition"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={13} /> Copied Link
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Copy Student Link
                          </>
                        )}
                      </button>

                      {isCompleted ? (
                        <button
                          onClick={() => handleProcessAttendance(item)}
                          className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                          title="Process Attendance"
                        >
                          <Users size={15} />
                        </button>
                      ) : null}

                      <button
                        onClick={() => handleDeleteMeeting(item)}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                        title="Delete Meeting"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* CREATE / EDIT MEETING MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <p className="text-xs font-extrabold uppercase text-lavender-600">
                    {editingItem ? "Update Zoom Link" : "Zoom Class Scheduling"}
                  </p>
                  <h3 className="mt-0.5 text-xl font-black text-ink">
                    {editingItem ? "Edit Zoom Meeting" : "Add Zoom Meeting"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-2xl bg-ink/5 text-ink/60 hover:bg-ink/10 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {!editingItem && (
                <div className="mt-4 flex rounded-2xl bg-lavender-50 p-1.5 border border-lavender-200">
                  <button
                    type="button"
                    onClick={() => { setCreationMode("manual"); setError(null); }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition cursor-pointer ${
                      creationMode === "manual"
                        ? "bg-white text-lavender-700 shadow-sm"
                        : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    <LinkIcon size={14} /> Manually Enter Zoom Link
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCreationMode("auto"); setError(null); }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition cursor-pointer ${
                      creationMode === "auto"
                        ? "bg-white text-lavender-700 shadow-sm"
                        : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    <Wand2 size={14} /> Auto API Creation
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs font-bold text-amber-900 border border-amber-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSaveMeeting} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Target Course *
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="pastel-input mt-1.5 w-full font-bold"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.grade}] {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Meeting Topic / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 05 - Electricity Theory Live Session"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="pastel-input mt-1.5 w-full"
                  />
                </div>

                {creationMode === "manual" && (
                  <>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                        Zoom Join URL / Meeting Link *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://us02web.zoom.us/j/123456789..."
                        value={joinUrl}
                        onChange={(e) => setJoinUrl(e.target.value)}
                        className="pastel-input mt-1.5 w-full font-mono text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                          Meeting Passcode (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 123456"
                          value={passcode}
                          onChange={(e) => setPasscode(e.target.value)}
                          className="pastel-input mt-1.5 w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                          Meeting ID (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 987 654 3210"
                          value={zoomMeetingId}
                          onChange={(e) => setZoomMeetingId(e.target.value)}
                          className="pastel-input mt-1.5 w-full"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="pastel-input mt-1.5 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="pastel-input mt-1.5 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Duration (Minutes) *
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="pastel-input mt-1.5 w-full font-bold"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes (1 Hour)</option>
                    <option value={90}>90 Minutes (1.5 Hours)</option>
                    <option value={120}>120 Minutes (2 Hours)</option>
                    <option value={180}>180 Minutes (3 Hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description or instructions for students..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="pastel-input mt-1.5 w-full resize-none"
                  />
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-ink/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-2xl border border-ink/10 px-5 py-2.5 text-xs font-bold text-ink/70 hover:bg-ink/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="gradient-button px-6 py-2.5 text-xs shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving Meeting...
                      </>
                    ) : (
                      <>{editingItem ? "Update Zoom Link" : "Save Zoom Link"}</>
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


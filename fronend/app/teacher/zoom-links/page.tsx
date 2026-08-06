"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  deleteDoc,
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
  X,
  Play,
  CheckCircle2,
  Trash2,
  Users,
  Copy,
  Check
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
  classId: string;
  zoomMeetingId: string;
  meetingUUID: string;
  joinUrl: string;
  startUrl: string;
  passcode: string;
  topic: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  startTime: string;
  durationMinutes: number;
  description?: string;
  status: "scheduled" | "active" | "completed";
  attendanceProcessed: boolean;
  createdAt?: any;
}

export default function ZoomLinksPage() {
  const [courses, setCourses] = useState<ClassItem[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Meeting Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Fields
  const [topic, setTopic] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
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
    setTopic("");
    setError(null);
    const today = new Date().toISOString().split("T")[0];
    setMeetingDate(today);
    setMeetingTime("08:30");
    setDurationMinutes(60);
    setDescription("");
    setIsModalOpen(true);
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
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

      // Call Cloud Function to create Zoom Meeting via Server-to-Server OAuth
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
    } catch (err: any) {
      console.error("Error creating Zoom meeting:", err);
      setError(err.message || "Failed to create Zoom meeting via Zoom API.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (item: LiveClassItem) => {
    if (!confirm(`Are you sure you want to delete the meeting "${item.topic}"?`)) return;

    try {
      const deleteZoomFn = httpsCallable(functions, "deleteZoomMeeting");
      await deleteZoomFn({
        classId: item.id,
        zoomMeetingId: item.zoomMeetingId,
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting meeting:", err);
      // Fallback local Firestore delete if CF fails
      try {
        await deleteDoc(doc(db, "liveClasses", item.id));
        fetchData();
      } catch (inner) {
        console.error("Fallback delete error:", inner);
      }
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
              Automatically create Zoom meetings and manage live class schedules for students.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="gradient-button px-6 py-3 text-xs shadow-md shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} /> Create Zoom Meeting
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
              description="Create your first automated Zoom meeting for an upcoming theory or paper class."
              actionLabel="Create Zoom Meeting"
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
                      <Badge tone={isCompleted ? "green" : "lavender"}>
                        {isCompleted ? "Completed" : "Scheduled"}
                      </Badge>
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
                      <div className="flex items-center gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-amber-900">
                        <span>🔑 Passcode: <span className="font-mono text-sm">{item.passcode}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 pt-4 border-t border-ink/5">
                    {/* Host Start Button */}
                    <a
                      href={item.startUrl || item.joinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-lavender-600 px-4 py-2.5 text-xs font-black text-white hover:bg-lavender-700 transition shadow-sm"
                    >
                      <Play size={14} /> Start Meeting as Host
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(item.id, item.joinUrl)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lavender-100 px-3 py-2 text-xs font-bold text-lavender-700 hover:bg-lavender-200 transition"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check size={13} /> Copied Student Link
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
                          title="Process / Recalculate Attendance"
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

        {/* CREATE MEETING MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <p className="text-xs font-extrabold uppercase text-lavender-600">Zoom API Integration</p>
                  <h3 className="mt-0.5 text-xl font-black text-ink">Create Zoom Meeting</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-2xl bg-ink/5 text-ink/60 hover:bg-ink/10"
                >
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-700 border border-rose-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateMeeting} className="mt-6 space-y-4">
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
                    className="rounded-2xl border border-ink/10 px-5 py-2.5 text-xs font-bold text-ink/70 hover:bg-ink/5"
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
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating Zoom Meeting...
                      </>
                    ) : (
                      <>Create Meeting</>
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

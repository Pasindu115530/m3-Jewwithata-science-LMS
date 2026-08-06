"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { TeacherGuard } from "@/components/teacher-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  Video, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  X, 
  ExternalLink,
  Play
} from "lucide-react";

export interface ClassItem {
  id: string;
  title: string;
  grade: string;
  type: string;
}

export interface RecordingItem {
  id: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  title: string;
  description?: string;
  videoUrl: string;
  passcode?: string;
  date: string;
  uploadedAt: string;
}

export default function TeacherRecordingsPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassItem | null>(null);
  
  // Recordings state
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [fetchingRecordings, setFetchingRecordings] = useState(false);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState<RecordingItem | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [passcode, setPasscode] = useState("");
  const [date, setDate] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all teacher courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "classes"));
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ClassItem[];
      setClasses(items);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recordings for selected course
  const fetchRecordingsForCourse = async (courseId: string) => {
    setFetchingRecordings(true);
    try {
      const snapshot = await getDocs(collection(db, "recordings"));
      const items = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as RecordingItem)
        .filter((r) => r.courseId === courseId);
      
      items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      setRecordings(items);
    } catch (err) {
      console.error("Error fetching recordings:", err);
    } finally {
      setFetchingRecordings(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchRecordingsForCourse(selectedCourse.id);
    }
  }, [selectedCourse]);

  const openCreateModal = () => {
    setEditingRecording(null);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setPasscode("");
    setDate(new Date().toISOString().split("T")[0]);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rec: RecordingItem) => {
    setEditingRecording(rec);
    setTitle(rec.title);
    setDescription(rec.description || "");
    setVideoUrl(rec.videoUrl);
    setPasscode(rec.passcode || "");
    setDate(rec.date || new Date().toISOString().split("T")[0]);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSaveRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!videoUrl) {
      setError("Please provide a video recording URL (Google Drive, Vimeo, YouTube, Zoom link).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (editingRecording) {
        // Update
        const recRef = doc(db, "recordings", editingRecording.id);
        await updateDoc(recRef, {
          title,
          description,
          videoUrl,
          passcode,
          date,
        });
      } else {
        // Create new
        await addDoc(collection(db, "recordings"), {
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title,
          grade: selectedCourse.grade,
          title,
          description,
          videoUrl,
          passcode,
          date,
          uploadedAt: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
      fetchRecordingsForCourse(selectedCourse.id);
    } catch (err: any) {
      console.error("Save recording error:", err);
      setError(err.message || "Failed to save recording.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecording = async (recId: string) => {
    if (!confirm("Are you sure you want to delete this recording?")) return;
    try {
      await deleteDoc(doc(db, "recordings", recId));
      if (selectedCourse) fetchRecordingsForCourse(selectedCourse.id);
    } catch (err) {
      console.error("Delete recording error:", err);
    }
  };

  return (
    <TeacherGuard>
      <DashboardShell role="teacher" active="Recordings">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Teacher Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Class Recordings Management</h1>
          <p className="mt-2 text-ink/55">
            Add and manage video recording links for past live sessions and theory lessons.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading courses...</p>
          </div>
        ) : !selectedCourse ? (
          /* STEP 1: SELECT COURSE */
          <div className="mt-8">
            <h2 className="text-xl font-black text-ink">Select a Course to Manage Recordings</h2>
            <p className="mt-1 text-xs text-ink/60">Click on any course card to open its video recording vault.</p>

            {classes.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  emoji="🎥"
                  title="No Courses Found"
                  description="You haven't created any courses yet. Please create a course first."
                  actionLabel="Go to Today's Classes"
                  actionHref="/teacher/classes"
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((c) => (
                  <Card
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    className="flex flex-col justify-between p-6 transition hover:border-lavender-400 hover:shadow-md cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge tone="purple">{c.grade}</Badge>
                        <Badge tone="lavender">{c.type}</Badge>
                      </div>
                      <h3 className="mt-4 text-xl font-black text-ink group-hover:text-lavender-700 transition">
                        {c.title}
                      </h3>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-ink/5 text-xs font-bold text-lavender-600">
                      <span>Manage Video Recordings</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* STEP 2: COURSE RECORDINGS MANAGEMENT */
          <div className="mt-8">
            {/* Header & Back Action */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white/80 p-6 border border-white shadow-soft">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lavender-100 text-lavender-700 hover:bg-lavender-200 transition font-black text-sm"
                >
                  ←
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="purple">{selectedCourse.grade}</Badge>
                    <span className="text-xs font-bold text-ink/40">• Class Recordings</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-ink">{selectedCourse.title}</h2>
                </div>
              </div>

              <button
                onClick={openCreateModal}
                className="gradient-button px-5 py-3 text-xs shadow-md shrink-0 cursor-pointer"
              >
                <Plus size={16} /> Add Video Recording
              </button>
            </div>

            {/* Recordings List */}
            <div className="mt-8">
              {fetchingRecordings ? (
                <div className="flex flex-col items-center justify-center p-12 text-ink/50">
                  <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
                  <p className="mt-3 text-sm font-bold">Fetching course recordings...</p>
                </div>
              ) : recordings.length === 0 ? (
                <EmptyState
                  emoji="🎥"
                  title="No Recordings Uploaded Yet"
                  description={`Add video recording links and playback passcodes for ${selectedCourse.title}.`}
                  actionLabel="Add First Recording"
                  actionOnClick={openCreateModal}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recordings.map((rec) => (
                    <Card key={rec.id} className="flex flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center justify-between">
                          <Badge tone="pink" className="flex items-center gap-1">
                            <Play size={11} /> Video Recording
                          </Badge>
                          <span className="text-[11px] font-bold text-ink/40">{rec.date}</span>
                        </div>

                        <h3 className="mt-4 text-lg font-black text-ink leading-snug">{rec.title}</h3>
                        {rec.description && (
                          <p className="mt-2 text-xs text-ink/65 line-clamp-2">{rec.description}</p>
                        )}
                        
                        {rec.passcode && (
                          <div className="mt-3 inline-block rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 border border-amber-200">
                            🔑 Passcode: <span className="font-mono">{rec.passcode}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex items-center gap-2 pt-4 border-t border-ink/5">
                        <a
                          href={rec.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lavender-100 px-3 py-2 text-xs font-black text-lavender-700 hover:bg-lavender-200 transition"
                        >
                          Watch Video <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => openEditModal(rec)}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                          title="Edit Recording"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecording(rec.id)}
                          className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                          title="Delete Recording"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CREATE / EDIT RECORDING MODAL */}
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <Badge tone="purple">{selectedCourse.grade}</Badge>
                  <h3 className="mt-1 text-xl font-black text-ink">
                    {editingRecording ? "Edit Recording" : "Add Video Recording"}
                  </h3>
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

              <form onSubmit={handleSaveRecording} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Recording Topic / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lesson 05 - Motion & Velocity Recording"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pastel-input mt-1.5 w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Video URL (Zoom Cloud, YouTube, Vimeo, Drive) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="pastel-input mt-1.5 w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                      Passcode (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Science2026"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="pastel-input mt-1.5 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                      Class Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pastel-input mt-1.5 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief summary of key topics covered..."
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
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>{editingRecording ? "Update Recording" : "Add Recording"}</>
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

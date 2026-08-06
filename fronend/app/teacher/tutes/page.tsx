"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { TeacherGuard } from "@/components/teacher-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  ChevronRight, 
  X, 
  ExternalLink,
  FileCheck,
  ArrowLeft,
  Search,
  FileText
} from "lucide-react";

export interface ClassItem {
  id: string;
  title: string;
  grade: string;
  type: string;
}

export interface TuteItem {
  id: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
}

export default function TeacherTutesPage() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassItem | null>(null);
  
  // Tutes state
  const [tutes, setTutes] = useState<TuteItem[]>([]);
  const [fetchingTutes, setFetchingTutes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTute, setEditingTute] = useState<TuteItem | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  // Fetch tutes for selected course
  const fetchTutesForCourse = async (courseId: string) => {
    setFetchingTutes(true);
    try {
      const snapshot = await getDocs(collection(db, "tutes"));
      const items = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as TuteItem)
        .filter((t) => t.courseId === courseId);
      
      items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      setTutes(items);
    } catch (err) {
      console.error("Error fetching tutes:", err);
    } finally {
      setFetchingTutes(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchTutesForCourse(selectedCourse.id);
    }
  }, [selectedCourse]);

  const openCreateModal = () => {
    setEditingTute(null);
    setTitle("");
    setDescription("");
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const openEditModal = (tute: TuteItem) => {
    setEditingTute(tute);
    setTitle(tute.title);
    setDescription(tute.description || "");
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleSaveTute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    if (!editingTute && !file) {
      setError("Please select a tute file (PDF, DOCX, etc.) to upload.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let downloadUrl = editingTute?.fileUrl || "";
      let fileName = editingTute?.fileName || "";
      let fileExtension = editingTute?.fileType || "PDF";

      // Upload file if new file selected
      if (file) {
        fileName = file.name;
        fileExtension = file.name.split(".").pop()?.toUpperCase() || "FILE";
        const storagePath = `tutes/${selectedCourse.id}/${Date.now()}_${file.name}`;
        
        try {
          const storageRef = ref(storage, storagePath);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
              },
              (err) => reject(err),
              async () => {
                downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              }
            );
          });
        } catch (storageErr) {
          console.warn("Storage fallback for tute:", storageErr);
          downloadUrl = URL.createObjectURL(file);
        }
      }

      if (editingTute) {
        // Update
        const tuteRef = doc(db, "tutes", editingTute.id);
        await updateDoc(tuteRef, {
          title,
          description,
          fileUrl: downloadUrl,
          fileName,
          fileType: fileExtension,
        });
      } else {
        // Create new
        await addDoc(collection(db, "tutes"), {
          courseId: selectedCourse.id,
          courseTitle: selectedCourse.title,
          grade: selectedCourse.grade,
          title,
          description,
          fileUrl: downloadUrl,
          fileName,
          fileType: fileExtension,
          uploadedAt: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
      fetchTutesForCourse(selectedCourse.id);
    } catch (err: any) {
      console.error("Save tute error:", err);
      setError(err.message || "Failed to save tute.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTute = async (tuteId: string) => {
    if (!confirm("Are you sure you want to delete this tute document?")) return;
    try {
      await deleteDoc(doc(db, "tutes", tuteId));
      if (selectedCourse) fetchTutesForCourse(selectedCourse.id);
    } catch (err) {
      console.error("Delete tute error:", err);
    }
  };

  const filteredTutes = tutes.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TeacherGuard>
      <DashboardShell role="teacher" active="Tutes">
        {!selectedCourse ? (
          /* ================= PAGE 1: COURSE SELECTION GRID ================= */
          <div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
                Teacher Portal
              </p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">Course Tutes Management</h1>
              <p className="mt-2 text-ink/55">
                Select a course below to view uploaded tutes and add new study materials.
              </p>
            </div>

            {loading ? (
              <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
                <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
                <p className="mt-3 text-sm font-bold">Loading courses...</p>
              </div>
            ) : classes.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  emoji="📚"
                  title="No Courses Found"
                  description="You haven't created any courses yet. Create a course first."
                  actionLabel="Go to Today's Classes"
                  actionHref="/teacher/classes"
                />
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((c) => (
                  <Card
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    className="flex flex-col justify-between p-6 transition hover:border-lavender-400 hover:shadow-lg cursor-pointer group bg-white/90"
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
                      <span>Open Tutes Page</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ================= PAGE 2: COURSE DEDICATED TUTES TABLE PAGE ================= */
          <div>
            {/* Top Navigation & Header */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-ink/70 shadow-sm border border-white hover:bg-lavender-50 hover:text-lavender-700 transition"
              >
                <ArrowLeft size={16} /> Back to Courses
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl bg-white/90 p-6 border border-white shadow-soft">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="purple">{selectedCourse.grade}</Badge>
                  <Badge tone="lavender">{selectedCourse.type}</Badge>
                </div>
                <h1 className="mt-2 text-2xl font-black text-ink md:text-3xl">{selectedCourse.title} - Tutes</h1>
                <p className="mt-1 text-xs text-ink/55">
                  Manage uploaded tutes, lesson documents, and study materials for this course.
                </p>
              </div>

              <button
                onClick={openCreateModal}
                className="gradient-button px-6 py-3 text-xs shadow-md shrink-0 cursor-pointer flex items-center gap-2"
              >
                <Plus size={16} /> Add Tute
              </button>
            </div>

            {/* Search & Actions Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search tutes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pastel-input pl-10 w-full text-xs"
                />
              </div>
              <span className="text-xs font-bold text-ink/50">
                Showing {filteredTutes.length} {filteredTutes.length === 1 ? "tute" : "tutes"}
              </span>
            </div>

            {/* Tutes Table View */}
            <div className="mt-6 overflow-hidden rounded-3xl bg-white/90 border border-white shadow-soft">
              {fetchingTutes ? (
                <div className="flex flex-col items-center justify-center p-12 text-ink/50">
                  <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
                  <p className="mt-3 text-sm font-bold">Loading uploaded tutes...</p>
                </div>
              ) : filteredTutes.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    emoji="📄"
                    title="No Tutes Uploaded Yet"
                    description={`No tutes found for ${selectedCourse.title}. Click "Add Tute" to upload your first document.`}
                    actionLabel="Add Tute Now"
                    actionOnClick={openCreateModal}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-ink/5 bg-lavender-50/50 text-ink/60 uppercase font-black tracking-wider text-[11px]">
                      <tr>
                        <th className="px-6 py-4">Tute Topic / Title</th>
                        <th className="px-6 py-4">File Name</th>
                        <th className="px-6 py-4">Format</th>
                        <th className="px-6 py-4">Uploaded Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 font-bold text-ink">
                      {filteredTutes.map((tute) => (
                        <tr key={tute.id} className="hover:bg-lavender-50/30 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lavender-100 text-lavender-700">
                                <FileText size={18} />
                              </div>
                              <div>
                                <p className="font-black text-sm text-ink">{tute.title}</p>
                                {tute.description && (
                                  <p className="text-[11px] text-ink/50 line-clamp-1 mt-0.5">{tute.description}</p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-lavender-50 px-3 py-1.5 text-lavender-700 border border-lavender-100">
                              <FileCheck size={13} /> {tute.fileName}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <Badge tone="lavender">{tute.fileType || "PDF"}</Badge>
                          </td>

                          <td className="px-6 py-4 text-ink/60">
                            {new Date(tute.uploadedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={tute.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl bg-lavender-100 px-3 py-1.5 text-xs font-black text-lavender-700 hover:bg-lavender-200 transition"
                              >
                                View <ExternalLink size={12} />
                              </a>
                              <button
                                onClick={() => openEditModal(tute)}
                                className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                                title="Edit Tute"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteTute(tute.id)}
                                className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                                title="Delete Tute"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CREATE / EDIT TUTE MODAL */}
        {isModalOpen && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <Badge tone="purple">{selectedCourse.grade}</Badge>
                  <h3 className="mt-1 text-xl font-black text-ink">
                    {editingTute ? "Edit Tute Topic" : "Add New Tute"}
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

              <form onSubmit={handleSaveTute} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Tute Topic / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 04 - Chemical Reactions Tute"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pastel-input mt-1.5 w-full"
                  />
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

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-ink/60">
                    Tute File (PDF, DOCX, PPT) {editingTute ? "(Optional to replace)" : "*"}
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.ppt,.pptx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="pastel-input mt-1.5 w-full file:mr-4 file:rounded-xl file:border-0 file:bg-lavender-100 file:px-4 file:py-2 file:text-xs file:font-black file:text-lavender-700 hover:file:bg-lavender-200"
                  />
                </div>

                {submitting && uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs font-bold text-ink/70">
                      <span>Uploading Tute File...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-lavender-100">
                      <div
                        className="h-full bg-lavender-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

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
                      <>{editingTute ? "Update Tute" : "Upload Tute"}</>
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

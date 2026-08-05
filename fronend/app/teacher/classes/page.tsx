"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { 
  Plus, 
  Pencil,
  Trash2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Loader2, 
  Calendar,
  X 
} from "lucide-react";

export interface ClassItem {
  id?: string;
  title: string;
  grade: string;
  type: "Theory" | "Paper" | "Revision";
  mode: "Online (Zoom)" | "Physical";
  location?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  fee: number;
  createdAt?: any;
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("Grade 10");
  const [type, setType] = useState<"Theory" | "Paper" | "Revision">("Theory");
  const [mode, setMode] = useState<"Online (Zoom)" | "Physical">("Online (Zoom)");
  const [location, setLocation] = useState("Nugegoda");
  const [dayOfWeek, setDayOfWeek] = useState("Saturday");
  const [startTime, setStartTime] = useState("08:30");
  const [endTime, setEndTime] = useState("10:30");
  const [fee, setFee] = useState<number>(3000);

  // Fetch classes from Firestore
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: ClassItem[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ClassItem[];
      setClasses(items);
    } catch (err: any) {
      console.error("Error fetching classes:", err);
      try {
        const snapshot = await getDocs(collection(db, "classes"));
        const items: ClassItem[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ClassItem[];
        setClasses(items);
      } catch (innerErr) {
        console.error("Fallback error fetching classes:", innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openCreateModal = () => {
    setEditingClassId(null);
    setTitle("");
    setGrade("Grade 10");
    setType("Theory");
    setMode("Online (Zoom)");
    setLocation("Nugegoda");
    setDayOfWeek("Saturday");
    setStartTime("08:30");
    setEndTime("10:30");
    setFee(3000);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: ClassItem) => {
    if (!c.id) return;
    setEditingClassId(c.id);
    setTitle(c.title);
    setGrade(c.grade);
    setType(c.type);
    setMode(c.mode);
    setLocation(c.location || "Nugegoda");
    setDayOfWeek(c.dayOfWeek);
    setStartTime(c.startTime);
    setEndTime(c.endTime);
    setFee(c.fee);
    setError(null);
    setIsModalOpen(true);
  };

  // Add or Update class
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const classData = {
        title,
        grade,
        type,
        mode,
        location: mode === "Physical" ? location : "Online",
        dayOfWeek,
        startTime,
        endTime,
        fee: Number(fee),
      };

      if (editingClassId) {
        await updateDoc(doc(db, "classes", editingClassId), classData);
      } else {
        await addDoc(collection(db, "classes"), {
          ...classData,
          createdAt: serverTimestamp(),
        });
      }

      setIsModalOpen(false);
      await fetchClasses();
    } catch (err: any) {
      console.error("Error saving class:", err);
      setError("Failed to save class. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete class
  const handleDeleteClass = async (classId: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await deleteDoc(doc(db, "classes", classId));
      setClasses((prev) => prev.filter((c) => c.id !== classId));
    } catch (err) {
      console.error("Error deleting class:", err);
      alert("Failed to delete class.");
    }
  };

  return (
    <DashboardShell role="teacher" active="Today’s Classes">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Teacher Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Classes & Timetable</h1>
          <p className="mt-2 text-ink/55">
            Manage your class schedules, modes, times, and monthly fees.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="gradient-button flex items-center gap-2"
        >
          <Plus size={18} /> Add New Class
        </button>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="mt-10 flex flex-col items-center justify-center p-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
          <p className="mt-3 text-sm font-bold">Loading classes from Firebase...</p>
        </div>
      ) : classes.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lavender-100 text-3xl">
            📚
          </div>
          <h3 className="mt-4 text-xl font-black">No classes found</h3>
          <p className="mt-2 text-sm text-ink/55">
            Click "Add New Class" above to create your first class.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card key={c.id} className="relative flex flex-col justify-between p-6">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="pink">{c.grade}</Badge>
                    <Badge tone={c.type === "Theory" ? "purple" : c.type === "Paper" ? "yellow" : "green"}>
                      {c.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="rounded-lg p-1.5 text-ink/35 transition hover:bg-lavender-100 hover:text-lavender-700"
                      title="Edit Class"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => c.id && handleDeleteClass(c.id)}
                      className="rounded-lg p-1.5 text-ink/35 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete Class"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-black">{c.title}</h2>

                <div className="mt-4 space-y-2.5 text-sm font-medium text-ink/75">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="text-lavender-600" size={17} />
                    <span>{c.dayOfWeek}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="text-lavender-600" size={17} />
                    <span>
                      {c.startTime} - {c.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="text-amber-600" size={17} />
                    <span>
                      {c.mode} {c.location && c.mode === "Physical" ? `• ${c.location}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="text-emerald-600" size={17} />
                    <span className="font-bold text-ink">LKR {c.fee?.toLocaleString() ?? 0} / month</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-black">
                {editingClassId ? "Edit Class" : "Create New Class"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-ink/40 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">Class Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 10 Science Theory"
                  className="pastel-input mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="pastel-input mt-1.5"
                  >
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="A/L Science">A/L Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Class Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="pastel-input mt-1.5"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Paper">Paper Class</option>
                    <option value="Revision">Revision</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="pastel-input mt-1.5"
                  >
                    <option value="Online (Zoom)">Online (Zoom)</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">
                    Monthly Fee (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="pastel-input mt-1.5"
                    placeholder="3000"
                  />
                </div>
              </div>

              {mode === "Physical" && (
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Location / Hall</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Nugegoda Science Hall"
                    className="pastel-input mt-1.5"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Day</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="pastel-input mt-1.5"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pastel-input mt-1.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pastel-input mt-1.5"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="pill flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gradient-button flex-1 justify-center"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : editingClassId ? (
                    "Update Class"
                  ) : (
                    "Save Class"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc,
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { 
  Video, 
  Loader2, 
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  X,
  Play,
  CheckCircle2
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
  zoomUrl?: string;
  zoomPasscode?: string;
  zoomUrlExpiry?: string; // ISO date string when link expires
  createdAt?: any;
}

const DAY_ORDER: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function ZoomLinksPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state for adding/updating Zoom link to a specific class
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zoom form states
  const [zoomUrl, setZoomUrl] = useState("");
  const [zoomPasscode, setZoomPasscode] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ClassItem[];
      
      // Filter for online classes or show all online capable
      items = items.filter((c) => c.mode === "Online (Zoom)");
      setClasses(items);
    } catch (err) {
      console.error("Error fetching classes:", err);
      try {
        const snapshot = await getDocs(collection(db, "classes"));
        let items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ClassItem[];
        items = items.filter((c) => c.mode === "Online (Zoom)");
        setClasses(items);
      } catch (innerErr) {
        console.error("Fallback error:", innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Helper: check if a zoom link is expired (expired if past expiry timestamp)
  const isZoomLinkActive = (item: ClassItem) => {
    if (!item.zoomUrl) return false;
    if (!item.zoomUrlExpiry) return true; // default active if no expiry set
    return new Date().getTime() < new Date(item.zoomUrlExpiry).getTime();
  };

  // Open modal to add or edit Zoom link
  const openZoomModal = (c: ClassItem) => {
    setSelectedClass(c);
    setZoomUrl(c.zoomUrl && isZoomLinkActive(c) ? c.zoomUrl : "");
    setZoomPasscode(c.zoomPasscode || "");
    setError(null);
    setIsModalOpen(true);
  };

  // Save Zoom Link for a class (set expiry to 24 hours / 1 day after end of class)
  const handleSaveZoomLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedClass.id) return;

    setSubmitting(true);
    setError(null);

    try {
      // Calculate 24 hour expiry from current time
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);

      await updateDoc(doc(db, "classes", selectedClass.id), {
        zoomUrl,
        zoomPasscode,
        zoomUrlExpiry: expiryDate.toISOString(),
      });

      setIsModalOpen(false);
      await fetchClasses();
    } catch (err: any) {
      console.error("Error updating Zoom link:", err);
      setError("Failed to update Zoom link.");
    } finally {
      setSubmitting(false);
    }
  };

  // Find next upcoming online class
  const getNextClass = (): ClassItem | null => {
    if (classes.length === 0) return null;

    const now = new Date();
    const currentDayIdx = now.getDay();
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    // Sort classes by day of week starting from current day
    const sorted = [...classes].sort((a, b) => {
      let dayDiffA = (DAY_ORDER[a.dayOfWeek] - currentDayIdx + 7) % 7;
      let dayDiffB = (DAY_ORDER[b.dayOfWeek] - currentDayIdx + 7) % 7;

      if (dayDiffA === 0 && a.startTime < currentTimeStr) dayDiffA = 7;
      if (dayDiffB === 0 && b.startTime < currentTimeStr) dayDiffB = 7;

      if (dayDiffA !== dayDiffB) return dayDiffA - dayDiffB;
      return a.startTime.localeCompare(b.startTime);
    });

    return sorted[0] || null;
  };

  const nextClass = getNextClass();

  return (
    <DashboardShell role="teacher" active="Zoom Links">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Teacher Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Online Zoom Classes</h1>
          <p className="mt-2 text-ink/55">
            Manage live Zoom links for online classes. Links automatically reset after class duration ends.
          </p>
        </div>
      </div>

      {/* Featured Next Class Card */}
      {nextClass && (
        <div className="mt-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                  🔥 Next Upcoming Class
                </span>
                <span className="text-xs font-bold text-white/80">{nextClass.grade}</span>
              </div>
              <h2 className="mt-3 text-2xl font-black md:text-3xl">{nextClass.title}</h2>
              <p className="mt-1 flex items-center gap-3 text-sm font-semibold text-white/90">
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> {nextClass.dayOfWeek}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {nextClass.startTime} - {nextClass.endTime}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {nextClass.zoomUrl && isZoomLinkActive(nextClass) ? (
                <a
                  href={nextClass.zoomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="gradient-button flex items-center gap-2 bg-white text-blue-900 shadow-lg hover:bg-slate-100"
                >
                  <Play size={18} className="fill-current" /> Start Zoom Class Now
                </a>
              ) : (
                <button
                  onClick={() => openZoomModal(nextClass)}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-900 shadow-lg hover:bg-slate-100"
                >
                  + Add Zoom Link & Start
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Classes Grid */}
      {loading ? (
        <div className="mt-10 flex flex-col items-center justify-center p-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
          <p className="mt-3 text-sm font-bold">Loading online classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-3xl">
            💻
          </div>
          <h3 className="mt-4 text-xl font-black">No Online Zoom Classes Found</h3>
          <p className="mt-2 text-sm text-ink/55">
            Create an online class in "Today's Classes" first to manage its Zoom link here.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => {
            const hasActiveLink = isZoomLinkActive(c);
            return (
              <Card key={c.id} className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge tone="pink">{c.grade}</Badge>
                      <Badge tone="purple">{c.type}</Badge>
                    </div>
                    {hasActiveLink ? (
                      <Badge tone="green">Link Active</Badge>
                    ) : (
                      <Badge tone="yellow">No Active Link</Badge>
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-black">{c.title}</h2>

                  <div className="mt-3 space-y-2 text-sm font-medium text-ink/75">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-lavender-600" size={16} />
                      <span>Every {c.dayOfWeek}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-lavender-600" size={16} />
                      <span>
                        {c.startTime} - {c.endTime}
                      </span>
                    </div>
                  </div>

                  {hasActiveLink ? (
                    <div className="mt-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/40">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                        <span>ZOOM MEETING LINK</span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Ready
                        </span>
                      </div>
                      {c.zoomPasscode && (
                        <p className="mt-1 text-xs text-ink/70">
                          Passcode: <code className="font-bold">{c.zoomPasscode}</code>
                        </p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <a
                          href={c.zoomUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="gradient-button flex flex-1 items-center justify-center gap-1.5 py-2 text-xs"
                        >
                          <Play size={14} /> Start / Join Class
                        </a>
                        <button
                          onClick={() => openZoomModal(c)}
                          className="pill text-xs"
                        >
                          Edit Link
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-800/40">
                      <p className="text-xs font-bold text-ink/50">
                        Link formatted / ended after previous class.
                      </p>
                      <button
                        onClick={() => openZoomModal(c)}
                        className="gradient-button mt-3 w-full justify-center text-xs"
                      >
                        <Plus size={15} /> Add Zoom Link
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Zoom Modal */}
      {isModalOpen && selectedClass && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-lg p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black">Add / Edit Zoom Link</h2>
                <p className="text-xs font-bold text-lavender-600">{selectedClass.title} ({selectedClass.grade})</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-ink/40 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveZoomLink} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">
                  Zoom Meeting URL
                </label>
                <input
                  type="url"
                  required
                  value={zoomUrl}
                  onChange={(e) => setZoomUrl(e.target.value)}
                  placeholder="https://us02web.zoom.us/j/..."
                  className="pastel-input mt-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">
                  Meeting Passcode (Optional)
                </label>
                <input
                  type="text"
                  value={zoomPasscode}
                  onChange={(e) => setZoomPasscode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="pastel-input mt-1.5"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                ℹ️ This Zoom link will remain active for 24 hours and then automatically expire after the class is completed.
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
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save & Start Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { 
  Plus, 
  Trash2, 
  Video, 
  Loader2, 
  Calendar,
  Clock,
  ExternalLink,
  X 
} from "lucide-react";

export interface ZoomLinkItem {
  id?: string;
  title: string;
  grade: string;
  zoomUrl: string;
  passcode?: string;
  date: string;
  time: string;
  notes?: string;
  createdAt?: any;
}

export default function ZoomLinksPage() {
  const [zoomLinks, setZoomLinks] = useState<ZoomLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("Grade 10");
  const [zoomUrl, setZoomUrl] = useState("");
  const [passcode, setPasscode] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [notes, setNotes] = useState("");

  const fetchZoomLinks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "zoom_links"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ZoomLinkItem[];
      setZoomLinks(items);
    } catch (err) {
      console.error("Error fetching zoom links:", err);
      try {
        const snapshot = await getDocs(collection(db, "zoom_links"));
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ZoomLinkItem[];
        setZoomLinks(items);
      } catch (innerErr) {
        console.error("Fallback error fetching zoom links:", innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZoomLinks();
  }, []);

  const handleCreateZoomLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newZoomLink: Omit<ZoomLinkItem, "id"> = {
        title,
        grade,
        zoomUrl,
        passcode,
        date,
        time,
        notes,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "zoom_links"), newZoomLink);

      setTitle("");
      setZoomUrl("");
      setPasscode("");
      setNotes("");
      setIsModalOpen(false);
      await fetchZoomLinks();
    } catch (err: any) {
      console.error("Error saving Zoom link:", err);
      setError("Failed to save Zoom link.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteZoomLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this Zoom link?")) return;
    try {
      await deleteDoc(doc(db, "zoom_links", linkId));
      setZoomLinks((prev) => prev.filter((item) => item.id !== linkId));
    } catch (err) {
      console.error("Error deleting Zoom link:", err);
      alert("Failed to delete Zoom link.");
    }
  };

  return (
    <DashboardShell role="teacher" active="Zoom Links">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Teacher Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Zoom Online Classes</h1>
          <p className="mt-2 text-ink/55">
            Create, manage and publish live Zoom meeting links for your students.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="gradient-button flex items-center gap-2"
        >
          <Plus size={18} /> Add New Zoom Link
        </button>
      </div>

      {/* Zoom Links Grid */}
      {loading ? (
        <div className="mt-10 flex flex-col items-center justify-center p-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
          <p className="mt-3 text-sm font-bold">Loading Zoom links from Firebase...</p>
        </div>
      ) : zoomLinks.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-3xl">
            💻
          </div>
          <h3 className="mt-4 text-xl font-black">No Zoom links posted yet</h3>
          <p className="mt-2 text-sm text-ink/55">
            Click "Add New Zoom Link" above to publish your first online class link.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {zoomLinks.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="pink">{item.grade}</Badge>
                  <button
                    onClick={() => item.id && handleDeleteZoomLink(item.id)}
                    className="rounded-lg p-1.5 text-ink/35 transition hover:bg-red-50 hover:text-red-600"
                    title="Delete Link"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <h2 className="mt-3 text-xl font-black">{item.title}</h2>

                <div className="mt-3 space-y-2 text-sm font-medium text-ink/75">
                  {item.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="text-lavender-600" size={16} />
                      <span>{item.date}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="text-lavender-600" size={16} />
                    <span>Time: {item.time}</span>
                  </div>
                  {item.passcode && (
                    <div className="text-xs font-bold text-ink/60">
                      Passcode: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">{item.passcode}</code>
                    </div>
                  )}
                  {item.notes && <p className="text-xs text-ink/55">{item.notes}</p>}
                </div>

                <div className="mt-5 rounded-2xl bg-blue-50/80 p-3.5 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                  <span className="block font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
                    Zoom Meeting Link:
                  </span>
                  <a
                    href={item.zoomUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-1.5 truncate font-bold text-blue-700 underline dark:text-blue-300"
                  >
                    <Video size={15} /> Join Class <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-black">Add Zoom Class Link</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-ink/40 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateZoomLink} className="mt-6 space-y-4">
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
                  placeholder="e.g. Grade 10 Optics Live Seminar"
                  className="pastel-input mt-1.5"
                />
              </div>

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
                <label className="block text-xs font-extrabold uppercase text-ink/60">Zoom Meeting URL</label>
                <input
                  type="url"
                  required
                  value={zoomUrl}
                  onChange={(e) => setZoomUrl(e.target.value)}
                  placeholder="https://us02web.zoom.us/j/..."
                  className="pastel-input mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pastel-input mt-1.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pastel-input mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">Passcode (Optional)</label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. 123456"
                  className="pastel-input mt-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">Notes / Instructions (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please join 5 mins before start time with paper and pen."
                  className="pastel-input mt-1.5 h-20"
                />
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
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Zoom Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

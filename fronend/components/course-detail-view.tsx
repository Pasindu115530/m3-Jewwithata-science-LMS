"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import {
  FileText, PlayCircle, Video, Lock, Calendar, Clock, Download, ExternalLink,
  Loader2, AlertCircle, ArrowLeft, CheckCircle2, Play, ShieldCheck, X
} from "lucide-react";

interface CourseItem {
  id: string;
  title: string;
  grade: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  zoomUrl?: string;
  zoomPasscode?: string;
  zoomUrlExpiry?: string;
}

interface EnrollmentInfo {
  enrolledAt: string; // ISO string e.g. "2026-08-06T15:00:00.000Z"
  status?: string;
}

interface TuteItem {
  id: string;
  title: string;
  grade: string;
  fileUrl: string;
  description?: string;
  uploadedAt?: string; // ISO string or YYYY-MM-DD
}

interface RecordingItem {
  id: string;
  title: string;
  grade: string;
  url: string;
  description?: string;
  uploadedAt?: string; // ISO string or YYYY-MM-DD
}

interface CourseDetailViewProps {
  course: CourseItem;
  enrollmentInfo?: EnrollmentInfo;
  isPaid: boolean;
  studentGrade: string;
  onBack: () => void;
}

export function CourseDetailView({
  course,
  enrollmentInfo,
  isPaid,
  studentGrade,
  onBack,
}: CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"tutes" | "recordings">("tutes");
  const [loading, setLoading] = useState(true);
  const [tutes, setTutes] = useState<TuteItem[]>([]);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);

  useEffect(() => {
    async function loadCourseContent() {
      setLoading(true);
      try {
        const enrolledAtTime = enrollmentInfo?.enrolledAt
          ? new Date(enrollmentInfo.enrolledAt).getTime()
          : 0;

        // 1. Load Tutes matching student grade & course
        const tutesSnap = await getDocs(
          query(collection(db, "tutes"), where("grade", "==", studentGrade))
        );

        const allTutes = tutesSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as (TuteItem & { courseId?: string })[];

        // Filter: ONLY show Tutes uploaded on or after enrollment date AND matching this course
        const filteredTutes = allTutes.filter((t) => {
          if (t.courseId && t.courseId !== course.id) return false;
          if (!t.uploadedAt) return true;
          const uploadTime = new Date(t.uploadedAt).getTime();
          return uploadTime >= enrolledAtTime;
        });

        setTutes(filteredTutes);

        // 2. Load Recordings matching student grade & course
        const recSnap = await getDocs(
          query(collection(db, "recordings"), where("grade", "==", studentGrade))
        );

        const allRecs = recSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as (RecordingItem & { courseId?: string })[];

        // Filter: ONLY show Recordings uploaded on or after enrollment date AND matching this course
        const filteredRecs = allRecs.filter((r) => {
          if (r.courseId && r.courseId !== course.id) return false;
          if (!r.uploadedAt) return true;
          const uploadTime = new Date(r.uploadedAt).getTime();
          return uploadTime >= enrolledAtTime;
        });

        setRecordings(filteredRecs);
      } catch (err) {
        console.error("Error loading course content:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourseContent();
  }, [course, enrollmentInfo, studentGrade]);

  const [studentFormattedName, setStudentFormattedName] = useState<string>("");
  const [activeZoomModal, setActiveZoomModal] = useState<boolean>(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      getDoc(doc(db, "users", user.uid)).then((studentDoc) => {
        if (studentDoc.exists()) {
          const data = studentDoc.data();
          const customId = data.studentId || "";
          const name = data.fullName || user.displayName || "Student";
          setStudentFormattedName(customId ? `${customId} - ${name}` : name);
        } else {
          setStudentFormattedName(user.displayName || user.email?.split("@")[0] || "Student");
        }
      }).catch((err) => {
        console.error("Error fetching student profile for Zoom name:", err);
      });
    }
  }, []);

  const isLiveActive = course.zoomUrl && (
    !course.zoomUrlExpiry || new Date().getTime() < new Date(course.zoomUrlExpiry).getTime()
  );

  const getEmbedZoomUrl = () => {
    if (!course.zoomUrl) return "";
    let meetingId = "";
    let passcode = course.zoomPasscode || "";

    const match = course.zoomUrl.match(/\/(?:j|wc\/join)\/(\d{9,13})/i);
    if (match) meetingId = match[1];

    if (!passcode) {
      try {
        const u = new URL(course.zoomUrl);
        passcode = u.searchParams.get("pwd") || "";
      } catch (e) {}
    }

    const name = encodeURIComponent(studentFormattedName || "Student");

    if (meetingId) {
      return `https://zoom.us/wc/join/${meetingId}?pwd=${encodeURIComponent(passcode)}&un=${name}&dn=${name}&uname=${name}&name=${name}&prefer=1`;
    }

    try {
      const u = new URL(course.zoomUrl);
      u.searchParams.set("un", studentFormattedName || "Student");
      u.searchParams.set("dn", studentFormattedName || "Student");
      u.searchParams.set("uname", studentFormattedName || "Student");
      u.searchParams.set("name", studentFormattedName || "Student");
      return u.toString();
    } catch (e) {
      return course.zoomUrl;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black uppercase text-lavender-700 hover:underline"
        >
          <ArrowLeft size={16} /> Back to My Courses
        </button>

        <div className="flex items-center gap-2">
          <Badge tone="purple">{course.grade}</Badge>
          {isPaid ? (
            <Badge tone="green" className="flex items-center gap-1">
              <CheckCircle2 size={13} /> Active Enrollment
            </Badge>
          ) : (
            <Badge tone="pink" className="flex items-center gap-1">
              <Lock size={13} /> Course Locked
            </Badge>
          )}
        </div>
      </div>

      {/* Course Title Banner */}
      <div className="rounded-[2rem] bg-gradient-to-r from-lavender-600 to-lavender-800 p-8 text-white shadow-soft">
        <h1 className="text-3xl font-black">{course.title}</h1>
        <p className="mt-2 text-sm text-white/80">
          Enrolled on: {enrollmentInfo?.enrolledAt ? new Date(enrollmentInfo.enrolledAt).toLocaleDateString("en-GB") : "Active"}
        </p>

        {/* Live Zoom Option if active */}
        {isLiveActive && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-emerald-500/20 px-5 py-3 backdrop-blur-md border border-emerald-400/40 select-none">
            <span className="flex items-center gap-2 text-xs font-black text-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-400" /> LIVE ZOOM CLASS IS READY
            </span>
            <button
              type="button"
              onClick={() => setActiveZoomModal(true)}
              onContextMenu={(e) => e.preventDefault()}
              className="rounded-xl bg-white px-4 py-2 text-xs font-black text-emerald-900 shadow hover:bg-emerald-50 cursor-pointer select-none"
            >
              Launch In-App Session
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen In-App Embedded Zoom Player Modal */}
      {activeZoomModal && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-white animate-in fade-in duration-200">
          {/* Player Bar Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-slate-900/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-lavender-600 text-white font-bold text-base shadow-md">
                📹
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-tight">{course.title}</h3>
                <p className="text-xs text-lavender-300 font-medium">
                  Live Class • <span className="text-emerald-400 font-semibold">{course.grade}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/50">
                <ShieldCheck size={14} className="text-emerald-400" /> Protected In-App Player
              </span>
              <button
                onClick={() => setActiveZoomModal(false)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 transition shadow-md cursor-pointer"
              >
                <X size={16} /> Exit Live Class
              </button>
            </div>
          </div>

          {/* Embedded Zoom Iframe Container */}
          <div className="flex-1 w-full bg-black relative overflow-hidden">
            <iframe
              src={getEmbedZoomUrl()}
              title={course.title}
              className="w-full h-full border-0"
              allow="camera *; microphone *; display-capture *; autoplay *; clipboard-write *; fullscreen *"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
            />
          </div>
        </div>
      )}

      {/* COURSE LOCKED BANNER (if monthly payment not completed) */}
      {!isPaid && (
        <Card className="border-rose-200 bg-rose-50/80 p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600 text-3xl">
            🔒
          </div>
          <h2 className="mt-4 text-xl font-black text-rose-900">Course Access Locked</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-rose-800/90 leading-relaxed">
            This course is locked because your monthly payment has not been completed. Please renew your payment to continue learning.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/student/payments"
              className="rounded-2xl bg-rose-600 px-6 py-3 text-xs font-black text-white shadow-md hover:bg-rose-700"
            >
              Pay Monthly Class Fee Now
            </a>
          </div>
        </Card>
      )}

      {/* TWO CONTENT CARDS ONLY (📚 Tutes & 🎥 Recordings) */}
      {isPaid && (
        <>
          {/* Navigation Tabs (Only 2 Tabs) */}
          <div className="flex gap-3 border-b border-lavender-200 pb-3">
            <button
              onClick={() => setActiveTab("tutes")}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition ${
                activeTab === "tutes"
                  ? "bg-lavender-600 text-white shadow-md"
                  : "bg-white text-ink/70 hover:bg-lavender-100"
              }`}
            >
              <FileText size={18} /> 📚 Study Tutes ({tutes.length})
            </button>

            <button
              onClick={() => setActiveTab("recordings")}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition ${
                activeTab === "recordings"
                  ? "bg-lavender-600 text-white shadow-md"
                  : "bg-white text-ink/70 hover:bg-lavender-100"
              }`}
            >
              <PlayCircle size={18} /> 🎥 Class Recordings ({recordings.length})
            </button>
          </div>

          {/* Content Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-ink/50">
              <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
              <p className="mt-3 text-sm font-bold">Filtering course materials from enrollment date...</p>
            </div>
          ) : (
            <div>
              {/* TAB 1: Tutes Card */}
              {activeTab === "tutes" && (
                <div>
                  {tutes.length === 0 ? (
                    <EmptyState
                      emoji="📄"
                      title="No Tutes Available"
                      description="No new study tutes have been uploaded since your enrollment date."
                    />
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {tutes.map((item) => (
                        <Card key={item.id} className="flex flex-col justify-between p-6">
                          <div>
                            <div className="flex items-center justify-between">
                              <Badge tone="purple">{item.grade}</Badge>
                              <span className="flex items-center gap-1 text-xs font-semibold text-ink/40">
                                <Calendar size={13} /> {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString("en-GB") : "Recent"}
                              </span>
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lavender-100 text-lavender-700">
                                <FileText size={20} />
                              </div>
                              <div>
                                <h3 className="text-base font-black text-ink">{item.title}</h3>
                                {item.description && (
                                  <p className="mt-1 text-xs text-ink/60">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gradient-button mt-6 w-full justify-center py-2.5 text-xs shadow-md"
                          >
                            <Download size={15} /> Download PDF Tute
                          </a>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Recordings Card */}
              {activeTab === "recordings" && (
                <div>
                  {recordings.length === 0 ? (
                    <EmptyState
                      emoji="🎬"
                      title="No Recordings Available"
                      description="No new class recordings have been uploaded since your enrollment date."
                    />
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recordings.map((item) => (
                        <Card key={item.id} className="flex flex-col justify-between p-6">
                          <div>
                            <div className="flex items-center justify-between">
                              <Badge tone="yellow">{item.grade}</Badge>
                              <span className="flex items-center gap-1 text-xs font-semibold text-ink/40">
                                <Calendar size={13} /> {item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString("en-GB") : "Recorded"}
                              </span>
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                                <PlayCircle size={20} />
                              </div>
                              <div>
                                <h3 className="text-base font-black text-ink">{item.title}</h3>
                                {item.description && (
                                  <p className="mt-1 text-xs text-ink/60">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gradient-button mt-6 w-full justify-center py-2.5 text-xs shadow-md"
                          >
                            <ExternalLink size={15} /> Watch Lesson Recording
                          </a>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

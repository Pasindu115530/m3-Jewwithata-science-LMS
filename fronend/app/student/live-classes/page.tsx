"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  Video, 
  Loader2, 
  Calendar, 
  Clock, 
  Play, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  X,
  User,
  CreditCard
} from "lucide-react";
import Link from "next/link";

interface ClassItem {
  id: string;
  title: string;
  grade: string;
  subject?: string;
  teacherName?: string;
  type?: string;
  mode?: string;
  dayOfWeek: string;
  startTime: string; // HH:MM (24h format e.g. "08:30" or "18:00")
  endTime: string;   // HH:MM
  zoomUrl?: string;
  zoomPasscode?: string;
  zoomUrlExpiry?: string;
  isPublished?: boolean;
}

interface StudentProfile {
  grade?: string;
  enrolledClasses?: string[];
}

declare global {
  interface Window {
    ZoomMtg: any;
  }
}

export default function StudentLiveClassesPage() {
  const [loading, setLoading] = useState(true);
  const [studentGrade, setStudentGrade] = useState<string>("");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [userDisplayName, setUserDisplayName] = useState<string>("");

  // Zoom Join Modal State
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [studentName, setStudentName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zoom embedded state
  const [inZoom, setInZoom] = useState(false);
  const [sdkPrepared, setSdkPrepared] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserDisplayName(user.displayName || user.email?.split("@")[0] || "Student");
        setStudentName(user.displayName || "");

        try {
          // 1. Fetch Student Profile
          const studentDoc = await getDoc(doc(db, "users", user.uid));
          let grade = "";
          let enrolled: string[] = [];

          if (studentDoc.exists()) {
            const data = studentDoc.data() as StudentProfile;
            grade = data.grade || "";
            enrolled = data.enrolledClasses || [];
          }

          setStudentGrade(grade);
          setEnrolledIds(enrolled);

          // 2. Check Monthly Payment Status
          const paymentsSnap = await getDocs(collection(db, "payments"));
          const approvedPayments = paymentsSnap.docs
            .map((d) => d.data())
            .filter((p) => p.studentUid === user.uid && p.status === "Approved");

          const paidStatus = approvedPayments.length > 0;
          setIsPaid(paidStatus);

          // If student is enrolled AND has approved payment, load today's live classes
          if (enrolled.length > 0 && paidStatus) {
            const snapshot = await getDocs(collection(db, "classes"));
            let items = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as ClassItem[];

            // Filter Rule 1: Student MUST be enrolled in this course
            items = items.filter((c) => enrolled.includes(c.id));

            // Filter Rule 2: Must be Online (Zoom) mode
            items = items.filter((c) => c.mode === "Online (Zoom)" || !c.mode);

            // Filter Rule 3: Must be published by teacher
            items = items.filter((c) => c.isPublished !== false);

            // Filter Rule 4: Must have a valid Zoom URL
            items = items.filter((c) => c.zoomUrl && c.zoomUrl.trim() !== "");

            // Filter Rule 5: Must be scheduled for TODAY
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const todayName = days[new Date().getDay()];

            items = items.filter((c) => c.dayOfWeek === todayName);

            setClasses(items);
          } else {
            setClasses([]);
          }
        } catch (err) {
          console.error("Error loading live classes:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Calculate Status: "Live Now", "Upcoming", "Ended"
  const getLiveStatus = (c: ClassItem) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTimeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const cleanTime = timeStr.trim().toLowerCase();
      // Handle HH:MM format
      const parts = cleanTime.split(":");
      if (parts.length === 2) {
        let hours = parseInt(parts[0], 10);
        let mins = parseInt(parts[1], 10);
        if (cleanTime.includes("pm") && hours < 12) hours += 12;
        if (cleanTime.includes("am") && hours === 12) hours = 0;
        return hours * 60 + mins;
      }
      return 0;
    };

    const startMinutes = parseTimeToMinutes(c.startTime);
    const endMinutes = parseTimeToMinutes(c.endTime) || startMinutes + 120; // Default 2 hours if omitted

    if (currentMinutes < startMinutes) {
      return { status: "Upcoming", label: `Starts at ${c.startTime}` };
    } else if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return { status: "Live Now", label: "LIVE NOW" };
    } else {
      return { status: "Ended", label: "Class Ended" };
    }
  };

  const prepareSdk = () => {
    if (sdkPrepared) return;
    if (!window.ZoomMtg) {
      throw new Error("Zoom Meeting SDK core failed to load. Please refresh.");
    }
    window.ZoomMtg.setZoomJSLib("https://source.zoom.us/6.2.0/lib", "/av");
    window.ZoomMtg.preLoadWasm();
    window.ZoomMtg.prepareWebSDK();
    setSdkPrepared(true);
  };

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedClass.zoomUrl) return;

    setJoining(true);
    setError(null);

    try {
      // Step 1: Fetch JWT signature from API route
      const res = await fetch("/api/zoom-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoomUrl: selectedClass.zoomUrl,
          role: 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate Zoom access token.");

      // Step 2: Prepare SDK
      prepareSdk();

      const zmmtgRoot = document.getElementById("zmmtg-root");
      if (zmmtgRoot) zmmtgRoot.style.display = "block";
      setInZoom(true);

      // Step 3: Initialize & Join
      window.ZoomMtg.init({
        leaveUrl: `${window.location.origin}/student/live-classes`,
        patchJsMedia: true,
        disableInvite: true,
        success: function () {
          window.ZoomMtg.join({
            sdkKey: data.sdkKey,
            signature: data.signature,
            meetingNumber: data.meetingNumber,
            passWord: selectedClass.zoomPasscode || "",
            userName: studentName || userDisplayName || "Student",
            success: function () {
              setJoining(false);
              setSelectedClass(null);
            },
            error: function (err: any) {
              console.error("Zoom join error:", err);
              restoreApp(err.reason || err.errorMessage || "Could not join Zoom meeting.");
            },
          });
        },
        error: function (err: any) {
          console.error("Zoom init error:", err);
          restoreApp(err.reason || err.errorMessage || "Zoom Web SDK initialization failed.");
        },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while connecting to Zoom.");
      setJoining(false);
    }
  };

  const restoreApp = (errorText: string) => {
    const zmmtgRoot = document.getElementById("zmmtg-root");
    if (zmmtgRoot) zmmtgRoot.style.display = "none";
    setInZoom(false);
    setJoining(false);
    setError(errorText);
  };

  return (
    <StudentGuard>
      {/* Zoom External CDN Libraries */}
      <Script src="https://source.zoom.us/6.2.0/lib/vendor/react.min.js" strategy="beforeInteractive" />
      <Script src="https://source.zoom.us/6.2.0/lib/vendor/react-dom.min.js" strategy="beforeInteractive" />
      <Script src="https://source.zoom.us/6.2.0/lib/vendor/redux.min.js" strategy="beforeInteractive" />
      <Script src="https://source.zoom.us/6.2.0/lib/vendor/redux-thunk.min.js" strategy="beforeInteractive" />
      <Script src="https://source.zoom.us/6.2.0/zoom-meeting-6.2.0.min.js" />

      <div style={{ display: inZoom ? "none" : "block" }}>
        <DashboardShell role="student" active="Live Classes">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
              Student Portal
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Live Zoom Classes</h1>
            <p className="mt-2 text-ink/55">
              Interactive live Zoom sessions for your enrolled courses ({studentGrade || "All Grades"}).
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
              <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
              <p className="mt-3 text-sm font-bold">Checking enrolled live classes...</p>
            </div>
          ) : !isPaid || enrolledIds.length === 0 ? (
            /* EMPTY STATE: Student NOT ENROLLED or UNPAID */
            <Card className="mt-8 p-8 text-center md:p-12 border-amber-200 bg-amber-50/40">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700 text-3xl shadow-sm">
                🔒
              </div>
              <h3 className="mt-4 text-xl font-black text-amber-900">Access Restricted</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-amber-800/80 leading-relaxed">
                You must be enrolled in a course with an active monthly payment to access live classes.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/student/courses"
                  className="gradient-button px-6 py-2.5 text-xs shadow-md"
                >
                  Go to My Courses
                </Link>
                <Link
                  href="/student/payments"
                  className="flex items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-amber-900 shadow-sm border border-amber-300"
                >
                  <CreditCard size={15} /> Make Payment
                </Link>
              </div>
            </Card>
          ) : classes.length === 0 ? (
            /* EMPTY STATE: No Live Classes Scheduled for Today */
            <div className="mt-8">
              <EmptyState
                emoji="💻"
                title="No Live Classes Today"
                description="No live classes scheduled for today."
                actionLabel="View My Courses"
                actionHref="/student/courses"
              />
            </div>
          ) : (
            /* CLASSES GRID FOR TODAY */
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => {
                const liveInfo = getLiveStatus(c);
                const isLiveNow = liveInfo.status === "Live Now";
                const isUpcoming = liveInfo.status === "Upcoming";
                const isEnded = liveInfo.status === "Ended";

                return (
                  <Card key={c.id} className="flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge tone="purple">{c.grade}</Badge>
                          <Badge tone="blue">{c.subject || "Science"}</Badge>
                        </div>

                        {isLiveNow && (
                          <Badge tone="green" className="flex items-center gap-1 animate-pulse">
                            <CheckCircle2 size={13} /> LIVE NOW
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge tone="yellow" className="flex items-center gap-1">
                            <Clock size={13} /> Upcoming
                          </Badge>
                        )}
                        {isEnded && (
                          <Badge tone="pink" className="flex items-center gap-1">
                            Class Ended
                          </Badge>
                        )}
                      </div>

                      <h2 className="mt-4 text-xl font-black text-ink">{c.title}</h2>

                      <div className="mt-3 space-y-2 text-xs font-semibold text-ink/70">
                        {c.teacherName && (
                          <div className="flex items-center gap-2">
                            <User className="text-lavender-600" size={14} />
                            <span>Teacher: {c.teacherName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="text-lavender-600" size={14} />
                          <span>Today ({c.dayOfWeek})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-lavender-600" size={14} />
                          <span>
                            {c.startTime} - {c.endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      {isLiveNow ? (
                        <button
                          onClick={() => {
                            setSelectedClass(c);
                            setError(null);
                          }}
                          className="gradient-button w-full justify-center py-2.5 text-xs shadow-md"
                        >
                          <Play size={15} className="fill-current" /> Join Now
                        </button>
                      ) : isUpcoming ? (
                        <div className="rounded-2xl bg-amber-50 p-3 text-center border border-amber-200">
                          <p className="text-xs font-black text-amber-900">
                            {liveInfo.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-amber-800/70">
                            Join button will unlock when class starts.
                          </p>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full justify-center rounded-2xl bg-slate-100 py-2.5 text-xs font-black text-slate-400 cursor-not-allowed border border-slate-200"
                        >
                          Class Ended
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Join Zoom Confirmation Modal */}
          {selectedClass && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
              <div className="soft-panel w-full max-w-md p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h2 className="text-xl font-black">Join Live Zoom Class</h2>
                    <p className="text-xs font-bold text-lavender-600">
                      {selectedClass.title} ({selectedClass.grade})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="rounded-full p-2 text-ink/40 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleJoinClass} className="mt-6 space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 flex items-center gap-2">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">
                      Your Name in Zoom
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter your name"
                      className="pastel-input mt-1.5"
                    />
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-xs font-medium text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                    💡 Zoom meeting will connect directly inside your browser.
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setSelectedClass(null)}
                      className="pill flex-1 justify-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={joining}
                      className="gradient-button flex-1 justify-center"
                    >
                      {joining ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
                        </span>
                      ) : (
                        "Connect Now"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </DashboardShell>
      </div>
    </StudentGuard>
  );
}

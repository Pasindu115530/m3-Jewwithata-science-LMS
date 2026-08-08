"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where
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
  CreditCard,
  ExternalLink,
  ShieldCheck,
  X
} from "lucide-react";
import Link from "next/link";

interface LiveClassItem {
  id: string;
  classId?: string;
  zoomMeetingId?: string;
  meetingUUID?: string;
  joinUrl: string;
  passcode?: string;
  topic: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  startTime: string; // ISO String
  durationMinutes: number;
  description?: string;
  status: "scheduled" | "active" | "completed";
}

interface StudentProfile {
  studentId?: string;
  fullName?: string;
  grade?: string;
  enrolledClasses?: string[];
}

export default function StudentLiveClassesPage() {
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [studentFormattedName, setStudentFormattedName] = useState<string>("");
  const [activeZoomModal, setActiveZoomModal] = useState<LiveClassItem | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Fetch Student Profile for auto-renaming (StudentID + Name)
          const studentDoc = await getDoc(doc(db, "users", user.uid));
          let enrolled: string[] = [];
          let formattedName = user.displayName || user.email?.split("@")[0] || "Student";

          if (studentDoc.exists()) {
            const data = studentDoc.data() as StudentProfile;
            enrolled = data.enrolledClasses || [];
            
            const customId = data.studentId || "";
            const name = data.fullName || user.displayName || "Student";
            formattedName = customId ? `${customId} - ${name}` : name;
          }

          setEnrolledIds(enrolled);
          setStudentFormattedName(formattedName);

          // 2. Check Monthly Payment Status & Free Card / Temp Access Grants
          let paidAccess = false;
          if (studentDoc.exists()) {
            const uData = studentDoc.data();
            if (
              uData.freeCardAssigned ||
              uData.freePhysicalCardAssigned ||
              uData.freeCard ||
              uData.isPhysicalStudent ||
              uData.physicalStudentId ||
              uData.studentType === "physical_online" ||
              uData.temporaryAccessGranted
            ) {
              paidAccess = true;
            }
          }

          if (!paidAccess) {
            const paymentsQuery = query(
              collection(db, "payments"),
              where("studentUid", "==", user.uid)
            );
            const paymentsSnap = await getDocs(paymentsQuery);
            const approvedPayments = paymentsSnap.docs
              .map((d) => d.data())
              .filter((p) => p.status === "Approved");

            paidAccess = approvedPayments.length > 0;
          }

          setIsPaid(paidAccess);

          // 3. Load Live Classes for enrolled courses or grade matching
          const snapshot = await getDocs(collection(db, "liveClasses"));
          let items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as LiveClassItem[];

          // Filter for student's enrolled classes (or student grade if enrolled array is empty)
          if (enrolled.length > 0) {
            items = items.filter((c) => enrolled.includes(c.courseId) || enrolled.includes(c.id));
          } else if (studentDoc.exists() && studentDoc.data()?.grade) {
            const studentGrade = String(studentDoc.data()?.grade).toLowerCase().replace(/grade\s*/g, "").trim();
            items = items.filter((c) => {
              if (!c.grade) return true;
              const classGrade = String(c.grade).toLowerCase().replace(/grade\s*/g, "").trim();
              return classGrade === studentGrade;
            });
          }

          items.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          setLiveClasses(items);

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

  // Construct embedded Zoom Web Client URL
  const getEmbedZoomUrl = (item: LiveClassItem) => {
    let meetingId = item.zoomMeetingId || "";
    let passcode = item.passcode || "";
    let rawUrl = item.joinUrl || "";

    if (!meetingId && rawUrl) {
      const match = rawUrl.match(/\/(?:j|wc\/join)\/(\d{9,13})/i);
      if (match) meetingId = match[1];
    }

    if (!passcode && rawUrl) {
      try {
        const u = new URL(rawUrl);
        passcode = u.searchParams.get("pwd") || "";
      } catch (e) {}
    }

    const name = encodeURIComponent(studentFormattedName || "Student");

    if (meetingId) {
      return `https://zoom.us/wc/join/${meetingId}?pwd=${encodeURIComponent(passcode)}&un=${name}&dn=${name}&uname=${name}&name=${name}&prefer=1`;
    }

    try {
      const u = new URL(rawUrl);
      u.searchParams.set("un", studentFormattedName || "Student");
      u.searchParams.set("dn", studentFormattedName || "Student");
      u.searchParams.set("uname", studentFormattedName || "Student");
      u.searchParams.set("name", studentFormattedName || "Student");
      return u.toString();
    } catch (e) {
      return rawUrl;
    }
  };

  return (
    <StudentGuard>
      <DashboardShell role="student" active="Live Classes">
        {/* Header */}
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Live Zoom Classes</h1>
          <p className="mt-2 text-ink/55">
            Join your scheduled live Zoom sessions securely. Credentials and attendance are processed automatically inside the LMS.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading scheduled live classes...</p>
          </div>
        ) : !isPaid || enrolledIds.length === 0 ? (
          /* Payment / Enrollment Guard State */
          <Card className="mt-8 p-8 text-center md:p-12 border-amber-200 bg-amber-50/40">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700 text-3xl shadow-sm">
              🔒
            </div>
            <h3 className="mt-4 text-xl font-black text-amber-900">Access Restricted</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-amber-800/80 leading-relaxed">
              You must be enrolled in a course with an approved payment to join live Zoom classes.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/student/courses" className="gradient-button px-6 py-2.5 text-xs shadow-md">
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
        ) : liveClasses.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              emoji="📹"
              title="No Upcoming Live Classes"
              description="Your teachers have not scheduled any upcoming live Zoom meetings for your enrolled courses."
              actionLabel="View My Courses"
              actionHref="/student/courses"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveClasses.map((c) => {
              const startDate = new Date(c.startTime);
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

              const isCompleted = c.status === "completed";

              return (
                <Card key={c.id} className="flex flex-col justify-between p-6 bg-white/90 select-none">
                  <div>
                    <div className="flex items-center justify-between">
                      <Badge tone="purple">{c.grade}</Badge>
                      <Badge tone={isCompleted ? "green" : "blue"}>
                        {isCompleted ? "Completed" : "Scheduled"}
                      </Badge>
                    </div>

                    <h3 className="mt-4 text-xl font-black text-ink leading-snug">{c.topic}</h3>
                    <p className="mt-1 text-xs font-bold text-lavender-700">{c.courseTitle}</p>

                    <div className="mt-4 space-y-2 text-xs font-bold text-ink/70">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-lavender-600 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-lavender-600 shrink-0" />
                        <span>{formattedTime} ({c.durationMinutes} mins)</span>
                      </div>

                      <div className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-emerald-900">
                        <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                        <span>🔒 Secured Access • In-App Player</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink/5" onContextMenu={(e) => e.preventDefault()}>
                    {isCompleted ? (
                      <div className="flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-50 p-3 text-xs font-black text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={16} /> Class Completed
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveZoomModal(c)}
                        onContextMenu={(e) => e.preventDefault()}
                        className="flex items-center justify-center gap-2 w-full rounded-2xl bg-lavender-600 px-4 py-3 text-xs font-black text-white hover:bg-lavender-700 transition shadow-md cursor-pointer select-none"
                      >
                        <Play size={15} /> Launch In-App Class Session <ShieldCheck size={14} />
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

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
                  <h3 className="text-sm font-black text-white leading-tight">{activeZoomModal.topic}</h3>
                  <p className="text-xs text-lavender-300 font-medium">
                    {activeZoomModal.courseTitle} • <span className="text-emerald-400 font-semibold">{activeZoomModal.grade}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-700/50">
                  <ShieldCheck size={14} className="text-emerald-400" /> Protected In-App Player
                </span>
                <button
                  onClick={() => setActiveZoomModal(null)}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 transition shadow-md cursor-pointer"
                >
                  <X size={16} /> Exit Live Class
                </button>
              </div>
            </div>

            {/* Embedded Zoom Iframe Container */}
            <div className="flex-1 w-full bg-black relative overflow-hidden">
              <iframe
                src={getEmbedZoomUrl(activeZoomModal)}
                title={activeZoomModal.topic}
                className="w-full h-full border-0"
                allow="camera *; microphone *; display-capture *; autoplay *; clipboard-write *; fullscreen *"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
              />
            </div>
          </div>
        )}
      </DashboardShell>
    </StudentGuard>
  );
}



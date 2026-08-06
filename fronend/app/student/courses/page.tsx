"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { Card, Badge } from "@/components/ui";
import { CourseDetailView } from "@/components/course-detail-view";
import { EmptyState } from "@/components/empty-state";
import { classes as mockClasses } from "@/lib/mock-data";
import { 
  BookOpen, 
  Loader2, 
  Calendar, 
  Clock, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface CourseItem {
  id: string;
  title: string;
  grade: string;
  type?: string;
  mode?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  fee?: string;
  zoomUrl?: string;
  zoomPasscode?: string;
  zoomUrlExpiry?: string;
}

interface EnrollmentData {
  enrolledAt: string;
  status?: string;
}

interface StudentProfile {
  grade?: string;
  enrolledClasses?: string[];
  enrollments?: Record<string, EnrollmentData>;
}

export default function StudentCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [studentGrade, setStudentGrade] = useState<string>("");
  const [userUid, setUserUid] = useState<string>("");
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [enrollmentsMap, setEnrollmentsMap] = useState<Record<string, EnrollmentData>>({});
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [checkingPayment, setCheckingPayment] = useState<boolean>(true);

  // Courses lists
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseItem[]>([]);

  // Selected Course for Detailed Content View (Tutes + Recordings)
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  // Enrolling state
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        try {
          // 1. Fetch Student Profile
          const studentDoc = await getDoc(doc(db, "users", user.uid));
          let grade = "Grade 10";
          let enrolled: string[] = [];
          let map: Record<string, EnrollmentData> = {};

          if (studentDoc.exists()) {
            const data = studentDoc.data() as StudentProfile;
            grade = data.grade || "Grade 10";
            enrolled = data.enrolledClasses || [];
            map = data.enrollments || {};
          }

          setStudentGrade(grade);
          setEnrolledIds(enrolled);
          setEnrollmentsMap(map);

          // 2. Check Monthly Payment Status from `payments` collection
          const now = new Date();
          const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

          const paymentsSnap = await getDocs(collection(db, "payments"));
          const studentPayments = paymentsSnap.docs
            .map((d) => d.data())
            .filter((p) => p.studentUid === user.uid && p.status === "Approved");

          // Valid if any approved payment exists for student
          const paidStatus = studentPayments.length > 0;
          setIsPaid(paidStatus);
          setCheckingPayment(false);

          // 3. Fetch All Classes from Firestore + Fallback from mock-data
          const classesSnap = await getDocs(collection(db, "classes"));
          const firestoreClasses = classesSnap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as CourseItem[];

          // Format mock classes to match CourseItem structure
          const formattedMockClasses: CourseItem[] = mockClasses.map((mc, idx) => ({
            id: `mock-class-${mc.grade.toLowerCase().replace(/\s+/g, "")}-${idx}`,
            title: mc.fullTitle || `${mc.grade} ${mc.title}`,
            grade: mc.grade,
            dayOfWeek: mc.day,
            startTime: mc.time?.split("–")[0]?.trim(),
            endTime: mc.time?.split("–")[1]?.trim(),
            fee: mc.fee,
            mode: mc.mode,
          }));

          // Merge Firestore classes with mock classes (avoiding duplicates)
          const allGradeClasses = [
            ...firestoreClasses,
            ...formattedMockClasses.filter(
              (mc) => !firestoreClasses.some((fc) => fc.grade === mc.grade && fc.title === mc.title)
            ),
          ];

          // Filter strictly by Grade
          const matchingGradeClasses = allGradeClasses.filter((c) => {
            if (!c.grade) return false;
            const cleanCGrade = c.grade.toLowerCase().replace(/grade\s*/g, "").trim();
            const cleanSGrade = grade.toLowerCase().replace(/grade\s*/g, "").trim();
            return cleanCGrade === cleanSGrade || c.grade === grade;
          });

          // Separate into Enrolled and Available
          const enrolledList = matchingGradeClasses.filter((c) => enrolled.includes(c.id));
          const availableList = matchingGradeClasses.filter((c) => !enrolled.includes(c.id));

          setEnrolledCourses(enrolledList);
          setAvailableCourses(availableList);
        } catch (err) {
          console.error("Error fetching student courses:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setCheckingPayment(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle 1-click Enrollment logic (Anyone can enroll!)
  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    setEnrollError(null);
    setEnrollSuccess(null);

    try {
      // Direct Firestore update for instant, guaranteed enrollment
      const userRef = doc(db, "users", userUid);
      const newEnrolled = [...enrolledIds, courseId];
      const nowIso = new Date().toISOString();
      const newEnrollments = {
        ...enrollmentsMap,
        [courseId]: {
          enrolledAt: nowIso,
          status: "active",
        },
      };

      await setDoc(
        userRef,
        {
          enrolledClasses: newEnrolled,
          enrollments: newEnrollments,
          updatedAt: nowIso,
        },
        { merge: true }
      );

      // Update local state
      const newEnrolledIds = [...enrolledIds, courseId];
      const newMap = {
        ...enrollmentsMap,
        [courseId]: { enrolledAt: nowIso, status: "active" },
      };

      setEnrolledIds(newEnrolledIds);
      setEnrollmentsMap(newMap);

      // Move course from available to enrolled
      const courseToMove = availableCourses.find((c) => c.id === courseId);
      if (courseToMove) {
        setAvailableCourses((prev) => prev.filter((c) => c.id !== courseId));
        setEnrolledCourses((prev) => [...prev, courseToMove]);
      }

      setEnrollSuccess("Successfully enrolled in course!");
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setEnrollError(err.message || "Failed to enroll in course.");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <StudentGuard>
      <DashboardShell role="student" active="My Courses">
        {selectedCourse ? (
          /* View Detailed Content inside an Enrolled Course (Tutes + Recordings + Zoom) */
          <CourseDetailView
            course={selectedCourse}
            enrollmentInfo={enrollmentsMap[selectedCourse.id]}
            isPaid={isPaid}
            studentGrade={studentGrade}
            onBack={() => setSelectedCourse(null)}
          />
        ) : (
          /* Main My Courses Portal */
          <div>
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
                  Student Portal
                </p>
                <h1 className="mt-2 text-3xl font-black md:text-4xl">My Courses</h1>
                <p className="mt-2 text-ink/55">
                  Assigned courses for <span className="font-extrabold text-lavender-700">{studentGrade || "your grade"}</span>.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge tone={studentGrade ? "purple" : "yellow"}>{studentGrade || "Grade 10"}</Badge>
                {isPaid ? (
                  <Badge tone="green" className="flex items-center gap-1">
                    <CheckCircle2 size={13} /> Monthly Fee Paid
                  </Badge>
                ) : (
                  <Badge tone="pink" className="flex items-center gap-1">
                    <Lock size={13} /> Payment Required
                  </Badge>
                )}
              </div>
            </div>

            {/* Error / Success Notifications */}
            {enrollError && (
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-700 border border-rose-200">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0 text-rose-600" />
                  <span>{enrollError}</span>
                </div>
                <Link
                  href="/student/payments"
                  className="shrink-0 rounded-xl bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
                >
                  Pay Now
                </Link>
              </div>
            )}

            {enrollSuccess && (
              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>{enrollSuccess}</span>
              </div>
            )}

            {/* Monthly Payment Notice if Unpaid */}
            {!loading && !isPaid && (
              <Card className="mt-6 border-amber-200 bg-amber-50/70 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-amber-900">Monthly Payment Required</h3>
                      <p className="mt-1 text-xs text-amber-800/80 leading-relaxed">
                        Monthly payment required before enrollment. Please complete your payment to access this course and unlock study materials.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/student/payments"
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-black text-white hover:bg-amber-700"
                  >
                    Go to Payments <ChevronRight size={14} />
                  </Link>
                </div>
              </Card>
            )}

            {loading ? (
              <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
                <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
                <p className="mt-3 text-sm font-bold">Loading your grade courses...</p>
              </div>
            ) : (
              <div className="mt-8 space-y-10">
                {/* SECTION 1: ENROLLED COURSES */}
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-lavender-600" size={20} />
                    <h2 className="text-xl font-black text-ink">Enrolled Courses ({enrolledCourses.length})</h2>
                  </div>

                  {enrolledCourses.length === 0 ? (
                    <Card className="mt-4 p-8 text-center">
                      <p className="text-sm font-bold text-ink/55">
                        You have not enrolled in any courses yet. Select an available course below to enroll.
                      </p>
                    </Card>
                  ) : (
                    <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {enrolledCourses.map((c) => (
                        <Card
                          key={c.id}
                          className="flex flex-col justify-between p-6 transition hover:shadow-md border-lavender-200"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <Badge tone="purple">{c.grade}</Badge>
                              {isPaid ? (
                                <Badge tone="green" className="flex items-center gap-1">
                                  <CheckCircle2 size={13} /> Enrolled
                                </Badge>
                              ) : (
                                <Badge tone="pink" className="flex items-center gap-1">
                                  <Lock size={13} /> Payment Required
                                </Badge>
                              )}
                            </div>

                            <h3 className="mt-4 text-xl font-black text-ink">{c.title}</h3>

                            <div className="mt-3 space-y-1.5 text-xs font-semibold text-ink/65">
                              {c.dayOfWeek && (
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-lavender-600" />
                                  <span>Every {c.dayOfWeek}</span>
                                </div>
                              )}
                              {c.startTime && (
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-lavender-600" />
                                  <span>{c.startTime} - {c.endTime}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedCourse(c)}
                            className="gradient-button mt-6 w-full justify-center py-2.5 text-xs shadow-md"
                          >
                            Open Course (Tutes & Recordings) <ChevronRight size={15} />
                          </button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION 2: AVAILABLE COURSES FOR STUDENT'S GRADE */}
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-lavender-600" size={20} />
                    <h2 className="text-xl font-black text-ink">Available Courses ({availableCourses.length})</h2>
                  </div>

                  {availableCourses.length === 0 ? (
                    <Card className="mt-4 p-8 text-center">
                      <p className="text-sm font-bold text-ink/55">
                        No additional available courses found for {studentGrade}.
                      </p>
                    </Card>
                  ) : (
                    <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {availableCourses.map((c) => (
                        <Card key={c.id} className="flex flex-col justify-between p-6">
                          <div>
                            <div className="flex items-center justify-between">
                              <Badge tone="purple">{c.grade}</Badge>
                              <Badge tone="yellow">Available</Badge>
                            </div>

                            <h3 className="mt-4 text-xl font-black text-ink">{c.title}</h3>

                            <div className="mt-3 space-y-1.5 text-xs font-semibold text-ink/65">
                              {c.dayOfWeek && (
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-lavender-600" />
                                  <span>Every {c.dayOfWeek}</span>
                                </div>
                              )}
                              {c.startTime && (
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-lavender-600" />
                                  <span>{c.startTime} - {c.endTime}</span>
                                </div>
                              )}
                            </div>

                            {!isPaid && (
                              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-medium text-amber-900 border border-amber-200">
                                💡 Enrollment is free. Complete monthly payment to unlock study materials inside.
                              </div>
                            )}
                          </div>

                          <div className="mt-6">
                            <button
                              onClick={() => handleEnroll(c.id)}
                              disabled={enrollingId === c.id}
                              className="gradient-button w-full justify-center py-3 text-xs shadow-md cursor-pointer flex items-center gap-2"
                            >
                              {enrollingId === c.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" /> Enrolling...
                                </>
                              ) : (
                                "Enroll Now"
                              )}
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DashboardShell>
    </StudentGuard>
  );
}

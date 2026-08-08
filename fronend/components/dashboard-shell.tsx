"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, BookOpen, CalendarDays, CheckSquare, ClipboardCheck, CreditCard, Download, FileText, LayoutDashboard,
  LogOut, Maximize, Megaphone, Menu, Minimize, PlayCircle, Search, Settings, UserRound, Users, Video, WalletCards, X
} from "lucide-react";
import { Brand } from "@/components/brand";
import { studentMenu, teacherMenu } from "@/lib/mock-data";
import ProfileDropdown from "@/components/ui/profile-dropdown";
import { StudentWebappPrompt } from "@/components/student-webapp-prompt";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const iconMap: Record<string, ReactNode> = {
  Dashboard: <LayoutDashboard size={19}/>, "My Courses": <BookOpen size={19}/>, Tutes: <FileText size={19}/>,
  Recordings: <PlayCircle size={19}/>, "Free Lessons": <BookOpen size={19}/>, "Weekly Timetable": <CalendarDays size={19}/>,
  "Live Classes": <Video size={19}/>, "Zoom Links": <Video size={19}/>, Assignments: <CheckSquare size={19}/>, Payments: <CreditCard size={19}/>,
  "Payment History": <WalletCards size={19}/>, Attendance: <ClipboardCheck size={19}/>, Notifications: <Bell size={19}/>,
  Profile: <UserRound size={19}/>, Settings: <Settings size={19}/>, "Today’s Classes": <CalendarDays size={19}/>,
  Students: <Users size={19}/>, "Physical Cards": <CreditCard size={19}/>, "Payment Approvals": <WalletCards size={19}/>, Announcements: <Megaphone size={19}/>
};

export function DashboardShell({ role, active, children }: { role: "student" | "teacher"; active: string; children: ReactNode }) {
  const router = useRouter();
  const menu = role === "student" ? studentMenu : teacherMenu;
  const [userName, setUserName] = useState<string>(role === "student" ? "Student" : "Kalhara Nakandala");
  const [userGrade, setUserGrade] = useState<string>(role === "student" ? "Grade 10 Student" : "Science Teacher");
  const subtitle = userGrade;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close mobile drawer when active route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [active]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.studentName) setUserName(data.studentName);
            if (data.grade) setUserGrade(`${data.grade} Student`);
          } else if (user.displayName) {
            setUserName(user.displayName);
          }
        } catch (err) {
          console.error("Error loading header user profile:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [role]);

  const person = userName;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const elem = document.documentElement as HTMLElement & {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => console.error("Error enabling fullscreen:", err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch((err) => console.error("Error enabling fullscreen:", err));
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen().catch((err) => console.error("Error enabling fullscreen:", err));
      }
    } else {
      const doc = document as Document & {
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
      };
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch((err) => console.error("Error exiting fullscreen:", err));
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen().catch((err) => console.error("Error exiting fullscreen:", err));
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen().catch((err) => console.error("Error exiting fullscreen:", err));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push(role === "student" ? "/student-login" : "/teacher-login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const profileData = {
    name: person,
    email: "",
    role: role,
    grade: userGrade,
    status: role === "student" ? "Active Student" : "Verified Teacher",
  };

  return (
    <div className="min-h-screen p-3 md:p-5">
      {/* Mobile Navigation Drawer / Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Portal Navigation">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-[#001035]/65 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-gradient-to-b from-[#002583] via-[#001d68] to-[#001548] p-5 text-white shadow-2xl transition-transform animate-in slide-in-from-left duration-300 z-50 overflow-y-auto">
            {/* Top Brand & Close Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 rounded-2xl bg-white/95 p-2.5 shadow-sm" onClick={() => setMobileSidebarOpen(false)}>
                <Brand />
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Badge */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 text-2xl shadow-card">
                {role === "student" ? "👩‍🎓" : "👨‍🏫"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-white truncate text-sm">{person}</p>
                <p className="text-xs font-semibold text-[#FFB800] truncate">{subtitle}</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="mt-5 flex flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
              {menu.map(([label, href]) => {
                const selected = active === label;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all duration-200 ${
                      selected
                        ? "bg-[#FFB800] text-[#002583] shadow-button scale-[1.02]"
                        : "text-white/90 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {iconMap[label] || <LayoutDashboard size={19} />}
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Side Banner - Brand Yellow (#FFB800) */}
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#FFB800] via-[#ffa800] to-[#ffd44d] p-4 text-[#002583] shadow-card">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{role === "student" ? "⭐" : "🚀"}</span>
                <p className="font-black text-sm">{role === "student" ? "Keep learning!" : "Grow your class"}</p>
              </div>
              <p className="mt-1 text-xs font-bold leading-4 text-[#002583]/80">
                {role === "student" ? "Small progress every day creates big results." : "Everything you need is organised in one place."}
              </p>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                handleSignOut();
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-500/20 py-2.5 text-xs font-extrabold text-red-200 hover:bg-red-500/30 transition"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1480px] overflow-hidden rounded-[2.25rem] border border-white/80 bg-gradient-to-br from-[#f0f4ff]/90 via-white/80 to-[#fffdf0]/90 shadow-soft backdrop-blur-xl">
        
        {/* Sidebar - Brand Blue (#002583) theme */}
        <aside className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-[#002583] via-[#001d68] to-[#001548] p-5 text-white lg:flex">
          <div className="rounded-3xl bg-white/95 p-3 shadow-sm">
            <Brand/>
          </div>

          {/* User Badge */}
          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl shadow-card backdrop-blur-md">
              {role === "student" ? "👩‍🎓" : "👨‍🏫"}
            </div>
            <div>
              <p className="font-black text-white">{person}</p>
              <p className="text-xs font-semibold text-peach-300">{subtitle}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 flex flex-1 flex-col gap-1.5">
            {menu.map(([label, href]) => {
              const selected = active === label;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all duration-200 ${
                    selected
                      ? "bg-[#FFB800] text-[#002583] shadow-button scale-[1.02]"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {iconMap[label]}
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Side Banner - Brand Yellow (#FFB800) */}
          <div className="rounded-3xl bg-gradient-to-br from-[#FFB800] via-[#ffa800] to-[#ffd44d] p-5 text-[#002583] shadow-card">
            <div className="text-4xl">{role === "student" ? "⭐" : "🚀"}</div>
            <p className="mt-3 font-black text-lg">{role === "student" ? "Keep learning!" : "Grow your class"}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-[#002583]/80">
              {role === "student" ? "Small progress every day creates big results." : "Everything you need is organised in one place."}
            </p>
          </div>
        </aside>

        {/* Main Content View */}
        <div className="min-w-0 flex-1">
          <header className="flex items-center gap-3 border-b border-lavender-200/80 px-4 py-4 md:px-7">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card hover:bg-lavender-50 active:scale-95 transition lg:hidden"
              aria-label="Open sidebar navigation menu"
              aria-expanded={mobileSidebarOpen}
            >
              <Menu size={20} className="text-[#002583]" />
            </button>

            <div className="relative hidden max-w-xl flex-1 md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-500" size={18}/>
              <input className="pastel-input pl-11" placeholder="Search lessons, classes, students..."/>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href={role === "student" ? "/student/notifications" : "/teacher/announcements"}
                className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card hover:bg-lavender-50 transition"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={19} className="text-[#002583]"/>
                <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-[#FFB800] text-[9px] font-black text-[#002583]">!</span>
              </Link>

              <button
                onClick={toggleFullscreen}
                className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card hover:bg-lavender-50 transition"
                aria-label={isFullscreen ? "Exit Full Screen" : "Full Screen"}
                title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
              >
                {isFullscreen ? (
                  <Minimize size={19} className="text-[#002583]" />
                ) : (
                  <Maximize size={19} className="text-[#002583]" />
                )}
              </button>

              {role === "student" && (
                <button
                  onClick={() => {
                    localStorage.removeItem("student_webapp_prompt_dismissed");
                    window.dispatchEvent(new CustomEvent("open-webapp-installer"));
                  }}
                  className="hidden sm:flex items-center gap-2 rounded-2xl bg-[#FFB800] px-3.5 py-2.5 text-xs font-black text-[#002583] shadow-button hover:scale-[1.03] transition"
                  title="Install Student WebApp Shortcut"
                >
                  <Download size={16} />
                  <span>Install App</span>
                </button>
              )}

              <ProfileDropdown data={profileData} onSignOut={handleSignOut} />
            </div>
          </header>

          <main className="p-4 md:p-7">
            {role === "student" && <StudentWebappPrompt />}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


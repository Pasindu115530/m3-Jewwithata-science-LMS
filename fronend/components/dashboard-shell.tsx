"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, BookOpen, CalendarDays, CheckSquare, ClipboardCheck, CreditCard, FileText, LayoutDashboard,
  Megaphone, Menu, PlayCircle, Search, Settings, UserRound, Users, Video, WalletCards
} from "lucide-react";
import { Brand } from "@/components/brand";
import { studentMenu, teacherMenu } from "@/lib/mock-data";
import ProfileDropdown from "@/components/ui/profile-dropdown";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const iconMap: Record<string, ReactNode> = {
  Dashboard: <LayoutDashboard size={19}/>, "My Courses": <BookOpen size={19}/>, Tutes: <FileText size={19}/>,
  Recordings: <PlayCircle size={19}/>, "Free Lessons": <BookOpen size={19}/>, "Weekly Timetable": <CalendarDays size={19}/>,
  "Live Classes": <Video size={19}/>, "Zoom Links": <Video size={19}/>, Assignments: <CheckSquare size={19}/>, Payments: <CreditCard size={19}/>,
  "Payment History": <WalletCards size={19}/>, Attendance: <ClipboardCheck size={19}/>, Notifications: <Bell size={19}/>,
  Profile: <UserRound size={19}/>, Settings: <Settings size={19}/>, "Today’s Classes": <CalendarDays size={19}/>,
  Students: <Users size={19}/>, "Payment Approvals": <WalletCards size={19}/>, Announcements: <Megaphone size={19}/>
};

export function DashboardShell({ role, active, children }: { role: "student" | "teacher"; active: string; children: ReactNode }) {
  const router = useRouter();
  const menu = role === "student" ? studentMenu : teacherMenu;
  const person = role === "student" ? "Mia Perera" : "Kalhara Nakandala";
  const subtitle = role === "student" ? "Grade 10 Student" : "Science Teacher";

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
    email: role === "student" ? "mia.perera@student.kalaharascience.lk" : "lms.kalhara@gmail.com",
    role: role,
    grade: role === "student" ? "Grade 10" : "Teacher",
    status: role === "student" ? "Active Student" : "Verified Teacher",
  };

  return (
    <div className="min-h-screen p-3 md:p-5">
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
            <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card lg:hidden" aria-label="Open sidebar">
              <Menu size={20} className="text-[#002583]" />
            </button>

            <div className="relative hidden max-w-xl flex-1 md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender-500" size={18}/>
              <input className="pastel-input pl-11" placeholder="Search lessons, classes, students..."/>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card hover:bg-lavender-50 transition">
                <Bell size={19} className="text-[#002583]"/>
                <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-[#FFB800] text-[9px] font-black text-[#002583]">3</span>
              </button>

              <ProfileDropdown data={profileData} onSignOut={handleSignOut} />
            </div>
          </header>

          <main className="p-4 md:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}

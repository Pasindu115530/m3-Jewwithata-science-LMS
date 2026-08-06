import type { ReactNode } from "react";
import Link from "next/link";
import {
  Bell, BookOpen, CalendarDays, CheckSquare, ClipboardCheck, CreditCard, LayoutDashboard,
  Megaphone, Menu, Search, Settings, UserRound, Users, Video, WalletCards
} from "lucide-react";
import { Brand } from "@/components/brand";
import { studentMenu, teacherMenu, adminMenu } from "@/lib/mock-data";

const iconMap: Record<string, ReactNode> = {
  Dashboard: <LayoutDashboard size={19}/>, "Free Lessons": <BookOpen size={19}/>, "Weekly Timetable": <CalendarDays size={19}/>,
  "Live Classes": <Video size={19}/>, "Zoom Links": <Video size={19}/>, Assignments: <CheckSquare size={19}/>, Payments: <CreditCard size={19}/>,
  "Payment History": <WalletCards size={19}/>, Attendance: <ClipboardCheck size={19}/>, Notifications: <Bell size={19}/>,
  Profile: <UserRound size={19}/>, Settings: <Settings size={19}/>, "Today’s Classes": <CalendarDays size={19}/>,
  Students: <Users size={19}/>, "Payment Approvals": <WalletCards size={19}/>, Announcements: <Megaphone size={19}/>
};

export function DashboardShell({ role, active, children }: { role: "student" | "teacher" | "admin"; active: string; children: ReactNode }) {
  const menu = role === "student" ? studentMenu : role === "admin" ? adminMenu : teacherMenu;
  const person = role === "student" ? "Mia Perera" : role === "admin" ? "Admin" : "Pasindu Udana";
  const subtitle = role === "student" ? "Grade 10 Student" : role === "admin" ? "System Administrator" : "Science Teacher";
  return (
    <div className="min-h-screen p-3 md:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1480px] overflow-hidden rounded-[2.25rem] border border-white/80 bg-[#fff9f7]/75 shadow-soft backdrop-blur-xl">
        <aside className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-[#bfa7f4] via-[#9e7de4] to-[#8764d3] p-5 text-white lg:flex">
          <div className="rounded-3xl bg-white/70 p-3"><Brand/></div>
          <div className="mt-7 flex items-center gap-3 px-2">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/25 text-2xl shadow-card">{role === "student" ? "👩‍🎓" : role === "admin" ? "🛡️" : "👨‍🏫"}</div>
            <div><p className="font-black">{person}</p><p className="text-xs text-white/75">{subtitle}</p></div>
          </div>
          <nav className="mt-7 flex flex-1 flex-col gap-1.5">
            {menu.map(([label, href]) => {
              const selected = active === label;
              return <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${selected ? "bg-white text-lavender-700 shadow-card" : "text-white/90 hover:bg-white/15"}`}>{iconMap[label]}{label}</Link>
            })}
          </nav>
          <div className="rounded-3xl bg-gradient-to-br from-[#ffd8ca] to-[#f49daf] p-5 text-ink shadow-card">
            <div className="text-4xl">{role === "student" ? "⭐" : role === "admin" ? "🛡️" : "🚀"}</div>
            <p className="mt-3 font-black">{role === "student" ? "Keep learning!" : role === "admin" ? "Admin Control" : "Grow your class"}</p>
            <p className="mt-1 text-xs leading-5 text-ink/60">{role === "student" ? "Small progress every day creates big results." : role === "admin" ? "Full control over students, classes and payments." : "Everything you need is organised in one place."}</p>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex items-center gap-3 border-b border-white/80 px-4 py-4 md:px-7">
            <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 shadow-card lg:hidden" aria-label="Open sidebar"><Menu size={20}/></button>
            <div className="relative hidden max-w-xl flex-1 md:block"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18}/><input className="pastel-input pl-11" placeholder="Search lessons, classes, students..."/></div>
            <div className="ml-auto flex items-center gap-2"><button className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/80 shadow-card"><Bell size={19}/><span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-rose-400 text-[9px] font-black text-white">3</span></button><div className="grid h-11 w-11 place-items-center rounded-2xl bg-lavender-200 text-xl shadow-card">{role === "student" ? "👩‍🎓" : role === "admin" ? "🛡️" : "👨‍🏫"}</div></div>
          </header>
          <main className="p-4 md:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}

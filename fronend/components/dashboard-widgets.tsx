import type { ReactNode } from "react";
import { ArrowUpRight, MoreHorizontal, Play } from "lucide-react";
import { Card, Badge } from "@/components/ui";

export function WelcomeBanner({ teacher = false }: { teacher?: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-lavender-200 via-[#e8dcff] to-peach-100 p-6 shadow-card md:p-8">
      <div className="absolute right-4 top-2 text-7xl opacity-90 md:right-10 md:text-8xl">{teacher ? "🧪" : "🔬"}</div>
      <div className="relative max-w-2xl"><p className="text-sm font-extrabold text-lavender-700">{teacher ? "Teacher workspace" : "Student learning space"}</p><h1 className="mt-2 text-3xl font-black md:text-4xl">{teacher ? "Good afternoon, Pasindu!" : "Good afternoon, Mia!"} ☀️</h1><p className="mt-3 max-w-xl leading-7 text-ink/60">{teacher ? "Your classes, students, payments and assignments are ready for review." : "You are making steady progress. Let’s continue your Science journey today."}</p><button className="gradient-button mt-5"><Play size={18}/>{teacher ? "Open today’s class" : "Continue learning"}</button></div>
    </section>
  );
}

export function StatCard({ icon, label, value, note, tone = "purple" }: { icon: ReactNode; label: string; value: string; note: string; tone?: "purple" | "pink" | "yellow" | "blue" | "green" }) {
  const tones = { purple: "bg-lavender-100", pink: "bg-peach-100", yellow: "bg-butter", blue: "bg-skysoft", green: "bg-mintsoft" };
  return <Card className={`${tones[tone]} p-5`}><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-lavender-700 shadow-card">{icon}</div><ArrowUpRight size={17} className="text-ink/30"/></div><p className="mt-5 text-sm font-bold text-ink/60">{label}</p><p className="mt-1 text-3xl font-black">{value}</p><p className="mt-2 text-xs font-bold text-emerald-700">{note}</p></Card>
}

export function BarChartCard({ title = "Learning overview" }: { title?: string }) {
  const bars = [52, 71, 59, 88, 48, 75, 61];
  return <Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-black">{title}</h2><p className="text-xs text-ink/45">This week</p></div><button className="rounded-xl bg-white/80 p-2 shadow-card"><MoreHorizontal size={18}/></button></div><div className="mt-6 flex h-48 items-end justify-between gap-3 border-b border-ink/10 px-2">{bars.map((h, i)=><div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-lavender-500 to-peach-300 shadow-card" style={{height:`${h}%`}}/><span className="text-[10px] font-bold text-ink/45">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>)}</div></Card>
}

export function DonutCard({ title = "Topic progress" }: { title?: string }) {
  return <Card className="p-5"><h2 className="font-black">{title}</h2><div className="mt-5 flex items-center gap-5"><div className="donut relative h-32 w-32 shrink-0 rounded-full shadow-card"><div className="absolute inset-6 grid place-items-center rounded-full bg-white/90"><span className="text-xl font-black">78%</span></div></div><div className="space-y-3 text-sm"><Legend dot="bg-lavender-500" label="Biology" value="42%"/><Legend dot="bg-rose-300" label="Physics" value="28%"/><Legend dot="bg-amber-300" label="Chemistry" value="14%"/><Legend dot="bg-emerald-300" label="Other" value="16%"/></div></div></Card>
}
function Legend({dot,label,value}:{dot:string;label:string;value:string}){return <div className="flex min-w-36 items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${dot}`}/><span className="flex-1 text-ink/60">{label}</span><strong>{value}</strong></div>}

export function ActivityList({ teacher = false }: { teacher?: boolean }) {
  const rows = teacher ? [
    ["👩‍🎓","Nethmi joined Grade 10", "12 min ago"], ["📝","Assignment 06 submitted", "36 min ago"], ["💳","Payment slip awaiting review", "1 hour ago"]
  ] : [["🧬","Cells and Living Systems", "18 min"], ["⚙️","Force, Work and Energy", "24 min"], ["🧪","Acids, Bases and Salts", "31 min"]];
  return <Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-black">{teacher ? "Recent activity" : "Recently viewed"}</h2><button className="text-xs font-black text-lavender-700">See all</button></div><div className="mt-4 space-y-3">{rows.map((r)=><div key={r[1]} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-lavender-100 text-xl">{r[0]}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{r[1]}</p><p className="text-xs text-ink/45">{r[2]}</p></div><button className="grid h-9 w-9 place-items-center rounded-full bg-lavender-100 text-lavender-700"><Play size={15}/></button></div>)}</div></Card>
}

export function FeatureCard({ title, text, emoji, badge }: { title: string; text: string; emoji: string; badge?: string }) {
  return <Card className="relative overflow-hidden p-6"><div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-lavender-100"/><div className="relative"><div className="text-4xl">{emoji}</div>{badge && <div className="mt-4"><Badge tone="pink">{badge}</Badge></div>}<h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-ink/60">{text}</p></div></Card>
}

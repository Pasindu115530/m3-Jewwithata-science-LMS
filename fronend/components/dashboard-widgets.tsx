import type { ReactNode } from "react";
import { ArrowUpRight, MoreHorizontal, Play } from "lucide-react";
import { Card, Badge } from "@/components/ui";

export function WelcomeBanner({ teacher = false }: { teacher?: boolean }) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-r from-[#002583] via-[#001d68] to-[#001548] p-6 text-white shadow-soft md:p-8">
      <div className="absolute right-4 top-2 text-7xl opacity-80 md:right-10 md:text-8xl">{teacher ? "🧪" : "🔬"}</div>
      <div className="relative max-w-2xl">
        <span className="inline-block rounded-full bg-[#FFB800]/20 border border-[#FFB800]/40 px-3.5 py-1 text-xs font-black text-[#FFB800]">
          {teacher ? "Teacher Workspace" : "Student Learning Portal"}
        </span>
        <h1 className="mt-3 text-3xl font-black text-white md:text-4xl">
          {teacher ? "Good afternoon, Kalhara!" : "Good afternoon, Mia!"} ☀️
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-white/80">
          {teacher
            ? "Your classes, students, payments and assignments are ready for review."
            : "You are making steady progress. Let’s continue your Science journey today."}
        </p>
        <button className="gold-button mt-6">
          <Play size={18} />
          {teacher ? "Open today’s class" : "Continue learning"}
        </button>
      </div>
    </section>
  );
}

export function StatCard({
  icon,
  label,
  value,
  note,
  tone = "purple",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  tone?: "purple" | "pink" | "yellow" | "blue" | "green";
}) {
  const tones = {
    purple: "bg-lavender-50 border-lavender-200/70",
    pink: "bg-peach-50 border-peach-200/70",
    yellow: "bg-butter border-amber-200/70",
    blue: "bg-skysoft border-blue-200/70",
    green: "bg-mintsoft border-emerald-200/70",
  };

  return (
    <Card className={`${tones[tone]} border p-5 transition hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#002583] shadow-card">
          {icon}
        </div>
        <ArrowUpRight size={17} className="text-ink/30" />
      </div>
      <p className="mt-5 text-sm font-bold text-ink/60">{label}</p>
      <p className="mt-1 text-3xl font-black text-[#002583]">{value}</p>
      <p className="mt-2 text-xs font-extrabold text-emerald-700">{note}</p>
    </Card>
  );
}

export function BarChartCard({ title = "Learning overview" }: { title?: string }) {
  const bars = [52, 71, 59, 88, 48, 75, 61];
  return (
    <Card className="p-5 border border-lavender-200/80">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-ink">{title}</h2>
          <p className="text-xs font-semibold text-ink/45">This week</p>
        </div>
        <button className="rounded-xl bg-lavender-50 p-2 shadow-sm hover:bg-lavender-100">
          <MoreHorizontal size={18} className="text-ink/60" />
        </button>
      </div>
      <div className="mt-6 flex h-48 items-end justify-between gap-3 border-b border-ink/10 px-2">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-[#002583] to-[#FFB800] shadow-card transition-all duration-300 hover:brightness-110"
              style={{ height: `${h}%` }}
            />
            <span className="text-[10px] font-black text-ink/60">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DonutCard({ title = "Topic progress" }: { title?: string }) {
  return (
    <Card className="p-5 border border-lavender-200/80">
      <h2 className="font-black text-ink">{title}</h2>
      <div className="mt-5 flex items-center gap-5">
        <div className="donut relative h-32 w-32 shrink-0 rounded-full shadow-card">
          <div className="absolute inset-6 grid place-items-center rounded-full bg-white">
            <span className="text-xl font-black text-[#002583]">78%</span>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <Legend dot="bg-[#002583]" label="Biology" value="42%" />
          <Legend dot="bg-[#FFB800]" label="Physics" value="28%" />
          <Legend dot="bg-[#4d83f5]" label="Chemistry" value="14%" />
          <Legend dot="bg-[#7fd69c]" label="Other" value="16%" />
        </div>
      </div>
    </Card>
  );
}

function Legend({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex min-w-36 items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <span className="flex-1 font-semibold text-ink/70">{label}</span>
      <strong className="font-black text-ink">{value}</strong>
    </div>
  );
}

export function ActivityList({ teacher = false }: { teacher?: boolean }) {
  const rows = teacher
    ? [
        ["👩‍🎓", "Nethmi joined Grade 10", "12 min ago"],
        ["📝", "Assignment 06 submitted", "36 min ago"],
        ["💳", "Payment slip awaiting review", "1 hour ago"],
      ]
    : [
        ["🧬", "Cells and Living Systems", "18 min"],
        ["⚙️", "Force, Work and Energy", "24 min"],
        ["🧪", "Acids, Bases and Salts", "31 min"],
      ];

  return (
    <Card className="p-5 border border-lavender-200/80">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-ink">{teacher ? "Recent activity" : "Recently viewed"}</h2>
        <button className="text-xs font-black text-[#002583] hover:underline">See all</button>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r[1]} className="flex items-center gap-3 rounded-2xl bg-white p-3 border border-lavender-100 shadow-xs">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-peach-100 text-xl">{r[0]}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-ink">{r[1]}</p>
              <p className="text-xs font-semibold text-ink/45">{r[2]}</p>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-[#002583] text-white hover:bg-[#0e4fd4] transition">
              <Play size={15} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function FeatureCard({
  title,
  text,
  emoji,
  badge,
}: {
  title: string;
  text: string;
  emoji: string;
  badge?: string;
}) {
  return (
    <Card className="relative overflow-hidden p-6 border border-lavender-200/80">
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-peach-100/60" />
      <div className="relative">
        <div className="text-4xl">{emoji}</div>
        {badge && (
          <div className="mt-4">
            <Badge tone="yellow">{badge}</Badge>
          </div>
        )}
        <h3 className="mt-4 text-xl font-black text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
      </div>
    </Card>
  );
}

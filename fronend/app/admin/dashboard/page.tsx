"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { Users, BookOpen, CreditCard, UserCheck, Loader2 } from "lucide-react";

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  pendingPayments: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    activeStudents: 0,
    totalClasses: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) setAdminName(user.displayName);

    async function fetchStats() {
      try {
        const [studentsSnap, activeSnap, classesSnap] = await Promise.all([
          getDocs(query(collection(db, "users"), where("role", "==", "student"))),
          getDocs(query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "active"))),
          getDocs(collection(db, "classes")),
        ]);

        setStats({
          totalStudents: studentsSnap.size,
          activeStudents: activeSnap.size,
          totalClasses: classesSnap.size,
          pendingPayments: 0, // Extend later with payments collection
        });
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <DashboardShell role="admin" active="Dashboard">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
          Admin Portal
        </p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">
          Welcome back, {adminName} 👋
        </h1>
        <p className="mt-2 text-ink/55">
          Overview of your Science LMS platform.
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users />}
            label="Total Students"
            value={stats.totalStudents.toString()}
            note="Registered in system"
            tone="lavender"
          />
          <StatCard
            icon={<UserCheck />}
            label="Active Students"
            value={stats.activeStudents.toString()}
            note="Currently enrolled"
            tone="green"
          />
          <StatCard
            icon={<BookOpen />}
            label="Total Classes"
            value={stats.totalClasses.toString()}
            note="Across all grades"
            tone="blue"
          />
          <StatCard
            icon={<CreditCard />}
            label="Pending Payments"
            value={stats.pendingPayments.toString()}
            note="Awaiting approval"
            tone="yellow"
          />
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-black">Quick Actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <a href="/admin/students" className="gradient-button text-center">
              Manage Students
            </a>
            <a href="/teacher/classes" className="pill justify-center">
              Manage Classes
            </a>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-black">System Info</h2>
          <div className="mt-4 space-y-2 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Firebase Project</span>
              <span className="font-bold text-lavender-600">lmskalaharascience-ff93f</span>
            </div>
            <div className="flex justify-between">
              <span>Environment</span>
              <Badge tone="green">Production</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
  tone = "lavender",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  tone?: "lavender" | "green" | "blue" | "yellow" | "pink";
}) {
  const tones = {
    lavender: "bg-lavender-100 text-lavender-700",
    green: "bg-mintsoft text-emerald-700",
    blue: "bg-skysoft text-blue-700",
    yellow: "bg-butter text-amber-700",
    pink: "bg-peach-100 text-rose-700",
  };

  return (
    <Card className="p-5">
      <div className={`inline-flex rounded-xl p-2.5 ${tones[tone]}`}>{icon}</div>
      <p className="mt-3 text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold text-ink/70">{label}</p>
      <p className="mt-0.5 text-xs text-ink/45">{note}</p>
    </Card>
  );
}

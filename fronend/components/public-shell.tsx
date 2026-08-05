"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Atom, Menu, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/lib/site";

const links = [
  ["Home", "/"],
  ["Time Table", "/timetable"],
  ["Classes", "/classes"],
  ["Student Login", "/student-login"],
] as const;

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 flex w-full justify-center px-4">
      {/* ── Floating Capsule Ultra-Glass Navbar ── */}
      <div
        className="flex items-center gap-1 rounded-full p-1.5 transition-all duration-300 sm:gap-2"
        style={{
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255, 255, 255, 0.85)",
          boxShadow:
            "0 12px 40px rgba(0, 37, 131, 0.14), " +
            "0 0 0 1px rgba(0, 37, 131, 0.08), " +
            "inset 0 1.5px 0 rgba(255, 255, 255, 0.95), " +
            "inset 0 -1px 0 rgba(0, 37, 131, 0.08)",
        }}
      >

        {/* Far Left: Atom Brand Icon Capsule */}
        <Link
          href="/"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#002583] text-[#FFB800] shadow-md transition hover:scale-105"
          style={{
            boxShadow: "0 2px 10px rgba(0, 37, 131, 0.3), inset 0 1px 0 rgba(255, 184, 0, 0.4)",
          }}
          title="Kalhara Nakandala Science Academy"
        >
          <Atom size={19} className="animate-spin-slow" />
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-1 text-xs font-bold sm:flex md:text-sm">
          {links.map(([label, href]) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-[#002583] text-white shadow-md"
                    : "text-ink/75 hover:bg-[#002583]/10 hover:text-[#002583]"
                }`}
                style={
                  isActive
                    ? {
                        border: "1px solid rgba(255, 184, 0, 0.4)",
                        boxShadow: "0 4px 12px rgba(0, 37, 131, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                      }
                    : {}
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Far Right: "Join Class ↗" Capsule Button */}
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-110 sm:px-5 sm:text-sm"
          style={{
            background: "linear-gradient(135deg, #002583 0%, #00195e 100%)",
            border: "1px solid rgba(255, 184, 0, 0.55)",
            boxShadow: "0 4px 14px rgba(0, 37, 131, 0.35), inset 0 1px 0 rgba(255, 184, 0, 0.35)",
          }}
        >
          <span>Join Class</span>
          <ArrowUpRight size={16} className="text-[#FFB800]" />
        </Link>

        {/* Mobile Toggle Button */}
        <button
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-full bg-[#002583]/10 text-[#002583] transition hover:bg-[#002583]/20 sm:hidden"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-[#002583]/10 bg-white/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-6 text-ink/60">
            {siteConfig.tagline} Personal Science tuition with a student-friendly learning system.
          </p>
        </div>
        <div>
          <h3 className="font-black text-[#002583]">Contact</h3>
          <p className="mt-3 text-sm text-ink/60">
            {siteConfig.phone}<br />{siteConfig.email}<br />{siteConfig.location}
          </p>
        </div>
        <div>
          <h3 className="font-black text-[#002583]">Portal Access</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm font-bold text-[#002583]">
            <Link href="/student-login" className="hover:text-[#FFB800] transition-colors">Student Login</Link>
            <Link href="/teacher-login" className="hover:text-[#FFB800] transition-colors">Teacher Login</Link>
          </div>
        </div>
      </div>
      {/* Gold accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#002583] via-[#FFB800] to-[#002583]" />
      <div className="px-5 py-4 text-center text-xs text-ink/45">
        © 2026 Pasindu Udana Science Academy. UI demonstration only.
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return <><PublicHeader /><main>{children}</main><PublicFooter /></>;
}

export function PageHero({ title, text, icon = "🔬" }: { title: string; text: string; icon?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
      <div className="soft-panel grid-paper relative overflow-hidden p-8 md:p-12">
        {/* Gold blob top-right */}
        <div className="absolute -right-10 -top-12 h-52 w-52 rounded-full bg-[#FFB800]/20 blur-2xl" />
        {/* Navy blob bottom-left */}
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#002583]/10 blur-2xl" />
        <div className="relative max-w-3xl">
          <span className="mb-4 block text-5xl">{icon}</span>
          <h1 className="text-4xl font-black tracking-tight text-[#002583] md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">{text}</p>
        </div>
      </div>
    </section>
  );
}

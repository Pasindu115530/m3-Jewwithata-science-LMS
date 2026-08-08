"use client";

import type { ReactNode } from "react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Atom, Menu, X, Phone, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/lib/site";

const links = [
  ["Home", "/"],
  ["Gallery", "/gallery"],
  ["Time Table", "/timetable"],
  ["Student Login", "/student-login"],
] as const;

export function PublicHeader() {
  const pathname = usePathname();
  const [dimensions, setDimensions] = React.useState({ width: 0, left: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const buttonRefs = React.useRef<Map<string, HTMLAnchorElement>>(new Map());
  const containerRef = React.useRef<HTMLElement>(null);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const updateDimensions = () => {
      const selectedButton = buttonRefs.current.get(pathname);
      const container = containerRef.current;

      if (selectedButton && container) {
        const rect = selectedButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setDimensions({
          width: rect.width,
          left: rect.left - containerRect.left,
        });
      }
    };

    requestAnimationFrame(() => {
      updateDimensions();
    });

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [pathname]);

  return (
    <header className="sticky top-4 z-50 flex w-full flex-col items-center px-4">
      {/* ── Floating Capsule Ultra-Glass Navbar ── */}
      <div
        className="flex items-center gap-1 rounded-full p-1.5 transition-all duration-300 sm:gap-2"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
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

        {/* Center Links (Desktop) with CSS Smooth Tab Motion */}
        <nav
          ref={containerRef}
          className="relative hidden items-center gap-1 text-xs font-bold sm:flex md:text-sm"
        >
          {/* Sliding Background Indicator */}
          {dimensions.width > 0 && (
            <div
              className="absolute z-[1] rounded-full bg-[#002583] transition-all duration-300 ease-out"
              style={{
                width: dimensions.width,
                transform: `translateX(${dimensions.left}px)`,
                height: "100%",
                top: 0,
                border: "1px solid rgba(255, 184, 0, 0.4)",
                boxShadow: "0 4px 12px rgba(0, 37, 131, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
            />
          )}

          {links.map(([label, href]) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                ref={(el) => {
                  if (el) buttonRefs.current.set(href, el);
                  else buttonRefs.current.delete(href);
                }}
                className={`relative z-[2] rounded-full px-4 py-2 transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-ink/75 hover:bg-[#002583]/10 hover:text-[#002583]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Register Student Capsule Button */}
        <Link
          href="/student/register"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold text-[#002583] transition duration-200 hover:-translate-y-0.5 hover:brightness-105 sm:px-5 sm:text-sm"
          style={{
            background: "linear-gradient(135deg, #FFB800 0%, #FFA000 100%)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 14px rgba(255, 184, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          }}
        >
          <span>Register Student</span>
          <ArrowUpRight size={16} className="text-[#002583]" />
        </Link>

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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="grid h-9 w-9 place-items-center rounded-full bg-[#002583]/10 text-[#002583] transition hover:bg-[#002583]/20 sm:hidden"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="mt-3 flex w-full max-w-sm flex-col gap-2 rounded-3xl p-4 sm:hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 20px 50px rgba(0, 37, 131, 0.2), 0 0 0 1px rgba(0, 37, 131, 0.08)",
          }}
        >
          <div className="flex flex-col gap-1">
            {links.map(([label, href]) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-black transition-all ${
                    isActive
                      ? "bg-[#002583] text-white shadow-md"
                      : "text-zinc-800 hover:bg-[#002583]/10 hover:text-[#002583]"
                  }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#FFB800]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-zinc-200/80 flex items-center">
            <Link
              href="/student-login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full rounded-xl bg-zinc-100 px-3 py-2.5 text-center text-xs font-bold text-zinc-700 hover:bg-zinc-200 transition"
            >
              Student Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-20 relative overflow-hidden bg-gradient-to-b from-[#001442] via-[#00195e] to-[#001035] text-white">
      {/* Background Glow Blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#002583]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#FFB800]/15 blur-3xl" />

      {/* Top Pre-Footer Banner */}
      <div className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#FFB800]/30 bg-gradient-to-r from-[#002583] via-[#001d6e] to-[#001447] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 px-3 py-1 text-xs font-black text-[#FFB800]">
                <Sparkles size={13} /> SCIENCE TUITION ACADEMY
              </span>
              <h2 className="mt-2 font-sinhala text-2xl sm:text-3xl font-normal text-white">
                Ôú;hg <span className="text-[#FFB800]">úoHdj</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-blue-200/80 font-medium">
                Grade 6 – 11 Science Theory, Revision &amp; Paper Classes by Kalhara Nakandala.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/student/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFB800] to-[#f5a600] px-5 py-3 text-xs font-black text-[#002583] shadow-lg transition hover:scale-105"
              >
                <Sparkles size={15} /> Register Student
              </Link>
              <a
                href="https://wa.me/94767589005"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black text-white shadow-lg transition hover:scale-105"
              >
                <FaWhatsapp className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4 border-b border-blue-900/60">
        
        {/* Col 1: Brand & Teacher Profile */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFB800] text-[#002583] shadow-md">
              <Atom size={22} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-base font-black leading-none text-white">Kalhara Nakandala</p>
              <p className="text-xs font-bold text-[#FFB800]">Science Academy</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-blue-100/70">
            Personal Science tuition program dedicated to building conceptual understanding, exam success, and scientific confidence for Grades 8 through 11.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full bg-blue-900/60 border border-blue-700/50 px-2.5 py-1 text-[11px] font-bold text-amber-200">
              Grades 6–11
            </span>
            <span className="rounded-full bg-blue-900/60 border border-blue-700/50 px-2.5 py-1 text-[11px] font-bold text-amber-200">
              Sinhala &amp; English
            </span>
            <span className="rounded-full bg-blue-900/60 border border-blue-700/50 px-2.5 py-1 text-[11px] font-bold text-amber-200">
              Physical + Zoom
            </span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#FFB800]">Quick Navigation</h3>
          <ul className="mt-4 space-y-2.5 text-xs font-bold text-blue-100/80">
            <li>
              <Link href="/" className="hover:text-[#FFB800] transition flex items-center gap-1.5">
                <ChevronRight size={13} className="text-[#FFB800]" /> Home Page
              </Link>
            </li>
            <li>
              <Link href="/classes" className="hover:text-[#FFB800] transition flex items-center gap-1.5">
                <ChevronRight size={13} className="text-[#FFB800]" /> Classes &amp; Courses
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-[#FFB800] transition flex items-center gap-1.5">
                <ChevronRight size={13} className="text-[#FFB800]" /> Class Gallery
              </Link>
            </li>
            <li>
              <Link href="/timetable" className="hover:text-[#FFB800] transition flex items-center gap-1.5">
                <ChevronRight size={13} className="text-[#FFB800]" /> Time Table Schedule
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#FFB800] transition flex items-center gap-1.5">
                <ChevronRight size={13} className="text-[#FFB800]" /> Contact &amp; Inquiry
              </Link>
            </li>
            <li>
              <Link href="/student/register" className="hover:text-[#FFB800] transition flex items-center gap-1.5">
                <ChevronRight size={13} className="text-[#FFB800]" /> Student Registration
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact & Locations */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#FFB800]">Contact &amp; Centers</h3>
          <ul className="mt-4 space-y-3 text-xs font-semibold text-blue-100/80">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="text-[#FFB800] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Hotline / Call</p>
                <a href="tel:0767589005" className="hover:text-[#FFB800] transition">076 758 9005</a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <FaWhatsapp className="text-emerald-400 text-base flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">WhatsApp Support</p>
                <a href="https://wa.me/94767589005" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB800] transition">+94 76 758 9005</a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#FFB800] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Physical Center</p>
                <p className="text-blue-200/70">Sadarn - Bombuwela</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 4: LMS Portal Links */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#FFB800]">LMS Portal Access</h3>
          <p className="mt-3 text-xs text-blue-200/70 leading-relaxed">
            Access class recordings, downloadable tute PDFs, assignment submissions, and exam paper results.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/student-login"
              className="inline-flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white border border-white/15 hover:bg-white/20 transition"
            >
              <span>Student Portal Login</span>
              <ArrowUpRight size={14} className="text-[#FFB800]" />
            </Link>
            
          </div>
        </div>

      </div>

      {/* Gold Divider Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#00195e] via-[#FFB800] to-[#00195e]" />

      {/* Bottom Sub-Footer Bar */}
      <div className="mx-auto max-w-7xl px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200/60">
        <p className="text-center sm:text-left">
          © 2026 <strong className="text-white font-bold">Kalhara Nakandala Science Academy</strong>. All Rights Reserved.
        </p>
        <p className="text-center sm:text-right font-extrabold text-[#FFB800]/90">
          Designed &amp; Developed by -M3 Solution
        </p>
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

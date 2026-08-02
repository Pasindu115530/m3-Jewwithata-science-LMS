import type { ReactNode } from "react";
import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/lib/site";

const links = [
  ["Home", "/"], ["About Sir", "/about-sir"], ["Classes", "/classes"], ["Free Lessons", "/free-lessons"],
  ["Gallery", "/gallery"], ["Timetable", "/timetable"], ["Results", "/results"], ["Announcements", "/announcements"], ["Contact", "/contact"]
] as const;

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#002583]/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-5 text-sm font-bold text-ink/70 xl:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-[#002583]">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/student-login"
            className="hidden rounded-2xl border border-[#002583]/20 bg-white px-4 py-2 text-sm font-bold text-[#002583] shadow-card sm:block"
          >
            Student Login
          </Link>
          <Link
            href="/classes"
            className="gradient-button hidden rounded-full px-6 py-2.5 sm:inline-flex"
          >
            <Sparkles size={17} /> Join Class
          </Link>
          <button
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card xl:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
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

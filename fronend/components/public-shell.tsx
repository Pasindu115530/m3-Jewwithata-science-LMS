import type { ReactNode } from "react";
import Link from "next/link";
import { Menu, Phone, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { siteConfig } from "@/lib/site";

const links = [
  ["Home", "/"], ["About Sir", "/about-sir"], ["Classes", "/classes"], ["Free Lessons", "/free-lessons"],
  ["Gallery", "/gallery"], ["Timetable", "/timetable"], ["Results", "/results"], ["Announcements", "/announcements"], ["Contact", "/contact"]
] as const;

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[#f8f2ff]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-5 text-sm font-bold text-ink/70 xl:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-lavender-600">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/student-login" className="hidden rounded-2xl bg-white/80 px-4 py-2 text-sm font-bold shadow-card sm:block">Student Login</Link>
          <Link href="/classes" className="gradient-button hidden py-2.5 sm:inline-flex"><Sparkles size={17}/> Join Class</Link>
          <button aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 shadow-card xl:hidden"><Menu size={20}/></button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-white/60 bg-white/45">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
        <div><Brand/><p className="mt-4 max-w-sm text-sm leading-6 text-ink/60">{siteConfig.tagline} Personal Science tuition with a student-friendly learning system.</p></div>
        <div><h3 className="font-black">Contact</h3><p className="mt-3 text-sm text-ink/60">{siteConfig.phone}<br/>{siteConfig.email}<br/>{siteConfig.location}</p></div>
        <div><h3 className="font-black">Portal access</h3><div className="mt-3 flex flex-col gap-2 text-sm font-bold text-lavender-700"><Link href="/student-login">Student Login</Link><Link href="/teacher-login">Teacher Login</Link></div></div>
      </div>
      <div className="border-t border-white/70 px-5 py-5 text-center text-xs text-ink/45">© 2026 Pasindu Udana Science Academy. UI demonstration only.</div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return <><PublicHeader/><main>{children}</main><PublicFooter/></>;
}

export function PageHero({ title, text, icon = "🔬" }: { title: string; text: string; icon?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
      <div className="soft-panel grid-paper relative overflow-hidden p-8 md:p-12">
        <div className="absolute -right-10 -top-12 h-52 w-52 rounded-full bg-lavender-200/70 blur-2xl"/>
        <div className="relative max-w-3xl"><span className="mb-4 block text-5xl">{icon}</span><h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-ink/65">{text}</p></div>
      </div>
    </section>
  );
}

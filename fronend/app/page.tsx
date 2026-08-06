import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, CalendarDays, CheckCircle2, MessageCircle,
  Play, Sparkles, Star, Atom, TrendingUp,
} from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Card, Badge, SectionHeading, TextLink } from "@/components/ui";
import { classes, lessons, announcements, testimonials } from "@/lib/mock-data";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata(
  "Science Tuition Classes",
  "Colourful, personal Science tuition classes by Kalhara Nakandala for theory, revision, paper practice and online learning.",
  "/"
);

import { LiquidStatRectCard } from "@/components/liquid-hero-card";
import { CountUp } from "@/components/lightswind/count-up";
import { SpotlightCards } from "@/components/spotlight-cards";
import { FaWhatsapp } from "react-icons/fa";
export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.teacher,
    jobTitle: "Science Tuition Teacher",
    worksFor: { "@type": "Organization", name: siteConfig.name },
    url: siteConfig.url,
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ══════════════════════════════════════════════════════════════
          A. HERO — layered, watermark, floating badges
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-7xl overflow-visible px-4 pb-0 pt-10 lg:px-8">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-lavender-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-peach-200/30 blur-3xl" />

        {/* Watermark brand text — endless loop track */}
        <div className="hero-watermark">
          <div className="hero-watermark-track">
            <span>KALHARA NAKANDALA • SCIENCE ACADEMY • </span>
            <span>KALHARA NAKANDALA • SCIENCE ACADEMY • </span>
          </div>
        </div>

        {/* ── Main 3-column hero grid ── */}
        <div className="relative z-10 mt-8 grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">

          {/* Left content column */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="font-sinhala text-6xl font-normal leading-tight tracking-wide md:text-8xl">
              Ôú;hg{" "}
              <span className="text-[#002583]">úoHdj</span>
            </h1>
            <h2 className="font-nimsara text-5xl font-normal text-[#FFB800]">
              l,aydr kdlkao,
            </h2>
            <p className="max-w-sm leading-7 text-ink/60 lg:max-w-xs">
              Join Kalhara Nakandala for clear theory, revision, paper practice,
              assignments and personal progress monitoring.
            </p>
            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-3 text-sm font-bold text-ink/55 lg:justify-start">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Grades 8–11</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Sinhala &amp; English</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Physical + Zoom</span>
            </div>
          </div>

          {/* Centre image — Previous View restored */}
          <div className="relative flex justify-center">
            {/* Hero image — bottom-anchored view */}
            <div className="relative w-80 overflow-hidden rounded-[2.5rem] md:w-[28rem] lg:w-[32rem]" style={{ height: "560px" }}>
              <Image
                src="/images/bg/hero-bg.png"
                alt="Kalhara Nakandala Science Academy"
                width={1000}
                height={1100}
                priority
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                style={{ objectPosition: "center 50%" }}
              />
              {/* Inner glow overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-lavender-400/20" />
            </div>
          </div>

          {/* Right column — Liquid Glass Stat Rectangular Cards stacked one down one */}
          <div className="flex flex-col items-center gap-3.5 lg:items-end">
            <LiquidStatRectCard
              icon="🎓"
              title="450+"
              subtitle="Active Students"
              variant="gold"
            />
            <LiquidStatRectCard
              icon="📅"
              title="Next Class"
              subtitle="Grade 11 · Sunday"
              variant="navy"
            />
            <LiquidStatRectCard
              icon="📈"
              title="90%"
              subtitle="Improved Results"
              variant="white"
            />
            <LiquidStatRectCard
              icon="🏆"
              title="8+ Years"
              subtitle="Teaching Science"
              variant="gold"
            />
            <Link
              href="https://wa.me/94767589005"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-12 w-full max-w-[260px] items-center justify-center overflow-hidden rounded-xl px-4 transition-all duration-300 mt-1 shadow-[0_4px_20px_rgba(52,211,153,0.35)] hover:shadow-[0_6px_25px_rgba(52,211,153,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Light Green Border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 p-[2px]">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400" />
              </div>

              {/* Light Green Background */}
              <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400" />
              <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-b from-white/35 via-transparent to-black/5" />

              {/* Inner Glow */}
              <div className="absolute inset-[2px] rounded-[10px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)]" />

              {/* Content with WhatsApp Logo */}
              <span className="relative flex items-center gap-2 text-base font-bold text-emerald-950">
                <FaWhatsapp className="h-5 w-5 text-emerald-950" />
                WhatsApp Sir
              </span>

              {/* Hover Sheen */}
              <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-r from-white/0 via-white/35 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Hero horizon CTA bar ── */}
      <div className="relative w-full overflow-hidden" aria-label="Quick actions">
        {/* Top glow edge */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #1a3fa8 15%, #4B7FFF 50%, #1a3fa8 85%, transparent 100%)",
            boxShadow: "0 0 12px 2px rgba(75,127,255,0.45)",
          }}
        />

        {/* Bold navy bar body */}
        <div
          className="flex items-center justify-center gap-4 px-6 py-5 sm:gap-6 sm:px-10"
          style={{
            background:
              "linear-gradient(135deg, #001d6e 0%, #002583 40%, #003199 70%, #001d6e 100%)",
          }}
        >

          {/* Buttons */}
          <Link
            href="/timetable"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #FFB800 0%, #d69600 100%)",
              color: "#002583",
              boxShadow: "0 4px 16px rgba(255,184,0,0.35)",
            }}
          >
            <CalendarDays size={16} /> View Schedule
          </Link>

          <Link
            href="/free-lessons"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            <Play size={16} /> Free Lessons
          </Link>

        </div>

        {/* Bottom glow edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #1a3fa8 15%, #4B7FFF 50%, #1a3fa8 85%, transparent 100%)",
            boxShadow: "0 0 12px 2px rgba(75,127,255,0.45)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          C. STATS & TRUST INDICATORS BAR — 3-column
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-center">

          {/* Col 1 — Mission blurb */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFB800] text-[#002583] shadow-button">
                <Atom size={22} />
              </div>
              <strong className="font-black text-ink">Kalhara Nakandala Science</strong>
            </div>
            <p className="max-w-xs text-sm leading-6 text-ink/60">
              Personal, structured Science education for O/L students — combining
              theory, revision and digital tools in one system.
            </p>
            <TextLink href="/classes">OUR SERVICES</TextLink>
          </div>

          {/* Col 2 — Bold heading badge */}
          <div className="flex justify-center">
            <div className="stats-highlight text-center">
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#FFB800]">Our Promise</p>
              <p className="mt-1 text-xl font-black leading-tight text-ink">
                CLEAR THEORY,<br />REAL RESULTS
              </p>
            </div>
          </div>

          {/* Col 3 — Hero stat */}
          <div className="flex flex-col items-center gap-1 lg:items-end">
            <CountUp to={450} suffix="+" className="text-6xl font-black text-[#002583]" />
            <p className="font-semibold text-ink/55">Active Students</p>
            <TextLink href="/results">VIEW STATS</TextLink>
          </div>
        </div>

        {/* Secondary stats strip — Kokonut UI 3D tilt spotlight cards */}
        <SpotlightCards className="mt-8" />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          D. FEATURE BLOCK — 2-column split
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">

          {/* Left — content */}
          <div className="max-w-lg space-y-6 lg:flex-1">
            <p className="text-sm font-extrabold uppercase tracking-[.18em] text-[#FFB800]">
              Why students choose this class
            </p>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-ink md:text-5xl">
              A complete learning system,{" "}
              <span className="text-[#002583]">not only a weekly lecture</span>
            </h2>
            <p className="leading-7 text-ink/60">
              Every class is backed by assignments, recorded lessons, model papers
              and WhatsApp support. Parents receive regular progress updates so
              the whole family is aligned on results.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {["Simple explanations", "Weekly assignments", "Model papers", "Recorded lessons", "WhatsApp support", "Exam preparation"].map((f) => (
                <span key={f} className="rounded-full border border-[#002583]/20 bg-[#002583]/5 px-3 py-1.5 text-xs font-bold text-[#002583]">{f}</span>
              ))}
            </div>

            <Link
              href="/classes"
              className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-[#002583] transition hover:text-[#FFB800]"
            >
              EXPLORE ALL CLASSES <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — image with floating badge overlays */}
          <div className="relative flex justify-center lg:flex-1">
            {/* Main image */}
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="/images/bg/hero-bg.png"
                alt="Science learning in action"
                width={800}
                height={700}
                className="h-auto w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-[#002583]/10" />
            </div>

            {/* Floating badge 1 — Assignment submitted */}
            <div className="float-badge" style={{ bottom: "5rem", left: "-1.5rem", animationDelay: "0.5s" }}>
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-mintsoft text-base">✅</div>
                <div>
                  <p className="text-xs font-extrabold text-emerald-700">Assignment Submitted</p>
                  <p className="text-[11px] text-ink/50">Assignment 06 — Grade 11</p>
                </div>
              </div>
            </div>

            {/* Floating badge 2 — Result improved */}
            <div className="float-badge" style={{ top: "4rem", right: "-1.5rem", animationDelay: "2.5s" }}>
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFB800]/15 text-base">
                  <TrendingUp size={18} className="text-[#002583]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#002583]">Result Improved</p>
                  <p className="text-[11px] font-bold text-emerald-600">+23 marks this term</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          E. DARK NAVY CTA BLOCK — breakout icon, rounded, centered
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="dark-cta-block px-8 pb-14 pt-20 text-center md:px-16">
          {/* Breakout atom at top */}
          <div
            className="absolute left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.6rem] bg-[#FFB800] shadow-button"
            style={{ top: 0 }}
          >
            <Atom size={38} className="text-[#002583]" />
          </div>

          {/* Content */}
          <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
            Join Kalhara Nakandala&apos;s<br />Science class today.
          </h2>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-white/60">
            View the timetable, ask about available seats and choose a physical or
            online class that fits your schedule.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-7 py-3 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <MessageCircle size={17} /> Contact Sir
            </Link>
            <Link
              href="/student-login"
              className="inline-flex items-center gap-2 rounded-full bg-[#FFB800] px-7 py-3 font-black text-[#002583] shadow-card transition hover:-translate-y-0.5"
            >
              Student Login <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          F. "WHO WE SERVE" TRANSITION
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-16 text-center lg:px-8">
        <p className="text-xs font-extrabold uppercase tracking-[.25em] text-[#FFB800]">Who We Serve</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-ink md:text-4xl">
          Structured learning for every grade
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-ink/55">
          Theory, revision, paper practice and hybrid learning options organised
          by grade level — from Grade 8 through O/L.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CLASSES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {classes.map((c, i) => (
            <Card key={c.title + c.grade} className="p-6">
              <div className="flex items-center justify-between">
                <Badge tone={i % 2 ? "pink" : "lavender"}>{c.grade}</Badge>
                <Badge tone={c.mode === "Online" ? "blue" : "green"}>{c.mode}</Badge>
              </div>
              <div className="mt-5 text-4xl">{["🔭", "🧠", "🧪", "📝"][i]}</div>
              <h3 className="mt-4 text-xl font-black">{c.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-ink/60">
                <p><strong className="text-ink">{c.day}</strong> • {c.time}</p>
                <p>{c.location}</p>
                <p>{c.fee} / month</p>
                <p>{c.seats} seats remaining</p>
              </div>
              <Link href="/contact" className="gradient-button mt-5 w-full rounded-full">
                Enrol now <ArrowRight size={17} />
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <TextLink href="/classes">View every class</TextLink>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FREE LESSONS
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <SectionHeading
          eyebrow="Free lessons"
          title="Start learning before joining"
          text="Explore sample video lessons and downloadable notes for different grades."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {lessons.map((l, i) => (
            <Card key={l.title} className="overflow-hidden">
              <div className={`grid h-44 place-items-center text-7xl ${["bg-[#002583]/10", "bg-[#FFB800]/20", "bg-butter"][i]}`}>
                {l.icon}
              </div>
              <div className="p-5">
                <div className="flex gap-2">
                  <Badge>{l.grade}</Badge>
                  <Badge tone="blue">{l.duration}</Badge>
                </div>
                <h3 className="mt-4 text-xl font-black">{l.title}</h3>
                <p className="mt-1 text-sm text-ink/50">{l.topic} with Kalhara Nakandala</p>
                <Link href="/free-lessons" className="gradient-button mt-5 w-full rounded-full">
                  <Play size={16} /> Watch free
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ANNOUNCEMENTS + TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading eyebrow="Latest updates" title="Announcements for students and parents" />
          {announcements.map((a) => (
            <Card key={a.title} className="mb-4 flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-peach-100 text-xl">📣</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="pink">{a.category}</Badge>
                  <Badge tone="yellow">{a.priority}</Badge>
                </div>
                <h3 className="mt-2 font-black">{a.title}</h3>
                <p className="text-xs text-ink/45">{a.date}</p>
              </div>
            </Card>
          ))}
        </div>
        <div>
          <SectionHeading eyebrow="Student success" title="What our learners say" />
          {testimonials.map((t) => (
            <Card key={t.name} className="mb-4 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black">{t.name}</p>
                  <p className="text-xs text-ink/45">{t.grade}</p>
                </div>
                <div className="flex text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-ink/65">&ldquo;{t.text}&rdquo;</p>
            </Card>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}

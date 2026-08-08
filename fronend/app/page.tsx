import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight, CalendarDays, CheckCircle2, MessageCircle,
  Play, Sparkles, Star, Atom, TrendingUp, QrCode, Heart, ArrowUpRight, Trophy,
  UserPlus, LogIn, PhoneCall, Radio, FileText, GraduationCap, UserCheck
} from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { Card, Badge, SectionHeading, TextLink } from "@/components/ui";
import { classes, lessons, testimonials } from "@/lib/mock-data";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata(
  "Science Classes Sri Lanka | O/L Science Tuition | Kalhara Nakandala",
  "Grade 6–11 Science classes in Sri Lanka with Kalhara Nakandala, including O/L Science, theory, paper classes, revision, physical and online classes.",
  "/",
  [
    "Science Classes Sri Lanka",
    "Science Tuition Sri Lanka",
    "O/L Science Classes Sri Lanka",
    "O/L Science Tuition Sri Lanka",
    "Online Science Classes Sri Lanka",
    "Grade 6 Science Classes Sri Lanka",
    "Grade 7 Science Classes Sri Lanka",
    "Grade 8 Science Classes Sri Lanka",
    "Grade 9 Science Classes Sri Lanka",
    "Grade 10 Science Classes Sri Lanka",
    "Grade 11 Science Classes Sri Lanka",
    "Science Paper Classes Sri Lanka",
    "Sinhala Medium Science Classes Sri Lanka",
    "English Medium Science Classes Sri Lanka",
    "Kalhara Nakandala Science"
  ]
);

import { CountUp } from "@/components/lightswind/count-up";
import { FaWhatsapp } from "react-icons/fa";

const DynamicNeuralLinkBackground = dynamic(
  () => import("@/components/lightswind/neural-link-background")
);

const DynamicSpotlightCards = dynamic(
  () => import("@/components/spotlight-cards").then((mod) => mod.SpotlightCards)
);

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${siteConfig.url}/#organization`,
        name: "Kalhara Nakandala Science Academy",
        url: siteConfig.url,
        description: "Grade 6–11 Science tuition classes in Sri Lanka — theory, paper classes, revision, physical and Zoom online learning.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Colombo",
          addressCountry: "LK"
        },
        telephone: siteConfig.phone,
        email: siteConfig.email
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.teacher,
        jobTitle: "Science Teacher",
        worksFor: { "@id": `${siteConfig.url}/#organization` },
        url: siteConfig.url
      }
    ]
  };

  return (
    <PublicShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />


      {/* ══════════════════════════════════════════════════════════════
          A. HERO — layered, watermark, floating badges
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto max-w-7xl overflow-hidden lg:overflow-visible px-4 pb-0 pt-10 lg:px-8">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-lavender-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-peach-200/30 blur-3xl" />

        {/* Interactive Neural Link Background (Desktop only for performance) */}
        <div className="hidden lg:block">
          <DynamicNeuralLinkBackground
            nodeColor="#002583"
            lineColor="#002853"
            packetColor="#FFB800"
            nodeCount={30}
            maxDistance={125}
            interactionMode="router"
            interactive={true}
            packetFrequency={8000}
            className="z-0 opacity-40"
          />
        </div>

        {/* Watermark brand text — endless loop track */}
        <div className="hero-watermark">
          <div className="hero-watermark-track">
            <span>KALHARA NAKANDALA • SCIENCE ACADEMY • </span>
            <span>KALHARA NAKANDALA • SCIENCE ACADEMY • </span>
          </div>
        </div>

        {/* ── MOBILE PREVIEW HERO UPPER SECTION (hidden on lg:) ── */}
        <div className="lg:hidden relative z-10 mt-4 flex flex-row items-center gap-3 sm:gap-5 bg-white/40 backdrop-blur-md rounded-3xl p-3.5 sm:p-5 border border-white/60 shadow-lg">
          {/* Mobile Left Column: Teacher Image enlarged */}
          <div className="w-[50%] xs:w-[52%] max-w-[220px] sm:max-w-[280px] flex-shrink-0 relative overflow-hidden rounded-2xl h-[350px] sm:h-[440px]">
            <Image
              src="/images/bg/hero-bg.webp"
              alt="Kalhara Nakandala Science Academy"
              width={600}
              height={800}
              priority
              quality={75}
              sizes="(max-width: 640px) 50vw, 280px"
              className="absolute inset-0 h-full w-full object-cover object-top scale-105 transition-transform duration-500"
            />
          </div>

          {/* Mobile Right Column: Text & Info with enlarged H1 & H2 */}
          <div className="flex-1 text-left space-y-2.5">
            <h1 className="sr-only">Science Classes Sri Lanka | Kalhara Nakandala Science Academy</h1>
            <p className="font-sinhala text-3xl xs:text-4xl sm:text-5xl font-black leading-tight text-[#002583]" aria-hidden="true">
              <span className="block">Ôú;hg</span>
              <span className="block text-[#002583]">úoHdj</span>
            </p>
            <p className="font-malith text-xs sm:text-sm leading-relaxed text-ink/80">
              bf.kSu hkq úNd.hla iu;aùu muKla fkdj" oekqu" úYajdih iy ksjerÈ Ñka;kh f.dvke.Suhs¡
            </p>
            <h2 className="font-nimsara text-2xl xs:text-3xl sm:text-4xl font-semibold text-[#FFB800]">
              l,aydr kdlkao,
            </h2>
            <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-bold text-ink/75 pt-1">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" /> Grades 6–11 Science</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" /> Sinhala &amp; English Medium</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" /> Physical Hall + Online Zoom</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE PREVIEW ACTION BUTTONS (hidden on lg:) ── */}
        <div className="lg:hidden relative z-10 mt-5 flex flex-col items-center gap-3.5 w-full max-w-sm mx-auto">
          {/* 1. REGISTER button */}
          <Link
            href="/student/register"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FFB800] via-[#f5a600] to-[#d69600] px-6 font-black text-[#002583] shadow-lg border border-amber-300 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus size={22} className="stroke-[2.5] text-[#002583]" />
            <span className="text-base tracking-wider uppercase font-extrabold text-[#002583]">REGISTER</span>
          </Link>

          {/* 2. LOGIN button */}
          <Link
            href="/student-login"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#002583] via-[#003199] to-[#00195e] px-6 font-black text-white shadow-lg border border-[#FFB800]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn size={22} className="stroke-[2.5] text-[#FFB800]" />
            <span className="text-base tracking-wider uppercase font-extrabold text-white">LOGIN</span>
          </Link>

          {/* 3. TIME TABLE button */}
          <Link
            href="/timetable"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#003199] via-[#002583] to-[#00195e] px-6 font-black text-white shadow-lg border border-blue-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarDays size={22} className="stroke-[2.5] text-[#FFB800]" />
            <span className="text-base tracking-wider uppercase font-extrabold text-white">TIME TABLE</span>
          </Link>

          {/* 4. CALL US button */}
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-[#FFB800] bg-gradient-to-r from-[#FFF8E6] to-[#FEF3D6] px-6 font-black text-[#002583] shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PhoneCall size={22} className="stroke-[2.5] text-[#002583]" />
            <span className="text-base tracking-wider uppercase font-extrabold text-[#002583]">CALL US</span>
          </a>

          {/* WhatsApp Link Button */}
          <Link
            href="https://wa.me/94767589005"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex h-12 w-full max-w-[280px] items-center justify-center overflow-hidden rounded-xl px-4 transition-all duration-300 mt-1 shadow-[0_4px_20px_rgba(52,211,153,0.35)] hover:shadow-[0_6px_25px_rgba(52,211,153,0.5)] hover:scale-[1.02] active:scale-[0.98]"
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
              WhatsApp
            </span>

            {/* Hover Sheen */}
            <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-r from-white/0 via-white/35 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>

        {/* ── DESKTOP PREVIEW HERO GRID (hidden on mobile < lg) ── */}
        <div className="hidden lg:grid relative z-10 mt-8 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">

          {/* Left content column */}
          <div className="space-y-6 text-center lg:text-left order-1">
            <h1 className="sr-only">Science Classes Sri Lanka | Kalhara Nakandala Science Academy</h1>
            <p className="font-sinhala text-6xl font-normal leading-tight tracking-wide md:text-8xl" aria-hidden="true">
              Ôú;hg{" "}
              <span className="text-[#002583]">úoHdj</span>
            </p>
            <p className="font-malith max-w-sm leading-7 text-xl text-ink/60 lg:max-w-xs">
              bf.kSu hkq úNd.hla iu;aùu muKla fkdj" oekqu" úYajdih iy ksjerÈ Ñka;kh f.dvke.Suhs¡ ta .ufka úYajdikSh uÕfmkajkakd ùug wms lemù isáuq¡
            </p>
            <h2 className="font-nimsara text-5xl font-normal text-[#FFB800]">
              l,aydr kdlkao,
            </h2>
            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-3 text-sm font-bold text-ink/55 lg:justify-start">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Grades 6–11 Science</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Sinhala &amp; English Medium</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> Physical Hall + Zoom</span>
            </div>
          </div>


          {/* Right column — Quick Access Action Buttons */}
          <div className="flex flex-col items-center gap-3.5 lg:items-end order-3 lg:order-3 w-full max-w-sm mx-auto lg:max-w-[280px]">

            {/* 1. REGISTER button */}
            <Link
              href="/student/register"
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FFB800] via-[#f5a600] to-[#d69600] px-6 font-black text-[#002583] shadow-lg border border-amber-300 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <UserPlus size={22} className="stroke-[2.5] text-[#002583]" />
              <span className="text-base tracking-wider uppercase font-extrabold text-[#002583]">REGISTER</span>
            </Link>

            {/* 2. LOGIN button */}
            <Link
              href="/student-login"
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#002583] via-[#003199] to-[#00195e] px-6 font-black text-white shadow-lg border border-[#FFB800]/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <LogIn size={22} className="stroke-[2.5] text-[#FFB800]" />
              <span className="text-base tracking-wider uppercase font-extrabold text-white">LOGIN</span>
            </Link>

            {/* 3. TIME TABLE button */}
            <Link
              href="/timetable"
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#003199] via-[#002583] to-[#00195e] px-6 font-black text-white shadow-lg border border-blue-400/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <CalendarDays size={22} className="stroke-[2.5] text-[#FFB800]" />
              <span className="text-base tracking-wider uppercase font-extrabold text-white">TIME TABLE</span>
            </Link>

            {/* 4. CALL US button */}
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-[#FFB800] bg-gradient-to-r from-[#FFF8E6] to-[#FEF3D6] px-6 font-black text-[#002583] shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <PhoneCall size={22} className="stroke-[2.5] text-[#002583]" />
              <span className="text-base tracking-wider uppercase font-extrabold text-[#002583]">CALL US</span>
            </a>

            {/* WhatsApp Link Button */}
            <Link
              href="https://wa.me/94767589005"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-12 w-full max-w-[280px] items-center justify-center overflow-hidden rounded-xl px-4 transition-all duration-300 mt-1 shadow-[0_4px_20px_rgba(52,211,153,0.35)] hover:shadow-[0_6px_25px_rgba(52,211,153,0.5)] hover:scale-[1.02] active:scale-[0.98]"
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
                WhatsApp
              </span>

              {/* Hover Sheen */}
              <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-r from-white/0 via-white/35 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>

          {/* Centre image — Hero image */}
          <div className="relative flex justify-center order-2 lg:order-2 z-10 -mb-16">
            <div className="relative w-[32rem] h-[560px] overflow-hidden rounded-[2.5rem]">
              <Image
                src="/images/bg/hero-bg.webp"
                alt="Kalhara Nakandala Science Academy"
                width={1000}
                height={1100}
                priority
                quality={75}
                sizes="(max-width: 1280px) 450px, 512px"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                style={{ objectPosition: "center 50%" }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-lavender-400/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero horizon CTA bar ── */}
      <div className="hidden lg:block relative z-20 w-full overflow-hidden" aria-label="Quick actions">
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
            href="/student/register"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:brightness-110 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #FFB800 0%, #d69600 100%)",
              color: "#002583",
              boxShadow: "0 4px 16px rgba(255,184,0,0.45)",
            }}
          >
            <Sparkles size={16} /> Register Student
          </Link>

          <Link
            href="/timetable"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            <CalendarDays size={16} /> View Schedule
          </Link>

          <Link
            href="/student-login"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20"
          >
            <LogIn size={16} /> LMS Login
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
        <DynamicSpotlightCards className="mt-8" />
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
              A complete Science learning system,{" "}
              <span className="text-[#002583]">not only a weekly lecture</span>
            </h2>
            <p className="leading-7 text-ink/60">
              Every Science class is backed by assignments, recorded lessons, model papers
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
                src="/images/bg/profileinfo.webp"
                alt="Kalhara Nakandala Science Tuition Class in session — Colombo, Sri Lanka"
                width={800}
                height={700}
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 90vw, 450px"
                className="h-auto w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-[#002583]/10" />
            </div>



          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          E. DARK NAVY CTA BLOCK — breakout icon, rounded, centered
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 pt-14 pb-8 lg:px-8">
        <div className="dark-cta-block relative px-8 pb-14 pt-16 text-center md:px-16 shadow-2xl">
          {/* Breakout atom at top */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-[#FFB800] shadow-button ring-4 ring-white z-20"
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
          Structured Science learning for Grades 6–11
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-ink/55">
          Theory, revision, paper practice and hybrid learning options organised
          by grade level — from Grade 6 through O/L Science in Sri Lanka.
        </p>
      </section>


      {/* ══════════════════════════════════════════════════════════════
          CLASSES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card
              key={c.grade + c.title}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 p-0 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(0,37,131,0.12)]"
            >
              {c.titleImage && (
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={c.titleImage.replace(/\.png$/, ".webp")}
                    alt={c.fullTitle || c.title}
                    width={600}
                    height={340}
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 45vw, 380px"
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-4 text-base font-extrabold tracking-tight text-zinc-900">
                  {c.fullTitle || `${c.grade} (${c.title})`}
                </h3>
                {c.paperClass && (
                  <div className="mb-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        {c.paperClass.name}
                      </span>
                      <span className="rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        {c.paperClass.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-zinc-700">
                      {c.paperClass.schedule}
                    </p>
                  </div>
                )}
                {c.theoryClass && (
                  <div className="mb-4 rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-3.5 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                        <span className="inline-block h-2 w-2 rounded-full bg-zinc-400" />
                        {c.theoryClass.name}
                      </span>
                      <span className="rounded-full bg-zinc-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600">
                        {c.theoryClass.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-normal leading-relaxed text-zinc-500">
                      {c.theoryClass.note}
                    </p>
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
                  <Link href="/contact" className="gradient-button flex-1 py-2.5 text-xs">
                    Enrol now
                  </Link>
                  <Link href="/contact" className="pill px-3 py-2 text-xs">
                    <MessageCircle size={15} /> WhatsApp
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <TextLink href="/classes">View every class</TextLink>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SPECIAL FEATURES (පන්තියේ විශේෂතා)
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[.25em] text-[#FFB800]">
            Class Highlights &amp; Methodology
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#002583]">
            පන්තියේ විශේෂතා <span className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FFB800]">(Special Features)</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto font-medium">
            සිසුන්ගේ විශිෂ්ට ජයග්‍රහණ වෙනුවෙන් සැකසුණු අපගේ වැඩපිළිවෙළ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Live Zoom */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,37,131,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,37,131,0.12)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-[#6366F1] before:to-[#4F46E5]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 shadow-sm">
              <Radio size={24} className="stroke-[2.2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002583]">
              සජීවී Zoom දේශන
            </h3>
            <p className="mt-1 text-xs font-bold text-zinc-500 font-sans">
              (Interactive Live Classes)
            </p>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600">
              සෑම සතියකම පැවැත්වෙන සජීවී Zoom පන්ති මගින් සිසුන්ට ඕනෑම ගැටළුවක් සෘජුවම සර් වෙත යොමුකර විසඳා ගැනීමට අවස්ථාව සලසා ඇත.
            </p>
          </div>

          {/* Card 2: Premium Materials */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,37,131,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,37,131,0.12)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-[#0EA5E9] before:to-[#0284C7]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100/80 text-sky-600 shadow-sm">
              <FileText size={24} className="stroke-[2.2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002583]">
              විධිමත් නිබන්ධන පෙළ
            </h3>
            <p className="mt-1 text-xs font-bold text-zinc-500 font-sans">
              (Premium Materials)
            </p>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600">
              සියලුම සිද්ධාන්ත සහ විභාග ගැටළු අඩංගු උසස් ප්‍රමිතියෙන් යුත් නිබන්ධන PDF ආකාරයෙන් හෝ මුද්‍රිතව ලබාදේ.
            </p>
          </div>

          {/* Card 3: Paper Discussions */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,37,131,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,37,131,0.12)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-[#EC4899] before:to-[#DB2777]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 border border-pink-100/80 text-pink-600 shadow-sm">
              <GraduationCap size={24} className="stroke-[2.2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002583]">
              විභාග ප්‍රශ්න පත්‍ර සාකච්ඡා
            </h3>
            <p className="mt-1 text-xs font-bold text-zinc-500 font-sans">
              (Paper Discussions)
            </p>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600">
              පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ආදර්ශ ප්‍රශ්න පත්‍ර ලියවා, ලකුණු ලබාදී, ක්‍රමවත්ව සාකච්ඡා කර සිසුන් විභාගයට සූදානම් කෙරේ.
            </p>
          </div>

          {/* Card 4: Individual Attention */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/80 p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,37,131,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,37,131,0.12)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-[#8B5CF6] before:to-[#7C3AED]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100/80 text-purple-600 shadow-sm">
              <UserCheck size={24} className="stroke-[2.2]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#002583]">
              පෞද්ගලික අවධානය
            </h3>
            <p className="mt-1 text-xs font-bold text-zinc-500 font-sans">
              (Individual Attention)
            </p>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-600">
              සෑම ශිෂ්‍යයෙකුගේම ලකුණු මට්ටම් නිරීක්ෂණය කරමින් දුර්වලතා හඳුනාගෙන ඒවා මගහරවා ගැනීමට අවශ්‍ය පෞද්ගලික මගපෙන්වීම ලබාදේ.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

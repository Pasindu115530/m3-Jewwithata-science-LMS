"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building2,
  Laptop
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Card } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export function ContactPoster() {
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    grade: "Grade 10",
    mode: "Physical Class",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const text = `Hello Sir, I would like to inquire about Science classes.\n\n*Student Name:* ${formData.studentName}\n*Parent Name:* ${formData.parentName}\n*Grade:* ${formData.grade}\n*Class Mode:* ${formData.mode}\n*Phone:* ${formData.phone}\n*Message:* ${formData.message}`;
      const waUrl = `https://wa.me/94767589005?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    }, 600);
  };

  const faqs = [
    {
      q: "How can I register a new student for Science classes?",
      a: "You can register directly by clicking the 'Register' button on the homepage, filling out the inquiry form above, or contacting us directly via WhatsApp at 076 758 9005."
    },
    {
      q: "Are lessons conducted physically, online, or both?",
      a: "Classes are held both physically at main tuition halls in Maharagama & Nugegoda and streamed live via Zoom for islandwide online students."
    },
    {
      q: "How are tutes and monthly revision papers delivered for online students?",
      a: "Tute booklets are delivered directly to your doorstep via islandwide courier before the start of each month. PDF soft copies are also accessible in the Student Portal."
    },
    {
      q: "What if a student misses a live physical or Zoom class?",
      a: "Recorded class videos (HD quality) are uploaded to the LMS Student Portal after every session, allowing registered students to catch up anytime."
    }
  ];

  return (
    <div className="w-full">
      {/* ── Top Poster Banner Header ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#00195e] via-[#002583] to-[#001242] p-8 md:p-12 text-white shadow-2xl">
        {/* Glow Accents */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#FFB800]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 px-4 py-1.5 text-xs font-black text-[#FFB800] backdrop-blur-md">
            <Sparkles size={14} /> GET IN TOUCH • CONTACT SCIENCE ACADEMY
          </div>

          <h1 className="mt-4 font-sinhala text-4xl sm:text-5xl md:text-6xl font-normal leading-tight">
            Ôú;hg <span className="text-[#FFB800]">úoHdj</span>
          </h1>

          <p className="mt-3 text-lg font-bold text-amber-200/90 font-nimsara sm:text-2xl">
            l,aydr kdlkao,
          </p>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-blue-100/80">
            Have questions about new student registration, class schedules, physical institute locations, or Zoom online classes? Reach out directly via WhatsApp, Call, or send an Inquiry below.
          </p>
        </div>
      </div>

      {/* ── Quick Access Direct Action Cards ── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Card 1: Phone */}
        <a
          href="tel:0767589005"
          className="group relative flex flex-col items-center rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
            <Phone size={24} />
          </div>
          <h3 className="mt-4 text-lg font-black text-[#002583]">Direct Hotline</h3>
          <p className="mt-1 text-sm font-extrabold text-amber-600">076 758 9005</p>
          <p className="mt-2 text-xs font-semibold text-zinc-500">Tap to call directly</p>
        </a>

        {/* Card 2: WhatsApp */}
        <a
          href="https://wa.me/94767589005"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
            <FaWhatsapp className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-black text-[#002583]">Instant WhatsApp</h3>
          <p className="mt-1 text-sm font-extrabold text-emerald-600">+94 76 758 9005</p>
          <p className="mt-2 text-xs font-semibold text-zinc-500">Fastest response for inquiries</p>
        </a>

        {/* Card 3: Class Locations */}
        <div className="group relative flex flex-col items-center rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-500/10 via-white to-blue-500/5 p-6 text-center shadow-lg">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#002583] text-[#FFB800] shadow-md">
            <MapPin size={24} />
          </div>
          <h3 className="mt-4 text-lg font-black text-[#002583]">Class Locations</h3>
          <p className="mt-1 text-sm font-extrabold text-[#002583]">Maharagama &amp; Zoom</p>
          <p className="mt-2 text-xs font-semibold text-zinc-500">Physical &amp; Online Centers</p>
        </div>
      </div>

      {/* ── Main Two-Column Contact Section ── */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        
        {/* Left Column: Teacher Profile & Location Info */}
        <div className="space-y-6">
          {/* Teacher Profile Card */}
          <Card className="p-7 border border-zinc-200/80 bg-white/80 backdrop-blur-md shadow-xl rounded-3xl">
            <div className="flex items-center gap-5">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002583] to-blue-900 shadow-md">
                <Image
                  src="/images/bg/hero-bg.png"
                  alt="Kalhara Nakandala"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                  Tuition Specialist
                </span>
                <h2 className="mt-1.5 text-2xl font-black text-[#002583]">Kalhara Nakandala</h2>
                <p className="text-xs font-bold text-zinc-500">B.Sc. (Hons) • Science Education</p>
                <p className="mt-1 text-xs font-extrabold text-emerald-600">Grade 8 – 11 Theory &amp; Revision</p>
              </div>
            </div>

            <hr className="my-6 border-zinc-200/70" />

            {/* Detailed Contact List */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5 rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200/60">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-600">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">Call / Hotline</p>
                  <p className="text-sm font-black text-[#002583]">076 758 9005</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200/60">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <FaWhatsapp size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">WhatsApp Support</p>
                  <p className="text-sm font-black text-[#002583]">+94 76 758 9005</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200/60">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">Email Address</p>
                  <p className="text-sm font-black text-[#002583]">kalhara@scienceacademy.lk</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-zinc-50 p-3.5 border border-zinc-200/60">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/15 text-purple-600">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">Inquiry Hours</p>
                  <p className="text-sm font-black text-[#002583]">Daily 8:00 AM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Class Center Locations Card */}
          <Card className="p-6 border border-zinc-200/80 bg-white/80 backdrop-blur-md shadow-xl rounded-3xl">
            <h3 className="text-lg font-black text-[#002583] flex items-center gap-2">
              <Building2 size={20} className="text-amber-500" /> Physical &amp; Online Class Centers
            </h3>
            
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 border border-amber-200/80">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black text-white">
                      Physical Hall
                    </span>
                    <h4 className="mt-1 text-base font-black text-[#002583]">Maharagama Science Center</h4>
                    <p className="text-xs text-zinc-600 font-medium">Thalawathugoda Road, Maharagama</p>
                  </div>
                  <MapPin size={20} className="text-amber-600" />
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-4 border border-blue-200/80">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-black text-white">
                      Zoom Live
                    </span>
                    <h4 className="mt-1 text-base font-black text-[#002583]">Online Zoom Portal</h4>
                    <p className="text-xs text-zinc-600 font-medium">Islandwide Live Streamed Sessions</p>
                  </div>
                  <Laptop size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Send Inquiry Form */}
        <Card className="p-7 border border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-600 font-black">
                ✍️
              </span>
              <div>
                <h2 className="text-2xl font-black text-[#002583]">Send Class Inquiry</h2>
                <p className="text-xs font-bold text-zinc-500">Fill out details below to connect with Kalhara Sir</p>
              </div>
            </div>

            {submitted ? (
              <div className="my-10 text-center rounded-3xl bg-emerald-50 border border-emerald-200 p-8">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 text-2xl font-black text-emerald-950">Inquiry Prepared!</h3>
                <p className="mt-2 text-sm text-emerald-800 font-medium">
                  Redirecting to WhatsApp to send your message directly to Kalhara Sir...
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-700 mb-1">Student Name *</label>
                    <input
                      required
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      placeholder="e.g. Nethmi Perera"
                      className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-[#002583] focus:ring-2 focus:ring-[#002583]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-zinc-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      placeholder="e.g. Sunil Perera"
                      className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-[#002583] focus:ring-2 focus:ring-[#002583]/20"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="07X XXX XXXX"
                      className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-[#002583] focus:ring-2 focus:ring-[#002583]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-zinc-700 mb-1">Select Grade *</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-[#002583] focus:ring-2 focus:ring-[#002583]/20"
                    >
                      <option value="Grade 8">Grade 8 Science</option>
                      <option value="Grade 9">Grade 9 Science</option>
                      <option value="Grade 10">Grade 10 Science</option>
                      <option value="Grade 11">Grade 11 Science (O/L)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-zinc-700 mb-1">Preferred Learning Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-[#002583] focus:ring-2 focus:ring-[#002583]/20"
                  >
                    <option value="Physical Class">Physical Tuition Hall (Maharagama)</option>
                    <option value="Zoom Online Class">Zoom Online Class (Live Stream)</option>
                    <option value="Both">Both Physical &amp; Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-zinc-700 mb-1">Message / Specific Questions</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Ask about class fees, tute delivery, time table, or seat availability..."
                    className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-[#002583] focus:ring-2 focus:ring-[#002583]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#002583] to-[#00195e] py-4 text-sm font-black text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
                >
                  <Send size={18} className="text-[#FFB800]" /> Send Inquiry via WhatsApp
                </button>
              </form>
            )}
          </div>
        </Card>
      </div>

      {/* ── FAQ Section ── */}
      <div className="mt-14">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-[#002583]">
            <HelpCircle size={14} /> FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="mt-3 text-3xl font-black text-[#002583]">Got Questions About Science Classes?</h2>
          <p className="mt-1 text-sm font-semibold text-zinc-500">Quick answers to common inquiries from students &amp; parents</p>
        </div>

        <div className="mt-8 mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-md shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-5 text-left font-black text-[#002583] hover:bg-zinc-50/50"
              >
                <span className="text-base">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-amber-500" : "text-zinc-400"}`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm font-medium leading-relaxed text-zinc-600 border-t border-zinc-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

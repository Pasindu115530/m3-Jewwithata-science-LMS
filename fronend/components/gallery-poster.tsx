"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Maximize2 } from "lucide-react";

// ── Pure Gallery Images from D:\GitHub\m3-Jewwithata-science-LMS\fronend\public\images\gallery ──
const galleryImages = [
  // Row 1
  "/images/gallery/IMG_1797.JPG.webp",
  "/images/gallery/IMG_3506.JPG.webp",
  
  // Row 2
  "/images/gallery/WhatsApp Image 2026-08-02 at 01.51.54.webp",
  "/images/gallery/IMG_1247.webp",
  "/images/gallery/IMG_1358.webp",

  // Row 3 & Beyond
  "/images/gallery/IMG_1789.webp",
  "/images/gallery/IMG_2622.webp",
  "/images/gallery/IMG_2994.webp",
  "/images/gallery/IMG_3389.webp",
  "/images/gallery/IMG_3441.webp",
  "/images/gallery/IMG_3469.webp",
  "/images/gallery/IMG_4285.webp",
  "/images/gallery/IMG_4286.webp",
  "/images/gallery/IMG_4289.webp",
  "/images/gallery/IMG_4537.webp",
  "/images/gallery/IMG_4661.webp",
  "/images/gallery/IMG_4807.webp",
  "/images/gallery/IMG_6584.webp",
  "/images/gallery/IMG_6739.webp",
  "/images/gallery/IMG_6743.webp",
  "/images/gallery/IMG_7406.webp",
  "/images/gallery/IMG_7437.webp",
  "/images/gallery/IMG_7812.webp",
  "/images/gallery/IMG_7840.webp",
];

export function GalleryPoster() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="w-full">
      <section className="relative mx-auto max-w-6xl px-4 py-4 sm:px-6">

        {/* ── Editorial Header (Matching Reference Image Layout) ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-2">
          <div>
            {/* Pill Tag "Our Stories" */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-1 text-xs font-extrabold text-zinc-800 shadow-sm backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFB800]" />
              Our Stories
            </div>

            {/* Main Editorial Title "Photo Gallery" */}
            <h1 className="mt-3 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#002583] font-sans">
              Photo Gallery
            </h1>
          </div>

          {/* Right Sub-text matching attached layout */}
          <div className="max-w-xs md:text-right pb-1">
            <p className="text-xs sm:text-sm font-medium text-zinc-600 leading-relaxed">
              Captured moments from our science classes, lab experiments, and seminar stages.
            </p>
          </div>
        </div>

        {/* ── Asymmetrical Bento Photo Grid (Exact layout from Attached Reference Image) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

          {/* Row 1 - Left: Large Wide Landscape (2 columns wide) */}
          {galleryImages[0] && (
            <div
              onClick={() => setActiveImage(galleryImages[0])}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-zinc-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:col-span-2 min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]"
            >
              <Image
                src={galleryImages[0]}
                alt="Science Class Gallery Photo"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              
              {/* Subtle hover overlay icon */}
              <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-[#002583] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 size={20} />
                </div>
              </div>
            </div>
          )}

          {/* Row 1 - Right: Tall Vertical Portrait (1 column wide) */}
          {galleryImages[1] && (
            <div
              onClick={() => setActiveImage(galleryImages[1])}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-zinc-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]"
            >
              <Image
                src={galleryImages[1]}
                alt="Science Class Gallery Photo"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-[#002583] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 size={20} />
                </div>
              </div>
            </div>
          )}

          {/* Row 2 - Left Card */}
          {galleryImages[2] && (
            <div
              onClick={() => setActiveImage(galleryImages[2])}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-zinc-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-h-[280px] sm:min-h-[340px]"
            >
              <Image
                src={galleryImages[2]}
                alt="Science Class Gallery Photo"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#002583] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Row 2 - Center Card */}
          {galleryImages[3] && (
            <div
              onClick={() => setActiveImage(galleryImages[3])}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-zinc-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-h-[280px] sm:min-h-[340px]"
            >
              <Image
                src={galleryImages[3]}
                alt="Science Class Gallery Photo"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#002583] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Row 2 - Right Tall Card */}
          {galleryImages[4] && (
            <div
              onClick={() => setActiveImage(galleryImages[4])}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-zinc-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-h-[280px] sm:min-h-[340px]"
            >
              <Image
                src={galleryImages[4]}
                alt="Science Class Gallery Photo"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#002583] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Row 3 & Beyond: Rest of the Gallery Images */}
          {galleryImages.slice(5).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(img)}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/80 bg-zinc-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl min-h-[280px] sm:min-h-[320px]"
            >
              <Image
                src={img}
                alt="Science Class Gallery Photo"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#002583] shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 size={18} />
                </div>
              </div>
            </div>
          ))}

        </div>

      </section>

      {/* ── Fullscreen Image Lightbox Preview ── */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-zinc-950 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md transition hover:bg-black"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>

            {/* High-res Image Display */}
            <div className="relative h-[65vh] sm:h-[80vh] w-full">
              <Image
                src={activeImage}
                alt="Full size science class photo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

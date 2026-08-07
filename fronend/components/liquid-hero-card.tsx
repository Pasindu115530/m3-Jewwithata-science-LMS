"use client";

import React, { useId } from "react";

const GLASS_SHADOW =
  "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.15),inset_-3px_-3px_0.5px_-3px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(255,255,255,0.15)]";

const GlassFilter = React.memo(({ id, scale = 25 }: { id: string; scale?: number }) => (
  <svg aria-hidden="true" className="hidden" focusable={false}>
    <title>Glass Effect Filter</title>
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        height="200%"
        id={id}
        width="200%"
        x="-50%"
        y="-50%"
      >
        <feTurbulence
          baseFrequency="0.05 0.05"
          numOctaves="1"
          result="turbulence"
          seed="1"
          type="fractalNoise"
        />
        <feGaussianBlur in="turbulence" result="blurredNoise" stdDeviation="2" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="blurredNoise"
          result="displaced"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="B"
        />
        <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
        <feComposite in="finalBlur" in2="finalBlur" operator="over" />
      </filter>
    </defs>
  </svg>
));
GlassFilter.displayName = "GlassFilter";

export function LiquidStatRectCard({
  icon,
  title,
  subtitle,
  variant = "navy",
  mobileVariant,
}: {
  icon: React.ReactNode | string;
  title: string;
  subtitle: string;
  variant?: "gold" | "navy" | "white";
  mobileVariant?: "gold" | "navy" | "white" | "goldSolid" | "whiteSolid" | "emeraldSolid";
}) {
  const filterId = useId();

  const getStyles = (vName: string) => {
    if (vName === "gold") {
      return {
        bg: "linear-gradient(135deg, rgba(255, 184, 0, 0.35) 0%, rgba(214, 150, 0, 0.22) 100%)",
        border: "1px solid rgba(255, 184, 0, 0.65)",
        boxShadow: "0 8px 30px rgba(255, 184, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        iconBg: "bg-[#002583] text-[#FFB800]",
        titleColor: "text-[#002583]",
        subColor: "text-[#002583]/90",
      };
    }
    if (vName === "goldSolid") {
      return {
        bg: "linear-gradient(135deg, rgba(255, 184, 0, 0.95) 0%, rgba(245, 170, 0, 0.9) 100%)",
        border: "1px solid rgba(255, 220, 100, 0.9)",
        boxShadow: "0 6px 20px rgba(255, 184, 0, 0.35)",
        iconBg: "bg-[#002583] text-[#FFB800]",
        titleColor: "text-[#002583]",
        subColor: "text-[#002583]/90",
      };
    }
    if (vName === "whiteSolid") {
      return {
        bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 255, 0.95) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.95)",
        boxShadow: "0 6px 20px rgba(0, 37, 131, 0.15)",
        iconBg: "bg-[#002583] text-[#FFB800]",
        titleColor: "text-[#002583]",
        subColor: "text-zinc-600",
      };
    }
    if (vName === "emeraldSolid") {
      return {
        bg: "linear-gradient(135deg, rgba(209, 250, 229, 0.95) 0%, rgba(167, 243, 208, 0.9) 100%)",
        border: "1px solid rgba(110, 231, 183, 0.9)",
        boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)",
        iconBg: "bg-emerald-700 text-white",
        titleColor: "text-emerald-950",
        subColor: "text-emerald-800",
      };
    }
    if (vName === "navy") {
      return {
        bg: "linear-gradient(135deg, rgba(0, 37, 131, 0.45) 0%, rgba(0, 20, 71, 0.35) 100%)",
        border: "1px solid rgba(255, 184, 0, 0.55)",
        boxShadow: "0 8px 30px rgba(0, 37, 131, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
        iconBg: "bg-[#FFB800] text-[#002583]",
        titleColor: "text-[#002583]",
        subColor: "text-[#002583]/90",
      };
    }
    return {
      bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(240, 245, 255, 0.45) 100%)",
      border: "1px solid rgba(0, 37, 131, 0.3)",
      boxShadow: "0 8px 30px rgba(0, 37, 131, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      iconBg: "bg-[#002583]/15 text-[#002583]",
      titleColor: "text-[#002583]",
      subColor: "text-ink/75",
    };
  };

  const vDesk = getStyles(variant);
  const vMob = mobileVariant ? getStyles(mobileVariant) : vDesk;

  return (
    <div
      className="group relative flex w-full max-w-[260px] overflow-hidden items-center gap-3.5 rounded-2xl p-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{
        background: mobileVariant ? undefined : vDesk.bg,
        border: mobileVariant ? undefined : vDesk.border,
        boxShadow: mobileVariant ? undefined : vDesk.boxShadow,
      }}
    >
      {/* Dynamic responsive background layer when mobileVariant is specified */}
      {mobileVariant && (
        <>
          <div
            className="absolute inset-0 block lg:hidden rounded-[inherit]"
            style={{
              background: vMob.bg,
              border: vMob.border,
              boxShadow: vMob.boxShadow,
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block rounded-[inherit]"
            style={{
              background: vDesk.bg,
              border: vDesk.border,
              boxShadow: vDesk.boxShadow,
            }}
          />
        </>
      )}

      {/* Liquid Glass Shadow inset overlay */}
      <div className={`pointer-events-none absolute inset-0 rounded-[inherit] ${GLASS_SHADOW}`} />

      {/* SVG Liquid Filter */}
      <GlassFilter id={filterId} scale={25} />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3.5 w-full">
        <div
          className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-xl shadow-md ${
            mobileVariant ? `max-lg:${vMob.iconBg} lg:${vDesk.iconBg}` : vDesk.iconBg
          }`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`text-base font-black leading-tight ${
              mobileVariant ? `max-lg:${vMob.titleColor} lg:${vDesk.titleColor}` : vDesk.titleColor
            }`}
          >
            {title}
          </p>
          <p
            className={`text-xs font-extrabold ${
              mobileVariant ? `max-lg:${vMob.subColor} lg:${vDesk.subColor}` : vDesk.subColor
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Hover Liquid Gloss Sweep */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}

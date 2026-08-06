"use client";

import type { LucideIcon } from "lucide-react";
import { Play, Trophy, TrendingUp, CalendarDays } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/lightswind/count-up";

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

export interface SpotlightStatItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  emoji?: string;
  color: string;
  description?: string;
}

const DEFAULT_STATS: SpotlightStatItem[] = [
  {
    value: "120+",
    label: "Free Lessons",
    icon: Play,
    emoji: "▶️",
    color: "#0e4fd4",
    description: "Access video lessons & practice materials anytime",
  },
  {
    value: "8+",
    label: "Years Teaching",
    icon: Trophy,
    emoji: "🏆",
    color: "#d97706",
    description: "Proven experience guiding O/L Science students",
  },
  {
    value: "90%",
    label: "Improved Results",
    icon: TrendingUp,
    emoji: "📈",
    color: "#059669",
    description: "High pass rates with top A & B grades",
  },
  {
    value: "14",
    label: "Weekly Classes",
    icon: CalendarDays,
    emoji: "📅",
    color: "#0284c7",
    description: "Interactive live theory & revision sessions",
  },
];

interface CardProps {
  item: SpotlightStatItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function Card({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.55 : 1,
      }}
      className={cn(
        "group relative flex flex-col items-center text-center gap-3 overflow-hidden rounded-2xl border-2 p-5 cursor-pointer select-none",
        "bg-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        "dark:bg-white/5 dark:shadow-none",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        borderColor: `${item.color}40`,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Static accent tint — always visible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${item.color}18, transparent 70%)`,
        }}
      />

      {/* Hover glow layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 50% 30%, ${item.color}35, transparent 70%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      {/* Icon badge */}
      <div
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-sm transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${item.color}18`,
          boxShadow: `0 2px 8px ${item.color}20, inset 0 0 0 1px ${item.color}35`,
        }}
      >
        {Icon ? (
          <Icon size={20} strokeWidth={2.2} style={{ color: item.color }} />
        ) : item.emoji ? (
          <span>{item.emoji}</span>
        ) : null}
      </div>

      {/* Value & Title */}
      <div className="relative z-10 flex flex-col items-center gap-0.5">
        <p className="text-3xl font-black tracking-tight text-ink">
          <CountUp>{item.value}</CountUp>
        </p>
        <p className="text-xs font-bold uppercase tracking-wider text-ink/65">
          {item.label}
        </p>
      </div>

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2.5px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}, transparent)`,
        }}
      />
    </motion.div>
  );
}

Card.displayName = "Card";

export function SpotlightCards({
  items = DEFAULT_STATS,
  className,
}: {
  items?: SpotlightStatItem[];
  className?: string;
}) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  return (
    <div className={cn("relative grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {items.map((item) => (
        <Card
          dimmed={hoveredLabel !== null && hoveredLabel !== item.label}
          item={item}
          key={item.label}
          onHoverEnd={() => setHoveredLabel(null)}
          onHoverStart={() => setHoveredLabel(item.label)}
        />
      ))}
    </div>
  );
}

export default SpotlightCards;

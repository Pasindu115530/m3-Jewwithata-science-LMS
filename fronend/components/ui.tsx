import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`soft-card ${className}`}>{children}</div>;
}

export function Badge({
  children,
  tone = "navy",
}: {
  children: ReactNode;
  tone?: "navy" | "gold" | "lavender" | "green" | "pink" | "yellow" | "blue" | "purple";
}) {
  const tones: Record<string, string> = {
    navy:    "bg-[#002583]/10 text-[#002583]",
    gold:    "bg-[#FFB800]/20 text-[#7a5c00]",
    lavender:"bg-lavender-100 text-lavender-700",
    green:   "bg-mintsoft text-emerald-700",
    pink:    "bg-peach-100 text-rose-700",
    yellow:  "bg-butter text-amber-700",
    blue:    "bg-skysoft text-blue-700",
    purple:  "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tones[tone] ?? tones.navy}`}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[.2em] text-[#FFB800]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-black tracking-tight text-ink md:text-4xl">{title}</h2>
      {text && <p className="mt-3 leading-7 text-ink/65">{text}</p>}
    </div>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-bold text-[#002583] hover:text-[#FFB800] transition-colors"
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

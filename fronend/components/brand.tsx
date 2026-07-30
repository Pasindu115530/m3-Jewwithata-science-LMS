import Link from "next/link";
import { Atom } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-lavender-400 to-lavender-700 text-white shadow-button">
        <Atom size={25} />
      </span>
      {!compact && (
        <span>
          <strong className="block text-base font-black leading-tight text-ink">Pasindu Udana</strong>
          <span className="text-xs font-semibold text-ink/55">Science Academy</span>
        </span>
      )}
    </Link>
  );
}

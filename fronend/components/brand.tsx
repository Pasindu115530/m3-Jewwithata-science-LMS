import Link from "next/link";
import { Atom } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      {/* Gold icon, navy atom */}
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFB800] text-[#002583] shadow-button">
        <Atom size={25} />
      </span>
      {!compact && (
        <span>
          <strong className="block text-base font-black leading-tight text-[#002583]">Pasindu Udana</strong>
          <span className="text-xs font-semibold text-ink/55">Science Academy</span>
        </span>
      )}
    </Link>
  );
}

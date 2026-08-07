import { Card } from "@/components/ui";
import Link from "next/link";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  actionOnClick?: () => void;
}

export function EmptyState({
  emoji = "📚",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionOnClick,
}: EmptyStateProps) {
  const handleClick = onAction || actionOnClick;
  return (
    <Card className="p-8 text-center md:p-12">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-lavender-100 text-3xl shadow-sm">
        {emoji}
      </div>
      <h3 className="mt-4 text-xl font-black text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
        {description}
      </p>

      {actionLabel && (
        <div className="mt-6 flex justify-center">
          {actionHref ? (
            <Link
              href={actionHref}
              className="gradient-button px-6 py-2.5 text-xs shadow-md"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={handleClick}
              className="gradient-button px-6 py-2.5 text-xs shadow-md"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

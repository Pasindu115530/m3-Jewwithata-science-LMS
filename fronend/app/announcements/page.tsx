import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Science Class Announcements | Kalhara Nakandala Sri Lanka",
  "Latest announcements for Science class students in Sri Lanka — schedule changes, O/L model paper seminar dates and online class updates.",
  "/announcements",
  [
    "Science Class Announcements",
    "Kalhara Nakandala Updates",
    "O/L Science Seminar Dates",
    "Science Class Schedule Changes"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PageHero
        title="Announcements"
        text="Latest Science class updates, assignment reminders, O/L paper seminar notices and schedule changes by Kalhara Nakandala."
        icon="📣"
      />
      <PublicContent page="announcements" />
    </PublicShell>
  );
}


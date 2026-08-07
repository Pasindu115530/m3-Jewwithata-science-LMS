import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Free Science Lessons Sri Lanka | Grade 6–11 | Kalhara Nakandala",
  "Watch free Science video lessons by Kalhara Nakandala — Biology, Physics and Chemistry for Grade 6–11 students in Sri Lanka. Downloadable notes available.",
  "/free-lessons",
  [
    "Free Science Lessons Sri Lanka",
    "Free O/L Science Lessons",
    "Kalhara Nakandala Free Lessons",
    "Online Science Classes Sri Lanka",
    "Science Video Lessons Sri Lanka"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PageHero
        title="Free Science Lessons"
        text="Watch free sample Science lessons by Kalhara Nakandala, filter by grade and explore downloadable notes."
        icon="▶️"
      />
      <PublicContent page="free-lessons" />
    </PublicShell>
  );
}


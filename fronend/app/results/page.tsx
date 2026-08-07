import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Student Results | O/L Science Achievements | Kalhara Nakandala",
  "See how students improved their Science marks in O/L exams and term tests under Kalhara Nakandala. Student success stories from Sri Lanka.",
  "/results",
  [
    "O/L Science Results Sri Lanka",
    "Science Exam Results",
    "Kalhara Nakandala Student Results",
    "O/L Science A Pass Results",
    "Science Tuition Success Stories"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PageHero
        title="Student Results"
        text="Celebrate improvement stories, O/L Science exam achievements and student success stories under Kalhara Nakandala."
        icon="🏆"
      />
      <PublicContent page="results" />
    </PublicShell>
  );
}


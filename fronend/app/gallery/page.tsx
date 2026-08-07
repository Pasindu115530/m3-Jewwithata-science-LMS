import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Science Class Gallery | Kalhara Nakandala Science Academy",
  "Explore photos and moments from Kalhara Nakandala Science classes — practical experiments, seminars, model paper sessions and student activities in Sri Lanka.",
  "/gallery",
  [
    "Science Class Photos Sri Lanka",
    "Kalhara Nakandala Class Gallery",
    "Science Seminar Photos",
    "O/L Science Practical Class"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PageHero
        title="Class Gallery"
        text="Explore class moments, seminars, practical science activities and student achievements with Kalhara Nakandala."
        icon="📸"
      />
      <PublicContent page="gallery" />
    </PublicShell>
  );
}


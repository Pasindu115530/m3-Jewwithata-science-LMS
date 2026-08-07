import { createMetadata } from "@/lib/metadata";
import { PublicShell } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Science Classes Sri Lanka | Grade 6–11 O/L Science | Kalhara Nakandala",
  "Explore Science classes in Sri Lanka for Grade 6 to 11. Theory, paper classes, revision and Zoom online classes by Kalhara Nakandala.",
  "/classes",
  [
    "Science Classes Sri Lanka",
    "Grade 6 Science Classes Sri Lanka",
    "Grade 7 Science Classes Sri Lanka",
    "Grade 8 Science Classes Sri Lanka",
    "Grade 9 Science Classes Sri Lanka",
    "Grade 10 Science Classes Sri Lanka",
    "Grade 11 Science Classes Sri Lanka",
    "O/L Science Classes Sri Lanka",
    "Science Paper Classes Sri Lanka",
    "Online Science Classes Sri Lanka"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PublicContent page="classes" />
    </PublicShell>
  );
}


import { createMetadata } from "@/lib/metadata";
import { PublicShell } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Science Class Timetable | Kalhara Nakandala Science Sri Lanka",
  "View the complete Science class timetable for Grade 6-11 by Kalhara Nakandala. Physical hall classes and Zoom online Science schedules.",
  "/timetable",
  [
    "Science Class Timetable Sri Lanka",
    "Science Class Schedule Colombo",
    "Kalhara Nakandala Timetable",
    "Online Science Class Schedule",
    "O/L Science Class Times"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PublicContent page="timetable" />
    </PublicShell>
  );
}


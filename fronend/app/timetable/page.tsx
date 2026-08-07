import { createMetadata } from "@/lib/metadata";
import { PublicShell } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Timetable", "Find class dates, times, grades, locations and online learning options.", "/timetable");
export default function Page() { return <PublicShell><PublicContent page="timetable"/></PublicShell>; }

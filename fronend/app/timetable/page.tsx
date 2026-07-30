import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Weekly Timetable", "Find class dates, times, grades, locations and online learning options.", "/timetable");
export default function Page() { return <PublicShell><PageHero title="Weekly Timetable" text="Find class dates, times, grades, locations and online learning options." icon="📅"/><PublicContent page="timetable"/></PublicShell>; }

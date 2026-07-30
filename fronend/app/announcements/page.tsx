import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Announcements", "Class updates, assignment reminders, seminar notices and schedule changes.", "/announcements");
export default function Page() { return <PublicShell><PageHero title="Announcements" text="Class updates, assignment reminders, seminar notices and schedule changes." icon="📣"/><PublicContent page="announcements"/></PublicShell>; }

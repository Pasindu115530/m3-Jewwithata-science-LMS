import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Free Science Lessons", "Watch free sample lessons, filter by grade and explore downloadable notes.", "/free-lessons");
export default function Page() { return <PublicShell><PageHero title="Free Science Lessons" text="Watch free sample lessons, filter by grade and explore downloadable notes." icon="▶️"/><PublicContent page="free-lessons"/></PublicShell>; }

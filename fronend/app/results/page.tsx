import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Student Results", "Celebrate improvement stories, exam results and student achievements.", "/results");
export default function Page() { return <PublicShell><PageHero title="Student Results" text="Celebrate improvement stories, exam results and student achievements." icon="🏆"/><PublicContent page="results"/></PublicShell>; }

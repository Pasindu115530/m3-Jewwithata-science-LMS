import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Science Classes", "Compare theory, revision, paper, online and physical class options for Grades 6 to 11.", "/classes");
export default function Page() { return <PublicShell><PageHero title="Science Classes" text="Compare theory, revision, paper, online and physical class options for Grades 6 to 11." icon="📚"/><PublicContent page="classes"/></PublicShell>; }

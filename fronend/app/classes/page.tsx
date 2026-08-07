import { createMetadata } from "@/lib/metadata";
import { PublicShell } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Science Classes", "Compare theory, revision, paper, online and physical class options for Grades 6 to 11.", "/classes");
export default function Page() { return <PublicShell><PublicContent page="classes"/></PublicShell>; }

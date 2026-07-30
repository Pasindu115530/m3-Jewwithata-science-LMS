import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Class Gallery", "Explore class moments, seminars, practical activities and student achievements.", "/gallery");
export default function Page() { return <PublicShell><PageHero title="Class Gallery" text="Explore class moments, seminars, practical activities and student achievements." icon="📸"/><PublicContent page="gallery"/></PublicShell>; }

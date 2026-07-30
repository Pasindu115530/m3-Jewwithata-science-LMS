import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("Contact Pasindu Udana", "Ask about class registration, available seats, locations and online learning.", "/contact");
export default function Page() { return <PublicShell><PageHero title="Contact Pasindu Udana" text="Ask about class registration, available seats, locations and online learning." icon="💬"/><PublicContent page="contact"/></PublicShell>; }

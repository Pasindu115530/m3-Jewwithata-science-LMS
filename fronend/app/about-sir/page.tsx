import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";
export const metadata = createMetadata("About Pasindu Udana", "Meet the teacher, discover his teaching philosophy and learn how the class supports student success.", "/about-sir");
export default function Page() { return <PublicShell><PageHero title="About Pasindu Udana" text="Meet the teacher, discover his teaching philosophy and learn how the class supports student success." icon="👨‍🏫"/><PublicContent page="about-sir"/></PublicShell>; }

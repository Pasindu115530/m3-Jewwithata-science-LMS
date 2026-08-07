import { createMetadata } from "@/lib/metadata";
import { PublicShell, PageHero } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "About Kalhara Nakandala | Science Teacher Sri Lanka",
  "Meet Kalhara Nakandala — leading Science teacher in Sri Lanka offering theory, paper classes and revision for Grade 6-11 O/L Science students.",
  "/about-sir",
  ["Kalhara Nakandala", "Kalhara Nakandala Science", "Science Teacher Sri Lanka", "O/L Science Teacher", "Science Classes Sri Lanka"]
);

export default function Page() {
  return (
    <PublicShell>
      <PageHero
        title="About Kalhara Nakandala"
        text="Meet the teacher, discover his teaching philosophy and learn how the class supports student success in O/L Science across Sri Lanka."
        icon="👨‍🏫"
      />
      <PublicContent page="about-sir" />
    </PublicShell>
  );
}


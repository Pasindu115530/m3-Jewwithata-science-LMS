import { createMetadata } from "@/lib/metadata";
import { PublicShell } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Contact Kalhara Nakandala",
  "Ask about Science class registration, available seats, physical tuition hall locations and Zoom online learning.",
  "/contact"
);

export default function Page() {
  return (
    <PublicShell>
      <PublicContent page="contact" />
    </PublicShell>
  );
}

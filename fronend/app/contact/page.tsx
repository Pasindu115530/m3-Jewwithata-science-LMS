import { createMetadata } from "@/lib/metadata";
import { PublicShell } from "@/components/public-shell";
import { PublicContent } from "@/components/public-content";

export const metadata = createMetadata(
  "Contact Kalhara Nakandala | Science Classes Sri Lanka",
  "Contact Kalhara Nakandala about Grade 6-11 Science class registration, available seats, physical tuition locations in Colombo and Zoom online classes.",
  "/contact",
  [
    "Contact Kalhara Nakandala",
    "Science Class Registration Sri Lanka",
    "Science Tuition Contact",
    "Science Classes Sri Lanka",
    "O/L Science Tuition Colombo"
  ]
);

export default function Page() {
  return (
    <PublicShell>
      <PublicContent page="contact" />
    </PublicShell>
  );
}


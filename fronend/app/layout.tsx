import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Science Classes Sri Lanka | Kalhara Nakandala Science Academy",
    template: "%s | Kalhara Nakandala Science Academy",
  },
  description: "Grade 6–11 Science classes in Sri Lanka with Kalhara Nakandala, including O/L Science, theory, paper classes, revision, physical and online classes.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "Kalhara Science",
    statusBarStyle: "black-translucent",
  },
  other: {
    "geo.region": "LK",
    "geo.placename": "Sri Lanka",
  },
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}

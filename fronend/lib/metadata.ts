import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function createMetadata(
  title: string,
  description: string,
  path = "/",
  customKeywords?: string[]
): Metadata {
  const fullTitle = title.includes("Kalhara Nakandala") || title.includes("Science Classes") 
    ? `${title} | ${siteConfig.name}`
    : `${title} | Kalhara Nakandala Science Academy`;
  
  const canonical = new URL(path, siteConfig.url).toString();

  const defaultKeywords = [
    "Science Classes Sri Lanka",
    "Science Tuition Sri Lanka",
    "O/L Science Classes Sri Lanka",
    "Kalhara Nakandala Science",
    "Online Science Classes Sri Lanka",
    "Grade 6-11 Science Sri Lanka"
  ];

  const keywords = customKeywords && customKeywords.length > 0 ? customKeywords : defaultKeywords;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: `${siteConfig.name} Science Academy`,
      type: "website",
      locale: "en_LK",
      images: [{ url: "/images/bg/hero-bg.avif", width: 1200, height: 630, alt: `${siteConfig.name} Science Academy Sri Lanka` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/images/bg/hero-bg.avif"],
    },
  };
}

export const dashboardMetadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export const noindexMetadata: Metadata = {
  robots: { index: false, follow: false },
};



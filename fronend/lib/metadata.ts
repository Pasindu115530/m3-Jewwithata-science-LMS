import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function createMetadata(title: string, description: string, path = "/"): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonical = new URL(path, siteConfig.url).toString();
  return {
    title: fullTitle,
    description,
    keywords: ["Science tuition", "Pasindu Udana", "Sri Lanka tuition", "online Science class", "revision class"],
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_LK",
      images: [{ url: "/opengraph-image.svg", width: 1200, height: 630, alt: siteConfig.name }],
    },
  };
}

export const dashboardMetadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

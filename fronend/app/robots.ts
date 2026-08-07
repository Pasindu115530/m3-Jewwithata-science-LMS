import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/student/",
        "/teacher/",
        "/student-login",
        "/teacher-login",
        "/api/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}


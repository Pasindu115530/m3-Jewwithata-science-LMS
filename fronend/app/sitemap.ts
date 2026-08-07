import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { route: "", priority: 1.0, changeFrequency: "weekly" as const },
    { route: "/classes", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/free-lessons", priority: 0.8, changeFrequency: "weekly" as const },
    { route: "/about-sir", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/timetable", priority: 0.7, changeFrequency: "weekly" as const },
    { route: "/results", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/gallery", priority: 0.6, changeFrequency: "monthly" as const },
    { route: "/announcements", priority: 0.6, changeFrequency: "weekly" as const },
    { route: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${siteConfig.url}${r.route}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}



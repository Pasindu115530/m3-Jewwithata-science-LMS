import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { route: "", priority: 1.0, changeFrequency: "daily" as const },
    { route: "/classes", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/timetable", priority: 0.9, changeFrequency: "weekly" as const },
    { route: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
    { route: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { route: "/student-login", priority: 0.6, changeFrequency: "monthly" as const },
    { route: "/teacher-login", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  return routes.map((r) => ({
    url: `${siteConfig.url}${r.route}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

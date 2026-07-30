import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about-sir", "/classes", "/free-lessons", "/gallery", "/timetable", "/results", "/announcements", "/contact", "/student-login", "/teacher-login"];
  return routes.map(route => ({ url: `${siteConfig.url}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : .7 }));
}

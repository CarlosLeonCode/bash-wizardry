import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Add more routes here if the app grows
  ];
}

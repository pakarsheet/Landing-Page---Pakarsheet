import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";
import { shopTemplates } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/tools`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const shopRoutes: MetadataRoute.Sitemap = shopTemplates.map((template) => ({
    url: `${base}/shop/${template.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...toolRoutes, ...shopRoutes];
}

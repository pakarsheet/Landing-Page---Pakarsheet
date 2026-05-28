import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { tools, worksheets } from "@/lib/tools";
import { getAllProductSlugs, getAllPostSlugs, getAllPostCategories } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/shop`,          lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/blog`,          lastModified: now, changeFrequency: "daily",   priority: 0.85 },
    { url: `${base}/tools`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/custom-order`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy-policy`,lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/refund-policy`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = [...tools, ...worksheets].map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const [productSlugs, postSlugs, postCategories] = await Promise.all([
    getAllProductSlugs(),
    getAllPostSlugs(),
    getAllPostCategories(),
  ]);

  const shopRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${base}/shop/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const blogRoutes: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = postCategories.map((cat) => ({
    url: `${base}/blog/kategori/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...shopRoutes, ...blogRoutes, ...blogCategoryRoutes];
}

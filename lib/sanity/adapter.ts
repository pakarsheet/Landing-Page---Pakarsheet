/**
 * Adapter: konversi SanityShopTemplate → ShopTemplate (format yang dipakai komponen)
 * Ini memastikan semua komponen (TemplateCard, TemplateGrid, dll) tidak perlu diubah.
 */
import { urlFor } from "./client";
import type { SanityShopTemplate } from "./queries";
import type { ShopTemplate } from "@/lib/data";
import { LayoutDashboard } from "lucide-react";

export function adaptSanityTemplate(t: SanityShopTemplate): ShopTemplate {
  return {
    slug: t.slug.current,
    title: t.title,
    shortTitle: t.shortTitle,
    description: t.description,
    longDescription: t.longDescription,
    badge: t.badge,
    category: t.category,
    price: t.price,
    priceRaw: t.priceRaw,
    originalPrice: t.originalPrice,
    icon: LayoutDashboard, // icon tidak disimpan di Sanity, pakai default
    accent: t.accent ?? "bg-sky text-cobalt",
    features: t.features ?? [],
    whatsIncluded: t.whatsIncluded ?? [],
    previewImages: (t.previewImages ?? []).map((img) =>
      urlFor(img).width(800).auto("format").url()
    ),
    isNew: t.isNew ?? false,
    isBestSeller: t.isBestSeller ?? false,
    ctaUrl: t.ctaUrl,
  };
}

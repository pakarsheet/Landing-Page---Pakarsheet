import { groq } from "next-sanity";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SanityImage = {
  _key: string;
  asset: { _ref: string; _type: "reference" };
  alt?: string;
};

export type SanityShopTemplate = {
  _id: string;
  slug: { current: string };
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  badge: string;
  category: "Finance" | "Sales" | "Operasional" | "Bundle" | "Marketing" | "Project";
  price: string;
  priceRaw: number;
  originalPrice?: string;
  ctaUrl: string;
  accent: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  features: string[];
  whatsIncluded: string[];
  previewImages: SanityImage[];
  order: number;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const allShopTemplatesQuery = groq`
  *[_type == "shopTemplate"] | order(order asc) {
    _id,
    slug,
    title,
    shortTitle,
    description,
    longDescription,
    badge,
    category,
    price,
    priceRaw,
    originalPrice,
    ctaUrl,
    accent,
    isNew,
    isBestSeller,
    features,
    whatsIncluded,
    previewImages,
    order
  }
`;

export const shopTemplateBySlugQuery = groq`
  *[_type == "shopTemplate" && slug.current == $slug][0] {
    _id,
    slug,
    title,
    shortTitle,
    description,
    longDescription,
    badge,
    category,
    price,
    priceRaw,
    originalPrice,
    ctaUrl,
    accent,
    isNew,
    isBestSeller,
    features,
    whatsIncluded,
    previewImages,
    order
  }
`;

export const allShopSlugsQuery = groq`
  *[_type == "shopTemplate"] { "slug": slug.current }
`;

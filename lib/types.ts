/**
 * Shared types used across public pages and admin.
 * These are the "view" types — serializable, no functions.
 */

export type ProductCategory =
  | "Finance"
  | "Sales"
  | "Operasional"
  | "Bundle"
  | "Marketing"
  | "Project";

/** Serializable product shape passed from Server → Client Components */
export type ClientProduct = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  badge: string;
  category: ProductCategory;
  price: string;
  priceRaw: number;
  originalPrice?: string;
  accent: string;
  features: string[];
  whatsIncluded: string[];
  previewImages: string[];
  isNew: boolean;
  isBestSeller: boolean;
  ctaUrl: string;
};

export const shopCategories = [
  "Semua",
  "Finance",
  "Sales",
  "Operasional",
  "Marketing",
  "Project",
  "Bundle",
] as const;

export type ShopCategory = (typeof shopCategories)[number];

export type SortOption = "terbaru" | "terpopuler" | "harga-asc" | "harga-desc";

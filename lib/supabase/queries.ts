/**
 * Server-side data fetching helpers — used by public pages.
 * Uses anon client (respects RLS: only active products visible).
 */
import { createClient } from "./server";
import type { Product, SiteSettings } from "./types";

export async function getActiveProducts(): Promise<Product[]> {
  // Use admin client — bypasses cookies(), safe for SSG/ISR
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getActiveProducts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Use admin client — bypasses cookies(), safe for SSG/ISR
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) return null;
  return data;
}

export async function getAllProductSlugs(): Promise<string[]> {
  // Use admin client (no cookies) — safe for generateStaticParams at build time
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "active");
  return (data ?? []).map((r) => r.slug);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  // Use admin client — bypasses cookies(), safe for SSG/ISR
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}

export function buildWaUrl(settings: SiteSettings | null): string {
  if (!settings) {
    return "https://wa.me/6280000000000?text=Halo%20Pakarsheet";
  }
  return settings.contact_url;
}

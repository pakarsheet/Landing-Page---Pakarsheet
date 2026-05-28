/**
 * Server-side data fetching helpers — used by public pages.
 * Uses admin client (bypasses cookies(), safe for SSG/ISR).
 */
import type { Post, Product, SiteSettings } from "./types";

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

// ── Blog Posts ────────────────────────────────────────────────────────────────

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("getPublishedPosts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedPost(): Promise<Post | null> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();
  return data ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data ?? null;
}

export async function getPostsByCategory(category: string, limit?: number): Promise<Post[]> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getAllPostSlugs(): Promise<string[]> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r) => r.slug);
}

export async function getRelatedPosts(currentSlug: string, category: string, limit = 3): Promise<Post[]> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAllPostCategories(): Promise<string[]> {
  const { createAdminClient } = await import("./admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("posts")
    .select("category")
    .eq("status", "published");
  if (!data) return [];
  const unique = [...new Set(data.map((r) => r.category))];
  return unique;
}

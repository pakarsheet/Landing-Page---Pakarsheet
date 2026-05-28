"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { PostInsert, PostUpdate, ProductInsert, ProductUpdate } from "@/lib/supabase/types";

// ── Auth guard ────────────────────────────────────────────────────────────────

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: login required.");
  return user;
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  await requireAuth();
  const supabase = createAdminClient();
  const payload = parseProductForm(formData);

  const { error } = await supabase.from("products").insert(payload as ProductInsert);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAuth();
  const supabase = createAdminClient();
  const payload = parseProductForm(formData);

  const { error } = await supabase
    .from("products")
    .update(payload as ProductUpdate)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/shop/${payload.slug}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAuth();
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  if (product?.slug) revalidatePath(`/shop/${product.slug}`);
  return { success: true };
}

export async function duplicateProduct(id: string) {
  await requireAuth();
  const supabase = createAdminClient();

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !product) return { error: "Produk tidak ditemukan." };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at: _ca, updated_at: _ua, ...rest } = product;
  const newSlug = `${rest.slug}-copy-${Date.now().toString(36)}`;

  const { data: newProduct, error } = await supabase
    .from("products")
    .insert({
      ...rest,
      slug: newSlug,
      title: `${rest.title} (Copy)`,
      status: "draft",
    } as ProductInsert)
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { success: true, id: newProduct.id };
}

export async function toggleProductStatus(id: string, currentStatus: string) {
  await requireAuth();
  const supabase = createAdminClient();
  const newStatus = currentStatus === "active" ? "draft" : "active";

  const { error } = await supabase
    .from("products")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function updateSiteSettings(id: string, formData: FormData) {
  await requireAuth();
  const supabase = createAdminClient();

  const whatsapp_number = (formData.get("whatsapp_number") as string).trim();
  const whatsapp_message = (formData.get("whatsapp_message") as string).trim();
  const site_name = (formData.get("site_name") as string).trim();
  const tagline = (formData.get("tagline") as string).trim();
  const contact_url = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(whatsapp_message)}`;

  const { error } = await supabase
    .from("site_settings")
    .update({ whatsapp_number, whatsapp_message, site_name, tagline, contact_url })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}

// ── Image Upload ──────────────────────────────────────────────────────────────

export async function uploadProductImage(formData: FormData) {
  await requireAuth();
  const supabase = createAdminClient();
  const file = formData.get("file") as File;
  const slug = formData.get("slug") as string;

  if (!file || !slug) return { error: "File dan slug diperlukan." };

  const ext = file.name.split(".").pop();
  const fileName = `${slug}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { upsert: true });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return { url: data.publicUrl };
}

export async function deleteProductImage(path: string) {
  await requireAuth();
  const supabase = createAdminClient();
  const url = new URL(path);
  const storagePath = url.pathname.split("/product-images/")[1];
  if (!storagePath) return { error: "Path tidak valid." };

  const { error } = await supabase.storage
    .from("product-images")
    .remove([storagePath]);

  if (error) return { error: error.message };
  return { success: true };
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  await requireAuth();
  const supabase = createAdminClient();
  const payload = parsePostForm(formData);

  const { error } = await supabase.from("posts").insert(payload as PostInsert);
  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return { success: true };
}

export async function updatePost(id: string, formData: FormData) {
  await requireAuth();
  const supabase = createAdminClient();
  const payload = parsePostForm(formData);

  const { error } = await supabase
    .from("posts")
    .update(payload as PostUpdate)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${payload.slug}`);
  revalidatePath("/sitemap.xml");
  return { success: true };
}

export async function deletePost(id: string) {
  await requireAuth();
  const supabase = createAdminClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function togglePostStatus(id: string, currentStatus: string) {
  await requireAuth();
  const supabase = createAdminClient();
  const newStatus = currentStatus === "published" ? "draft" : "published";
  const published_at = newStatus === "published" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("posts")
    .update({ status: newStatus, published_at })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseProductForm(formData: FormData) {
  const parseList = (key: string): string[] =>
    ((formData.get(key) as string) ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const parseImages = (): string[] =>
    ((formData.get("preview_images") as string) ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const str = (key: string) => ((formData.get(key) as string) ?? "").trim();

  return {
    slug: str("slug"),
    title: str("title"),
    short_title: str("short_title"),
    description: str("description"),
    long_description: str("long_description"),
    badge: str("badge"),
    category: formData.get("category") as string,
    price: str("price"),
    price_raw: parseInt(formData.get("price_raw") as string, 10) || 0,
    original_price: str("original_price") || null,
    cta_url: str("cta_url"),
    accent: str("accent"),
    is_new: formData.get("is_new") === "on",
    is_best_seller: formData.get("is_best_seller") === "on",
    features: parseList("features"),
    whats_included: parseList("whats_included"),
    preview_images: parseImages(),
    sort_order: parseInt(formData.get("sort_order") as string, 10) || 0,
    status: formData.get("status") as string,
  };
}

function parsePostForm(formData: FormData) {
  const parseTags = (): string[] =>
    ((formData.get("tags") as string) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const status = formData.get("status") as string;
  const published_at =
    status === "published"
      ? (formData.get("published_at") as string) || new Date().toISOString()
      : null;

  const str = (key: string) => ((formData.get(key) as string) ?? "").trim();

  return {
    slug: str("slug"),
    title: str("title"),
    excerpt: str("excerpt"),
    content: str("content"),
    cover_image: str("cover_image") || null,
    category: str("category"),
    tags: parseTags(),
    author_name: str("author_name") || "Tim Pakarsheet",
    author_avatar: str("author_avatar") || null,
    status,
    featured: formData.get("featured") === "on",
    read_time: parseInt(formData.get("read_time") as string, 10) || 5,
    related_tool_slug: str("related_tool_slug") || null,
    related_shop_slug: str("related_shop_slug") || null,
    published_at,
  };
}

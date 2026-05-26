"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductInsert, ProductUpdate } from "@/lib/supabase/types";

// ── Products ──────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const supabase = createAdminClient();
  const payload = parseProductForm(formData);

  const { error } = await supabase.from("products").insert(payload as ProductInsert);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
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
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function toggleProductStatus(id: string, currentStatus: string) {
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

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return { url: data.publicUrl };
}

export async function deleteProductImage(path: string) {
  const supabase = createAdminClient();
  // path is the full URL — extract the storage path
  const url = new URL(path);
  const storagePath = url.pathname.split("/product-images/")[1];
  if (!storagePath) return { error: "Path tidak valid." };

  const { error } = await supabase.storage
    .from("product-images")
    .remove([storagePath]);

  if (error) return { error: error.message };
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

  return {
    slug: (formData.get("slug") as string).trim(),
    title: (formData.get("title") as string).trim(),
    short_title: (formData.get("short_title") as string).trim(),
    description: (formData.get("description") as string).trim(),
    long_description: (formData.get("long_description") as string).trim(),
    badge: (formData.get("badge") as string).trim(),
    category: formData.get("category") as string,
    price: (formData.get("price") as string).trim(),
    price_raw: parseInt(formData.get("price_raw") as string, 10) || 0,
    original_price: (formData.get("original_price") as string).trim() || null,
    cta_url: (formData.get("cta_url") as string).trim(),
    accent: (formData.get("accent") as string).trim(),
    is_new: formData.get("is_new") === "on",
    is_best_seller: formData.get("is_best_seller") === "on",
    features: parseList("features"),
    whats_included: parseList("whats_included"),
    preview_images: parseImages(),
    sort_order: parseInt(formData.get("sort_order") as string, 10) || 0,
    status: formData.get("status") as string,
  };
}

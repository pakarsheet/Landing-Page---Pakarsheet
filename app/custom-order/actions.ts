"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { CustomOrderInsert } from "@/lib/supabase/types";

export async function submitCustomOrder(formData: FormData) {
  const supabase = createAdminClient();

  const str = (key: string) => ((formData.get(key) as string) ?? "").trim();

  const name = str("name");
  const whatsapp = str("whatsapp");
  const business_type = str("business_type");
  const package_ = str("package");
  const description = str("description");

  // Basic validation
  if (!name || !whatsapp || !business_type || !package_ || !description) {
    return { error: "Semua field wajib diisi." };
  }

  // Normalize WA number — strip non-digits, ensure starts with 62
  const rawWa = whatsapp.replace(/\D/g, "");
  const normalizedWa = rawWa.startsWith("0")
    ? "62" + rawWa.slice(1)
    : rawWa.startsWith("62")
    ? rawWa
    : "62" + rawWa;

  const payload: CustomOrderInsert = {
    name,
    whatsapp: normalizedWa,
    business_name: str("business_name") || null,
    business_type,
    package: package_,
    description,
    has_old_file: formData.get("has_old_file") === "yes",
    team_size: str("team_size") || null,
    urgency: str("urgency") || null,
    status: "baru",
    admin_notes: null,
  };

  const { error } = await supabase.from("custom_orders").insert(payload);
  if (error) return { error: error.message };

  return { success: true, whatsapp: normalizedWa, package: package_, name };
}

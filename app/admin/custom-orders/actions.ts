"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { CustomOrder } from "@/lib/supabase/types";

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function updateCustomOrderStatus(id: string, status: CustomOrder["status"]) {
  await requireAuth();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("custom_orders")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/custom-orders");
  return { success: true };
}

export async function saveCustomOrderNotes(id: string, notes: string) {
  await requireAuth();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("custom_orders")
    .update({ admin_notes: notes || null })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/custom-orders");
  return { success: true };
}

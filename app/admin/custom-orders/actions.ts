"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CustomOrderUpdate } from "@/lib/supabase/types";

export type OrderStatus = "baru" | "dihubungi" | "negosiasi" | "deal" | "tidak-jadi";

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("custom_orders")
    .update({ status } as CustomOrderUpdate)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/custom-orders");
  revalidatePath(`/admin/custom-orders/${id}`);
  return { success: true };
}

export async function updateOrderNotes(id: string, admin_notes: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("custom_orders")
    .update({ admin_notes } as CustomOrderUpdate)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath(`/admin/custom-orders/${id}`);
  return { success: true };
}

export async function deleteOrder(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("custom_orders")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/custom-orders");
  return { success: true };
}

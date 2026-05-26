import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Pakarsheet" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

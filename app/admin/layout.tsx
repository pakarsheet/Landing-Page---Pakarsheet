import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/admin/Toast";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Pakarsheet" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  return (
    <div className="flex min-h-screen bg-blush/30">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Desktop header — hidden on mobile (mobile uses fixed topbar in AdminSidebar) */}
        <div className="hidden lg:block">
          <AdminHeader user={user} />
        </div>
        {/* Mobile spacer for fixed topbar */}
        <div className="h-14 lg:hidden" />
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
      <ToastProvider />
    </div>
  );
}

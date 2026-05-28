import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/admin/Toast";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Pakarsheet" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");

  return (
    <div className="flex min-h-screen bg-[#f7f8fc]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Desktop header */}
        <div className="hidden lg:block sticky top-0 z-30">
          <AdminHeader user={user} />
        </div>
        {/* Mobile spacer for fixed topbar */}
        <div className="h-14 lg:hidden" />
        <main className="flex-1 p-5 lg:p-7 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
      <ToastProvider />
    </div>
  );
}

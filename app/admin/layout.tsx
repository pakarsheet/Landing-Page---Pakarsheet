import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <AdminSidebar user={user} />
      {/* Mobile spacer for fixed top bar */}
      <div className="h-12 w-full lg:hidden" />
      <main className="flex-1 min-w-0 px-5 py-7 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1200px]">
          {children}
        </div>
      </main>
      <ToastProvider />
    </div>
  );
}

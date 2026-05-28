import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Settings } from "lucide-react";

export const metadata = { title: "Pengaturan — Admin Pakarsheet" };

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error && error.code !== "PGRST116") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        Gagal memuat pengaturan: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-line">
            <Settings className="h-4.5 w-4.5 text-muted" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Pengaturan</h1>
        </div>
        <p className="mt-2 text-sm text-ink/50">
          Perubahan langsung berlaku di landing page.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}

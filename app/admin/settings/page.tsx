import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

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
    <div className="space-y-7">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Pengaturan</h1>
        <p className="mt-1.5 text-base text-muted">
          Perubahan langsung berlaku di landing page.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}

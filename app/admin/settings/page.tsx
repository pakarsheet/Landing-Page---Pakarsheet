import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Pengaturan — Admin Pakarsheet" };

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan Situs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Perubahan langsung berlaku di landing page.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}

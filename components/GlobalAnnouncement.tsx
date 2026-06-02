import { createClient } from "@/lib/supabase/server";
import { AnnouncementBar } from "./AnnouncementBar";

export async function GlobalAnnouncement() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("announcement_text, is_announcement_active")
    .single();

  if (!settings?.is_announcement_active || !settings?.announcement_text) {
    return null;
  }

  return (
    <AnnouncementBar 
      text={settings.announcement_text} 
    />
  );
}

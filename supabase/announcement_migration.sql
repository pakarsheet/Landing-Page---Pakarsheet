-- Jalankan query ini di Supabase Dashboard -> SQL Editor
alter table site_settings 
drop column if exists announcement_cta_text,
drop column if exists announcement_cta_link,
drop column if exists announcement_countdown_to;

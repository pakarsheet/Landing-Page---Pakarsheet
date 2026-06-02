-- Jalankan query ini di Supabase Dashboard -> SQL Editor
alter table site_settings 
add column if not exists announcement_text text default null,
add column if not exists is_announcement_active boolean default false;

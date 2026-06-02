-- ============================================================
-- Pakarsheet — Supabase Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enum types ───────────────────────────────────────────────
create type product_category as enum (
  'Finance', 'Sales', 'Operasional', 'Bundle', 'Marketing', 'Project'
);

create type product_status as enum ('active', 'draft');

-- ── Table: products ──────────────────────────────────────────
create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  title           text not null,
  short_title     text not null default '',
  description     text not null default '',
  long_description text not null default '',
  badge           text not null default '',
  category        product_category not null default 'Finance',
  price           text not null default '',
  price_raw       integer not null default 0,
  original_price  text,
  cta_url         text not null default '',
  accent          text not null default 'bg-sky text-cobalt',
  is_new          boolean not null default false,
  is_best_seller  boolean not null default false,
  features        text[] not null default '{}',
  whats_included  text[] not null default '{}',
  preview_images  text[] not null default '{}',
  sort_order      integer not null default 0,
  status          product_status not null default 'draft',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ── Table: site_settings ─────────────────────────────────────
create table if not exists site_settings (
  id                uuid primary key default uuid_generate_v4(),
  whatsapp_number   text not null default '6280000000000',
  whatsapp_message  text not null default 'Halo Pakarsheet, saya ingin tahu lebih lanjut tentang produknya 😊',
  site_name         text not null default 'Pakarsheet',
  tagline           text not null default 'Bikin Google Sheets kamu naik level.',
  contact_url       text not null default 'https://wa.me/6280000000000',
  announcement_text text,
  is_announcement_active boolean not null default false,
  updated_at        timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function update_updated_at();

-- Seed default settings row (singleton)
insert into site_settings (whatsapp_number, whatsapp_message, site_name, tagline, contact_url)
values (
  '6280000000000',
  'Halo Pakarsheet, saya ingin tahu lebih lanjut tentang produknya 😊',
  'Pakarsheet',
  'Bikin Google Sheets kamu naik level.',
  'https://wa.me/6280000000000'
)
on conflict do nothing;

-- ── RLS Policies ─────────────────────────────────────────────
-- Public: hanya baca produk active
alter table products enable row level security;
alter table site_settings enable row level security;

-- Anyone can read active products (for the public shop page)
create policy "Public read active products"
  on products for select
  using (status = 'active');

-- Anyone can read site settings
create policy "Public read site settings"
  on site_settings for select
  using (true);

-- Service role bypasses RLS (used by admin server actions)
-- No extra policy needed — service_role key bypasses RLS by default.

-- ── Storage bucket: product-images ───────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Public read for product images
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Service role can upload/delete (handled server-side)
create policy "Service role manage product images"
  on storage.objects for all
  using (bucket_id = 'product-images');

-- ── Seed: existing product from data.ts ──────────────────────
insert into products (
  slug, title, short_title, description, long_description,
  badge, category, price, price_raw, original_price,
  cta_url, accent, is_new, is_best_seller,
  features, whats_included, preview_images, sort_order, status
) values (
  'content-planner-instagram-pro',
  'Content Planner Instagram Pro',
  'Content Planner IG',
  'Rencanakan, jadwalkan, dan pantau konten Instagram bisnis kamu dalam satu spreadsheet yang rapi.',
  'Buat konten Instagram jadi lebih terencana dan konsisten. Template ini membantu kamu menyusun kalender konten, mencatat ide, memantau performa posting, dan memastikan jadwal upload tidak berantakan — semua dari Google Sheets.',
  'Marketing',
  'Marketing',
  'Rp99rb',
  99000,
  'Rp149rb',
  'https://lynkd.id/pakarsheet',
  'bg-sky text-cobalt',
  true,
  false,
  ARRAY[
    'Kalender konten bulanan',
    'Tracker ide & caption',
    'Jadwal posting otomatis',
    'Pantau engagement per post'
  ],
  ARRAY[
    '1 file Google Sheets siap pakai',
    'Kalender konten 12 bulan',
    'Tracker ide konten & caption',
    'Dashboard performa konten',
    'Panduan penggunaan lengkap',
    'Update minor gratis'
  ],
  ARRAY[
    '/previews/content-planner-instagram-pro/preview-1.jpg',
    '/previews/content-planner-instagram-pro/preview-2.jpg',
    '/previews/content-planner-instagram-pro/preview-3.jpg',
    '/previews/content-planner-instagram-pro/preview-4.jpg'
  ],
  1,
  'active'
)
on conflict (slug) do nothing;

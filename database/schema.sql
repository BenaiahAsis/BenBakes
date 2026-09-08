-- Bakery App — Database Schema
-- Run this in Supabase SQL Editor before anything else.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── MENU ITEMS ───────────────────────────────────────────────────────────────
create table public.menu_items (
  id           uuid primary key default uuid_generate_v4(),
  category     text not null,
  name         text not null,
  description  text,
  price        numeric(10,2) not null,
  photo_url    text,
  is_available boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── GALLERY PHOTOS ───────────────────────────────────────────────────────────
create table public.gallery_photos (
  id         uuid primary key default uuid_generate_v4(),
  category   text not null,
  photo_url  text not null,
  caption    text,
  created_at timestamptz not null default now()
);

-- ─── CUSTOM ORDERS ────────────────────────────────────────────────────────────
create table public.custom_orders (
  id            uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  occasion      text,
  servings      text,
  flavor        text,
  design_notes  text,
  date_needed   date,
  status        text not null default 'new'
                  check (status in ('new','contacted','confirmed','completed')),
  created_at    timestamptz not null default now()
);

-- ─── SITE SETTINGS ────────────────────────────────────────────────────────────
create table public.site_settings (
  id                  integer primary key default 1
                        check (id = 1),
  business_name       text not null default 'Sweet Crumbs',
  tagline             text,
  address             text,
  hours_text          text,
  lead_time_text      text,
  delivery_text       text,
  payment_text        text,
  storage_text        text,
  about_text          text,
  messenger_username  text,
  instagram_handle    text,
  viber_number        text,
  whatsapp_number     text,
  updated_at          timestamptz not null default now()
);

-- Pre-insert the single settings row
insert into public.site_settings (id) values (1);

-- ─── ROW-LEVEL SECURITY ───────────────────────────────────────────────────────
alter table public.menu_items     enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.custom_orders  enable row level security;
alter table public.site_settings  enable row level security;

-- Public read
create policy "Public read menu"     on public.menu_items     for select using (true);
create policy "Public read gallery"  on public.gallery_photos for select using (true);
create policy "Public read settings" on public.site_settings  for select using (true);

-- Admin write (authenticated users only)
create policy "Admin write menu"     on public.menu_items     for all using (auth.role() = 'authenticated');
create policy "Admin write gallery"  on public.gallery_photos for all using (auth.role() = 'authenticated');
create policy "Admin write orders"   on public.custom_orders  for all using (auth.role() = 'authenticated');
create policy "Admin write settings" on public.site_settings  for all using (auth.role() = 'authenticated');

-- Anyone can submit a custom order request (INSERT only)
create policy "Public insert order"  on public.custom_orders  for insert with check (true);

-- ─── STORAGE BUCKETS ──────────────────────────────────────────────────────────
-- Create these manually in Supabase → Storage → New bucket:
--   1. Name: "menu-photos"    → toggle Public ON
--   2. Name: "gallery-photos" → toggle Public ON
--
-- Or run these (may require Supabase admin permissions):
-- insert into storage.buckets (id, name, public) values ('menu-photos', 'menu-photos', true);
-- insert into storage.buckets (id, name, public) values ('gallery-photos', 'gallery-photos', true);

// One-shot setup script: updates site_settings, menu_items, and gallery_photos
// Run with: node scripts/setup-benbakes.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ajkldpeswxajaoeimxss.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqa2xkcGVzd3hhamFvZWlteHNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg0NTQzNywiZXhwIjoyMTA0NDIxNDM3fQ.toNzNzYXJk-s_U3EGxc-fA9JUre6bV06_KElGVo753I';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ── 1. Site settings ────────────────────────────────────────────────────────
async function updateSettings() {
  console.log('Updating site settings...');
  const { error } = await supabase
    .from('site_settings')
    .update({
      business_name:     'Ben Bakes',
      tagline:           'Affordable Freshly Made Cookies — baked fresh in Bacolod City.',
      address:           'Bacolod City, Negros Occidental',
      messenger_username:'benbakesph',
      lead_time_text:    'All cookies are made to order. Please allow 2–3 days for your batch. Same-day orders are not available.',
      delivery_text:     'Pickup from our home kitchen in Bacolod City. Delivery available within Bacolod — message us on Messenger to arrange.',
      payment_text:      'GCash or cash on pickup. Full payment required before baking starts.',
      storage_text:      'Best consumed within 5 days. Store in an airtight container at room temperature. Do not refrigerate — cookies dry out.',
      about_text:        "Ben Bakes is a home-based cookie business in Bacolod City. We make freshly baked, affordable specialty cookies — no preservatives, no shortcuts. To God be the glory! 🙏",
      updated_at:        new Date().toISOString(),
    })
    .eq('id', 1);
  if (error) console.error('Settings error:', error.message);
  else console.log('✓ Site settings updated');
}

// ── 2. Menu items ───────────────────────────────────────────────────────────
async function updateMenu() {
  console.log('Clearing old menu items and inserting BenBakes cookies...');

  // Delete everything (we'll rebuild from real products)
  await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const cookies = [
    { category: 'Cookies', name: 'Chocolate Chip Cookies',          description: 'Thick and chewy, loaded with semi-sweet chocolate chunks. Box of 6.',            price: 220, sort_order: 1 },
    { category: 'Cookies', name: 'Red Velvet Cream Cheese Cookies', description: 'Soft red velvet base with pockets of cream cheese. Box of 6.',                    price: 250, sort_order: 2 },
    { category: 'Cookies', name: 'Matcha White Chocolate Cookies',  description: 'Earthy matcha dough with creamy white chocolate chips. Box of 6.',                 price: 260, sort_order: 3 },
    { category: 'Cookies', name: "S'mores Cookies",                 description: 'Chocolate chip base stuffed with marshmallow and graham crumbles. Box of 6.',      price: 260, sort_order: 4 },
    { category: 'Cookies', name: 'Double Chocolate Cookies',        description: 'Deep dark chocolate dough, fudgy and rich. Box of 6.',                             price: 240, sort_order: 5 },
    { category: 'Cookies', name: 'Cookie Box Sampler',              description: 'Pick any 3 flavors — 2 pieces each. Great for gifting.',                           price: 380, sort_order: 6 },
  ];

  const { error } = await supabase.from('menu_items').insert(cookies);
  if (error) console.error('Menu error:', error.message);
  else console.log(`✓ ${cookies.length} cookie menu items inserted`);
}

// ── 3. Gallery photos ───────────────────────────────────────────────────────
async function uploadGalleryPhoto(localPath, category, caption) {
  const fileBuffer = readFileSync(localPath);
  const fileName   = `benbakes-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('gallery-photos')
    .upload(fileName, fileBuffer, { contentType: 'image/jpeg', upsert: true });

  if (uploadError) {
    console.error(`Upload error for ${caption}:`, uploadError.message);
    return;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gallery-photos')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from('gallery_photos')
    .insert({ category, photo_url: publicUrl, caption });

  if (dbError) console.error(`DB insert error for ${caption}:`, dbError.message);
  else console.log(`✓ Uploaded: ${caption}`);
}

async function uploadGallery() {
  console.log('Uploading gallery photos...');

  const photos = [
    {
      path: resolve(__dirname, '../.user_uploaded/media_1788856835584.jpg'),
      category: 'Cookies',
      caption:  'Fresh batch — choco chip, red velvet, matcha & s\'mores',
    },
    {
      path: resolve(__dirname, '../.user_uploaded/media_1788856835602.jpg'),
      category: 'Cookies',
      caption:  'Red Velvet Cream Cheese Cookies',
    },
    {
      path: resolve(__dirname, '../.user_uploaded/media_1788856835618.jpg'),
      category: 'Cookies',
      caption:  'Our specialty cookie lineup',
    },
  ];

  for (const photo of photos) {
    await uploadGalleryPhoto(photo.path, photo.category, photo.caption);
  }
}

// ── Run everything ──────────────────────────────────────────────────────────
async function main() {
  console.log('\n🍪 BenBakes setup script starting...\n');
  await updateSettings();
  await updateMenu();
  await uploadGallery();
  console.log('\n✅ All done! Refresh your site to see the changes.\n');
}

main().catch(console.error);

// TypeScript types matching Supabase DB schema

export type MenuCategory = 'Cakes' | 'Cupcakes' | 'Pastries' | 'Cookies';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export type GalleryCategory = string;

export interface GalleryPhoto {
  id: string;
  category: GalleryCategory;
  photo_url: string;
  caption: string | null;
  created_at: string;
}

export type OrderStatus = 'new' | 'contacted' | 'confirmed' | 'completed';

export interface CustomOrder {
  id: string;
  customer_name: string;
  occasion: string | null;
  servings: string | null;
  flavor: string | null;
  design_notes: string | null;
  date_needed: string | null; // ISO date string
  status: OrderStatus;
  created_at: string;
}

export interface SiteSettings {
  id: 1;
  business_name: string;
  tagline: string | null;
  address: string | null;
  hours_text: string | null;
  lead_time_text: string | null;
  delivery_text: string | null;
  payment_text: string | null;
  storage_text: string | null;
  about_text: string | null;
  messenger_username: string | null;
  instagram_handle: string | null;
  viber_number: string | null;
  whatsapp_number: string | null;
  updated_at: string;
}

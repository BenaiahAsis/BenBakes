-- Bakery App — Seed Data
-- Run this AFTER schema.sql to populate starter menu items and site settings.

insert into public.menu_items (category, name, description, price, sort_order) values
  ('Cakes',    'Classic Chocolate Cake',  'Rich chocolate sponge, dark chocolate ganache. 8" round, serves 10–12.',   850,  1),
  ('Cakes',    'Ube Velvet Cake',         'Ube sponge layered with cream cheese frosting. 8" round, serves 10–12.',   950,  2),
  ('Cakes',    'Red Velvet Cake',         'Cocoa sponge, cream cheese frosting. 8" round, serves 10–12.',             900,  3),
  ('Cakes',    'Mango Bravo Cake',        'Layered mango, cashew crunch, whipped cream.',                            1050,  4),
  ('Cupcakes', 'Vanilla Bean Cupcakes',   'Box of 6, vanilla bean buttercream.',                                      360,  1),
  ('Cupcakes', 'Chocolate Fudge Cupcakes','Box of 6, fudge frosting.',                                                380,  2),
  ('Pastries', 'Ube Cheese Pandesal',     'Pack of 10, fresh-baked.',                                                 180,  1),
  ('Pastries', 'Cheese Rolls',            'Pack of 6, soft and buttery.',                                             150,  2),
  ('Pastries', 'Butter Croissants',       'Pack of 4, laminated fresh.',                                              280,  3),
  ('Cookies',  'Chocolate Chip Cookies',  'Box of 8, thick and chewy.',                                               220,  1),
  ('Cookies',  'Butter Sablé Cookies',    'Box of 10.',                                                               250,  2);

update public.site_settings set
  business_name      = 'Sweet Crumbs',
  tagline            = 'Home-baked cakes and pastries, made with love in the Philippines.',
  lead_time_text     = 'Custom cakes need at least 5 days notice. Pastries and cupcakes need 2–3 days.',
  delivery_text      = 'Pickup from our home kitchen. Delivery available within the area — message us for your exact location.',
  payment_text       = 'GCash, Maya, or cash on pickup. A 50% down payment is required for custom cakes.',
  storage_text       = 'Cakes are best consumed within 3 days. Keep refrigerated and bring to room temperature 30 mins before serving.',
  about_text         = 'Hi! I''m a home baker who started selling to friends and family and never stopped. Every cake is made from scratch in my home kitchen using real ingredients — no mixes, no shortcuts.'
where id = 1;

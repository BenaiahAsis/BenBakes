# Sweet Crumbs — Bakery Website

A multi-page web app for a home-based cakes and pastries business in the Philippines.
Built with **Next.js 14 (App Router)**, **Supabase** (database, auth, storage), and deployed on **Vercel**.

---

## Project structure

```
src/
├── app/                  # Pages (Next.js App Router)
│   ├── page.tsx          # Home
│   ├── menu/             # Full menu with category filter
│   ├── custom-order/     # Custom cake request form
│   ├── gallery/          # Photo gallery grouped by category
│   ├── about/            # About / bio
│   ├── info/             # Lead time, delivery, payment, storage info
│   ├── admin/            # Admin panel (login-protected)
│   └── api/custom-order/ # API route — saves order to DB
├── components/           # Reusable UI components
└── lib/                  # Supabase clients, types, Messenger helper
```

---

## Running locally

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/)
- A [Supabase](https://supabase.com) project (free tier is fine)

### 2. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/bakery-app.git
cd bakery-app
npm install
```

### 3. Set up environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_MESSENGER_USERNAME=your-facebook-page-username
```

Get these from: **Supabase dashboard → Project Settings → API**.

### 4. Set up the database

In your Supabase project, go to **SQL Editor** and run the schema SQL from `database/schema.sql`.
Then run the seed SQL from `database/seed.sql` to populate starter menu items.

### 5. Create storage buckets

In Supabase → **Storage**, create two **public** buckets:
- `menu-photos`
- `gallery-photos`

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Creating the first admin login

> **This must be done once, manually. There is no public sign-up.**

1. In Supabase → **Authentication → Users**, click **Add user → Create new user**.
2. Enter your email and a strong password.
3. Click **Create user**.
4. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in.

Also disable public sign-ups: **Authentication → Providers → Email → disable "Enable email confirmations"** and **Authentication → Settings → disable "Enable sign ups"**.

---

## Deploying updates to Vercel

Once the project is on Vercel (connected to GitHub):

```bash
git add -A
git commit -m "describe your change"
git push
```

Vercel auto-deploys on every push to `main`. You'll get a preview URL for each push, and production updates automatically.

### Environment variables in Vercel

Go to **Vercel → Your project → Settings → Environment Variables** and add all four variables from `.env.local`. Set them for **Production**, **Preview**, and **Development**.

---

## Connecting a custom domain (when you're ready)

1. In Vercel → **Your project → Settings → Domains**, click **Add**.
2. Type your domain (e.g. `sweetcrumbs.com.ph`) and follow the instructions.
3. Vercel will give you DNS records (typically an A record + CNAME) to add at your registrar.
4. DNS propagation takes up to 48 hours, usually much less.

---

## Environment variables — full list

| Variable | Where to get it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Yes (safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public | Yes (safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role | **No — server only** |
| `NEXT_PUBLIC_MESSENGER_USERNAME` | Your Facebook page URL slug | Yes (safe) |

> ⚠️ Never commit `.env.local` to git. It is already in `.gitignore`.

---

## What's not in scope (future ideas)

- **Online payments** — PayMongo or HitPay are the right choices for GCash/Maya support in the Philippines. Stripe does not support Philippine local payment methods.
- Customer accounts / order history
- Multi-admin roles
- SMS/email notifications for new orders (doable with Supabase Edge Functions + Resend)

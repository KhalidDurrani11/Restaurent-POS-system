# Khan Medical POS

A simple, responsive Medical POS (Point of Sale) for pharmacies and medical shops. Built for ease of use—suitable for staff who are new to computers.

## What you need

- **Node.js** (latest LTS recommended)
- A **Supabase** project (free tier is enough)

---

## 1. Create a Supabase project

1. Sign in at [supabase.com](https://supabase.com) and create a new project.
2. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key (do **not** use the service_role key in the app)

---

## 2. Add keys to `.env`

In the project root, create or edit `.env`:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Optional (for AI Assistant)
GEMINI_API_KEY=your-gemini-key
```

Restart the dev server after changing `.env`.

---

## 3. Create tables and seed data in Supabase

1. In Supabase, open **SQL Editor**.
2. Open the file **`database/quick-setup.sql`** from this repo, copy all of it, and run it in the SQL Editor.

This creates the tables (`users`, `categories`, `products`, `transactions`, `transaction_items`) and seeds medical categories and items.

---

## 4. Create login users in Supabase Auth

1. In Supabase go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Create these two users (tick **Auto Confirm User** for each):

| Role   | Email             | Password |
|--------|-------------------|----------|
| Admin  | admin@gmail.com   | admin    |
| Cashier| cashier@gmail.com | cashier  |

On **first login** in the app, a row is created in `public.users` with the correct role (Admin or Cashier). No extra SQL is required.

---

## 5. Deploy on Netlify (login will work live)

For the app to work on your live Netlify URL (e.g. `https://your-app.netlify.app`):

### A. Set environment variables in Netlify

1. In Netlify: **Site configuration** (or **Site settings**) → **Environment variables**.
2. Add:
   - **Key:** `VITE_SUPABASE_URL` → **Value:** your Supabase Project URL  
   - **Key:** `VITE_SUPABASE_ANON_KEY` → **Value:** your Supabase anon public key  
3. **Save** and **Trigger deploy** (or push a new commit) so the new build uses these values.

Without these, the app loads but login will fail (you’ll see a message asking you to set them).

### B. Allow your site in Supabase

1. In Supabase: **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add your Netlify URL, e.g. `https://your-app.netlify.app`.
3. Optionally set **Site URL** to the same Netlify URL.

If this is missing, login may fail with a redirect or network error on the live site.

---

## 6. Run the app locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal. Log in with:

- **Admin:** admin@gmail.com / admin  
- **Cashier:** cashier@gmail.com / cashier  

---

## If you already have a database (e.g. old project)

- If you **already ran** an older `quick-setup.sql` with different emails (e.g. admin@khanpos.com), you can either:
  1. Create **new** Auth users (admin@gmail.com and cashier@gmail.com) and use them; the app will create their `users` rows on first login, or  
  2. Run this in SQL Editor to fix roles for existing emails:
     ```sql
     UPDATE public.users SET role = 'ADMIN' WHERE email = 'admin@gmail.com';
     UPDATE public.users SET role = 'CASHIER' WHERE email = 'cashier@gmail.com';
     ```
- To **add more products**, use the app’s **Inventory** (Admin) or insert rows in the `products` table in Supabase.

---

## Features

- **POS:** Sell items by category, search, add to cart, choose payment (Cash/Card/Digital), checkout and print receipt.
- **Dashboard:** Total revenue, today’s sales, transaction count, low stock alert; charts for last 7 days and top selling items.
- **Inventory:** Add, edit, delete products and categories (Admin).
- **Reports:** View all sales transactions.
- **AI Assistant:** Ask questions about sales and stock (optional, needs Gemini API key).
- **Responsive:** Works on desktop, tablet, and phone; large buttons and clear layout for beginners.

---

## Troubleshooting

- **Login works locally but not on Netlify**  
  Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Netlify Environment variables, redeploy, and add your Netlify URL to Supabase → Authentication → URL Configuration → Redirect URLs.

- **Receipt modal not showing after Checkout**  
  Ensure you have items in the cart and click **Checkout** once. The receipt opens in a full-screen overlay; if it still doesn’t appear, check the browser console for errors.

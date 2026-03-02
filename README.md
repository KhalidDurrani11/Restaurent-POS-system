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

## 5. Run the app

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

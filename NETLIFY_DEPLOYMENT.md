# CHHAVA Luxury Apparel — Netlify Deployment Guide

This project is fully configured for seamless, zero-config deployment on **Netlify**.

---

## 🚀 Quick Deployment Methods

### Option 1: Automatic Git Deployment (Recommended)
1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log in to [Netlify](https://app.netlify.com).
3. Click **"Add new site"** → **"Import an existing project"**.
4. Select your repository.
5. Netlify will automatically detect the settings from `netlify.toml`:
   * **Base directory**: *(leave blank / root)*
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
6. Click **"Deploy site"**.

---

### Option 2: Netlify Drop (Instant Drag & Drop)
1. Run `npm run build` on your machine.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder directly into the browser window.
4. Your site will be live in seconds!

---

## ⚙️ Configuration Files Added
* **`netlify.toml`**: Configures the build command (`npm run build`), publish directory (`dist`), Node.js version, and SPA redirect rule (`/* -> /index.html 200`) so that page refreshes on subroutes never return a 404 error.
* **`public/_redirects`**: Backup Netlify rewrite rule copied directly into `dist/` during Vite build.

---

## 🗄️ Supabase Database Configuration
Your Supabase credentials are pre-configured:
* **Project ID**: `xmyhiwpoxkficfrqdoxz`
* **URL**: `https://xmyhiwpoxkficfrqdoxz.supabase.co`
* **Anon Key**: `sb_publishable_4gCEzLLm_5bCZRlpPVBkJA_zCg5GSSO`

*(Optional)* You can also add these in **Site Configuration → Environment Variables** in Netlify:
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`

---

## 🛡️ Admin Atelier Access on Netlify
* **URL**: Access the Storefront and click the Shield icon in the top header or go to Admin.
* **Admin Email**: `admin@chhava.in`
* **Admin Password**: `ChhavaAdmin2026!`

# CHHAVA — Luxury Indian Fashion | Wear Your Identity

A production-grade clothing e-commerce platform built for the Indian luxury fashion market. Inspired by timeless Maratha heritage, valor, and contemporary menswear architecture.

---

## 1. Brand Identity
- **Brand Name**: CHHAVA
- **Tagline**: “WEAR YOUR IDENTITY.”
- **Palette**: Royal Black (`#0b0b0d`), Antique Gilded Gold (`#d4af37`), Champagne Ecru (`#f7df94`), and Charcoal Grey (`#1f1f28`).
- **Typography**: Cinzel (Heritage Wordmark), Playfair Display (Editorial Accents), Plus Jakarta Sans (Clean Modern Body).

---

## 2. Key Architecture & Features

### Customer Journey
1. **Homepage Experience**:
   - Announcement ticker with instant promo highlight.
   - Cinematic hero banner with high-resolution fashion photography & CTA buttons (*Shop Now* and *Explore Collection*).
   - Shop by category with large immersive image cards.
   - Best sellers & trending silhouettes carousel.
   - New arrivals runway drop.
   - Limited edition promotional banner (Festive Sovereign Heritage Drop).
   - Brand heritage story narrative.
   - Verified Indian patron testimonials & ratings.
   - Interactive Instagram lookbook gallery.
   - Newsletter bulletin unlocking instant 10% coupon (`CHHAVA10`).
2. **Product Catalog & Details (PLP & PDP)**:
   - Dynamic category filtering: T-shirts, Shirts, Jeans & Trousers, Hoodies, Jackets, Traditional Wear, Best Sellers, Sale.
   - Multi-facet filters: Price range slider, sizes (XS, S, M, L, XL, XXL), color swatches, availability, discount threshold.
   - Sorting: Newest, Popularity, Price Low-to-High, Price High-to-Low, Top Rated.
   - PDP with multi-angle photo gallery & interactive zoom modal.
   - Interactive Size Guide modal with imperial (inches) and metric (cm) unit toggling.
   - Live Indian PIN code delivery checker (estimates transit time across 27,000+ PIN codes).
   - Customer ratings & review submission form with live updates.
3. **Cart & Checkout**:
   - Slide-over bag drawer with free express shipping progress meter (Threshold: ₹1,499).
   - Working discount coupon engine (`CHHAVA10`, `FIRST500`, `ROYALFEST`).
   - Indian checkout address form: Full Name, Phone (+91), Email, Street Address, Landmark, City, State (28 Indian states + UTs), 6-digit PIN code.
   - Cash on Delivery (COD) and Razorpay verified gateway simulator.
   - Unique order identifier generation (e.g. `CHV-261026-8812`).
   - Order confirmation manifest with print receipt action.
4. **Order Tracking**:
   - Enter order identifier or track directly from checkout.
   - Interactive 5-stage logistics timeline: *Order Placed* → *Atelier Inspection* → *Dispatched in Transit* → *Out for Delivery* → *Delivered*.
   - Activity log with timestamps and logistics hub updates.
5. **Secure Owner Admin Console**:
   - Dedicated dashboard accessible via `/admin` or footer link.
   - Secured with session-token authentication.
   - Real-time revenue, orders count, low-stock warnings (&lt; 5 units), and active product analytics.
   - Garment Catalog manager: Add new product, edit price, edit stock per size (S–XXL), upload images, delete product.
   - Orders manager: Search customer orders, filter, update fulfillment status with custom tracking log messages.
   - Categories manager: Add, edit, or remove store categories.
   - Coupon manager: Create percentage or fixed discount promo codes.
   - Storefront configuration: Customize announcement banner, hero text, and shipping threshold live.

---

## 3. Administrator Credentials
- **Console URL**: Navigate to Admin tab in the header or footer link.
- **Authorized Email**: `admin@chhava.in`
- **Initial Password**: `ChhavaAdmin2026!`

To change admin credentials, update the server environment variables in `.env` (`ADMIN_EMAIL` and `ADMIN_INITIAL_SECRET`).

---

## 4. Payment Gateway Configuration (Razorpay)

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Generate API Keys in **Settings → API Keys**.
3. Copy `Key Id` and `Key Secret` into your `.env` file:
   ```env
   RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxxx"
   RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxx"
   RAZORPAY_WEBHOOK_SECRET="xxxxxxxxxxxxxxxx"
   ```
4. In production mode, the server verifies webhook signatures on `/api/orders/verify-payment` before marking orders as `Paid`.

---

## 5. PostgreSQL Database Schema

```sql
-- Categories Table
CREATE TABLE categories (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT true
);

-- Products Table
CREATE TABLE products (
  id VARCHAR(64) PRIMARY KEY,
  sku VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  fabric TEXT,
  fit TEXT,
  care TEXT,
  category_slug VARCHAR(64) REFERENCES categories(slug),
  price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2),
  images JSONB NOT NULL DEFAULT '[]',
  colors JSONB NOT NULL DEFAULT '[]',
  sizes JSONB NOT NULL DEFAULT '[]', -- [{size: 'M', stock: 15}]
  is_new_arrival BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE NOT NULL,
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_email VARCHAR(128) NOT NULL,
  address_line TEXT NOT NULL,
  city VARCHAR(64) NOT NULL,
  state VARCHAR(64) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  coupon_code VARCHAR(32),
  shipping NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  payment_status VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'Placed',
  tracking_number VARCHAR(64),
  tracking_events JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6. Installation & Execution
```bash
# Install dependencies
npm install

# Run unit tests
npx tsx --test src/utils/pricing.test.ts

# Start development full-stack server
npm run dev

# Build for production
npm run build
```

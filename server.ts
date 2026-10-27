import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COUPONS, INITIAL_SETTINGS } from './src/data/initialData.ts';
import { Product, Category, Coupon, Order, SiteSettings } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory persistent database with initial data
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: Category[] = [...INITIAL_CATEGORIES];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let orders: Order[] = [
  {
    id: 'ord-demo-1',
    orderNumber: 'CHV-261026-8812',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      fullName: 'Vikramaditya Shinde',
      email: 'vikram.shinde@example.com',
      phone: '+91 98201 44521',
      addressLine: 'Flat 402, Royal Residency, Senapati Bapat Marg, Dadar West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400028',
    },
    items: [
      {
        id: 'chv-01-M-Onyx Black & Gold',
        productId: 'chv-01',
        name: 'Sovereign Royal Black Kurta',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
        price: 3899,
        originalPrice: 4999,
        selectedSize: 'M',
        selectedColor: 'Onyx Black & Gold',
        quantity: 1,
        maxStock: 18,
      }
    ],
    subtotal: 3899,
    discount: 389,
    couponCode: 'CHHAVA10',
    shipping: 0,
    tax: 175,
    total: 3510,
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'Paid',
    status: 'Shipped',
    trackingNumber: 'DELHIVERY-CHV-99214',
    trackingEvents: [
      {
        status: 'Placed',
        location: 'Mumbai Order Hub',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        description: 'Order confirmed and verified via Razorpay.',
      },
      {
        status: 'Processing',
        location: 'CHHAVA Atelier, Mumbai',
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        description: 'Quality inspection passed, packed in luxury gold presentation box.',
      },
      {
        status: 'Shipped',
        location: 'Bhiwandi National Logistics Hub',
        timestamp: new Date(Date.now() - 86400000 * 0.8).toISOString(),
        description: 'In transit via Express Air. Expected delivery in 24 hours.',
      }
    ]
  }
];
let settings: SiteSettings = { ...INITIAL_SETTINGS };

// Admin authorization secret and token validation
const ADMIN_EMAIL = 'admin@chhava.in';
const ADMIN_PASSWORD = 'ChhavaAdmin2026!';
const ADMIN_SESSION_TOKEN = 'chv_adm_session_live_829aef10';

function authenticateAdmin(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.replace('Bearer ', '').trim() === ADMIN_SESSION_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
}

// ================= API ROUTES =================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', brand: 'CHHAVA', timestamp: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (_req, res) => {
  res.json(settings);
});

app.post('/api/settings', authenticateAdmin, (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Products
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let result = [...products];

  if (category && category !== 'all') {
    if (category === 'new-arrivals') {
      result = result.filter(p => p.isNewArrival);
    } else if (category === 'best-sellers') {
      result = result.filter(p => p.isBestSeller);
    } else if (category === 'sale') {
      result = result.filter(p => p.isSale || (p.discountPrice && p.discountPrice < p.price));
    } else {
      result = result.filter(p => p.category === category);
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === 'price-high') {
    result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popularity') {
    result.sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    // default newest
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticateAdmin, (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `chv-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 0,
    reviews: req.body.reviews || [],
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateAdmin, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/api/products/:id', authenticateAdmin, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

// Categories
app.get('/api/categories', (_req, res) => {
  res.json(categories);
});

app.post('/api/categories', authenticateAdmin, (req, res) => {
  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
    ...req.body,
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', authenticateAdmin, (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  categories[index] = { ...categories[index], ...req.body };
  res.json(categories[index]);
});

app.delete('/api/categories/:id', authenticateAdmin, (req, res) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  categories.splice(index, 1);
  res.json({ message: 'Category removed' });
});

// Coupons
app.get('/api/coupons', (_req, res) => {
  res.json(coupons);
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, cartSubtotal } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Coupon code required.' });
  }
  const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!found) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code.' });
  }
  if (cartSubtotal < found.minOrderValue) {
    return res.status(400).json({
      valid: false,
      message: `Minimum order value of ₹${found.minOrderValue} required for coupon ${found.code}.`,
    });
  }
  res.json({ valid: true, coupon: found });
});

app.post('/api/coupons', authenticateAdmin, (req, res) => {
  const newCoupon: Coupon = {
    ...req.body,
    code: req.body.code.trim().toUpperCase(),
    isActive: true,
  };
  coupons.push(newCoupon);
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:code', authenticateAdmin, (req, res) => {
  coupons = coupons.filter(c => c.code !== req.params.code);
  res.json({ message: 'Coupon deleted' });
});

// Orders
app.get('/api/orders', authenticateAdmin, (_req, res) => {
  res.json(orders);
});

app.get('/api/orders/track/:orderNumber', (req, res) => {
  const order = orders.find(
    o => o.orderNumber.toUpperCase() === req.params.orderNumber.trim().toUpperCase()
  );
  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please check your order ID.' });
  }
  res.json({
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    status: order.status,
    trackingNumber: order.trackingNumber,
    customerName: order.customer.fullName,
    city: order.customer.city,
    itemsCount: order.items.length,
    items: order.items,
    total: order.total,
    trackingEvents: order.trackingEvents,
  });
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  if (!orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ error: 'Cannot create an empty order.' });
  }
  if (!orderData.customer || !orderData.customer.fullName || !orderData.customer.phone) {
    return res.status(400).json({ error: 'Complete delivery details are required.' });
  }

  // Deduct inventory from products
  for (const item of orderData.items) {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      const sizeEntry = p.sizes.find(s => s.size === item.selectedSize);
      if (sizeEntry) {
        sizeEntry.stock = Math.max(0, sizeEntry.stock - item.quantity);
      }
    }
  }

  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    trackingNumber: `CHV-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    trackingEvents: [
      {
        status: 'Placed',
        location: 'CHHAVA Central Fulfillment Hub',
        timestamp: new Date().toISOString(),
        description: `Order received with ${orderData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Verified Online Payment'}.`,
      }
    ]
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', authenticateAdmin, (req, res) => {
  const { status, note, location } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  if (status === 'Delivered') {
    order.paymentStatus = 'Paid';
  }

  order.trackingEvents.push({
    status,
    location: location || 'Transit Hub',
    timestamp: new Date().toISOString(),
    description: note || `Status updated to ${status}.`,
  });

  res.json(order);
});

// Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: ADMIN_SESSION_TOKEN,
      user: {
        email: ADMIN_EMAIL,
        name: 'CHHAVA Brand Director',
        role: 'SUPER_ADMIN',
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

app.post('/api/admin/verify', (req, res) => {
  const { token } = req.body;
  if (token === ADMIN_SESSION_TOKEN) {
    res.json({ valid: true, user: { email: ADMIN_EMAIL, name: 'CHHAVA Brand Director' } });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Product Reviews
app.post('/api/products/:id/reviews', (req, res) => {
  const { author, location, rating, comment } = req.body;
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    author: author || 'Valued Patron',
    location: location || 'India',
    rating: Number(rating) || 5,
    date: new Date().toISOString().slice(0, 10),
    comment: comment || '',
    verified: true,
  };

  if (!product.reviews) product.reviews = [];
  product.reviews.unshift(newReview);
  product.reviewCount = product.reviews.length;
  product.rating = Number(
    (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
  );

  res.status(201).json({ message: 'Review recorded', product });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CHHAVA Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

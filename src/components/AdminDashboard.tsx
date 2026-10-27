import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Category, Coupon, Order, OrderStatus, ProductSize } from '../types';
import { formatINR } from '../utils/pricing';
import {
  Shield,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Percent,
  Sliders,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Truck,
  Eye,
  X,
  Lock,
  Database,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    products,
    categories,
    coupons,
    orders,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    addCoupon,
    deleteCoupon,
    updateSiteSettings,
    setActiveView,
    supabaseStatus,
    refreshOrders,
  } = useShop();

  // Login Form State
  const [email, setEmail] = useState('admin@chhava.in');
  const [password, setPassword] = useState('ChhavaAdmin2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'settings'>('overview');

  // Product Modal / Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    sku: '',
    category: 't-shirts',
    price: 1999,
    discountPrice: 1499,
    tagline: '',
    description: '',
    fabric: '100% Combed Supima Cotton (280 GSM)',
    fit: 'Relaxed Drop Shoulder',
    care: 'Machine wash cold inside out',
    images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    colorName: 'Pitch Black',
    colorHex: '#0a0a0c',
    stockS: 15,
    stockM: 20,
    stockL: 20,
    stockXL: 10,
    stockXXL: 5,
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState(
    'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000&auto=format&fit=crop'
  );

  // Coupon Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(1999);
  const [newCouponDesc, setNewCouponDesc] = useState('15% privilege discount');

  // Order status update state
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [statusNote, setStatusNote] = useState('');

  // Settings State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Supabase Live Sync State
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const SUPABASE_SCHEMA_SQL = `-- CHHAVA DATABASE SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xmyhiwpoxkficfrqdoxz/sql

-- 1. Create orders table for customer orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  address_line TEXT,
  landmark TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  items JSONB,
  subtotal NUMERIC,
  discount NUMERIC,
  coupon_code TEXT,
  shipping NUMERIC,
  tax NUMERIC,
  total NUMERIC,
  payment_method TEXT,
  payment_status TEXT,
  status TEXT,
  tracking_number TEXT,
  tracking_events JSONB
);

-- 2. Create products table for catalogue backup
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  fabric TEXT,
  fit TEXT,
  care TEXT,
  category_slug TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  images JSONB,
  colors JSONB,
  sizes JSONB,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Enable public read and write policies for web application
DROP POLICY IF EXISTS "Allow public all access on orders" ON public.orders;
CREATE POLICY "Allow public all access on orders" ON public.orders FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all access on products" ON public.products;
CREATE POLICY "Allow public all access on products" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);`;

  const handleSyncSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      await refreshOrders();
    } catch (e) {
      console.warn('Sync error:', e);
    } finally {
      setTimeout(() => setIsSyncingSupabase(false), 600);
    }
  };

  const copySupabaseSql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Product Search State
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Calculations for Overview Dashboard
  const metrics = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : o.total), 0);
    const lowStockCount = products.filter(p => p.sizes.some(s => s.stock < 5)).length;
    const pendingOrdersCount = orders.filter(o => o.status === 'Placed' || o.status === 'Processing').length;

    return {
      totalRevenue: totalRev,
      totalOrders: orders.length,
      pendingOrders: pendingOrdersCount,
      totalProducts: products.length,
      lowStockAlerts: lowStockCount,
    };
  }, [orders, products]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const res = await adminLogin(email, password);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  // Open Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    const stockMap: Record<string, number> = {};
    prod.sizes.forEach(s => {
      stockMap[s.size] = s.stock;
    });

    setProductFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      price: prod.price,
      discountPrice: prod.discountPrice || prod.price,
      tagline: prod.tagline || '',
      description: prod.description,
      fabric: prod.fabric,
      fit: prod.fit,
      care: prod.care,
      images: prod.images.join(', '),
      colorName: prod.colors[0]?.name || 'Standard',
      colorHex: prod.colors[0]?.hex || '#000000',
      stockS: stockMap['S'] || 0,
      stockM: stockMap['M'] || 0,
      stockL: stockMap['L'] || 0,
      stockXL: stockMap['XL'] || 0,
      stockXXL: stockMap['XXL'] || 0,
      isNewArrival: !!prod.isNewArrival,
      isBestSeller: !!prod.isBestSeller,
      isFeatured: !!prod.isFeatured,
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imgs = productFormData.images.split(',').map(s => s.trim()).filter(Boolean);

    const sizesArray = [
      { size: 'S' as ProductSize, stock: Number(productFormData.stockS) },
      { size: 'M' as ProductSize, stock: Number(productFormData.stockM) },
      { size: 'L' as ProductSize, stock: Number(productFormData.stockL) },
      { size: 'XL' as ProductSize, stock: Number(productFormData.stockXL) },
      { size: 'XXL' as ProductSize, stock: Number(productFormData.stockXXL) },
    ];

    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: productFormData.name,
        sku: productFormData.sku,
        category: productFormData.category,
        price: Number(productFormData.price),
        discountPrice: productFormData.discountPrice ? Number(productFormData.discountPrice) : undefined,
        tagline: productFormData.tagline,
        description: productFormData.description,
        fabric: productFormData.fabric,
        fit: productFormData.fit,
        care: productFormData.care,
        images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'],
        colors: [{ name: productFormData.colorName, hex: productFormData.colorHex }],
        sizes: sizesArray,
        isNewArrival: productFormData.isNewArrival,
        isBestSeller: productFormData.isBestSeller,
        isFeatured: productFormData.isFeatured,
      });
    } else {
      await addProduct({
        name: productFormData.name,
        sku: productFormData.sku || `CHV-${Date.now().toString().slice(-4)}`,
        category: productFormData.category,
        price: Number(productFormData.price),
        discountPrice: productFormData.discountPrice ? Number(productFormData.discountPrice) : undefined,
        tagline: productFormData.tagline,
        description: productFormData.description,
        fabric: productFormData.fabric,
        fit: productFormData.fit,
        care: productFormData.care,
        images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'],
        colors: [{ name: productFormData.colorName, hex: productFormData.colorHex }],
        sizes: sizesArray,
        isNewArrival: productFormData.isNewArrival,
        isBestSeller: productFormData.isBestSeller,
        isFeatured: productFormData.isFeatured,
      });
    }

    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  // Add Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory({
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      image: newCatImage.trim(),
      featured: true,
    });
    setIsCategoryModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
  };

  // Add Coupon
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    await addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderValue: Number(newCouponMin),
      description: newCouponDesc.trim(),
      isActive: true,
    });
    setIsCouponModalOpen(false);
    setNewCouponCode('');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForStatus) return;
    await updateOrderStatus(selectedOrderForStatus.id, newStatus, statusNote);
    setSelectedOrderForStatus(null);
    setStatusNote('');
  };

  // If Not Logged In, Render Secure Admin Login
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#09090c] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111116] border border-[#232330] p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#1d190e] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-brand text-2xl font-bold tracking-[0.2em] text-gold-gradient">
              CHHAVA ATELIER
            </h1>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1">
              Protected Brand Owner Console
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-700/80 text-red-200 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#171720] border border-[#2b2b3a] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                Secure Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#171720] border border-[#2b2b3a] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="p-3 bg-[#181822] border border-[#262634] text-[11px] text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-300">Default Authorized Credentials:</p>
              <p>Email: <strong className="text-[#d4af37]">admin@chhava.in</strong></p>
              <p>Password: <strong className="text-[#d4af37]">ChhavaAdmin2026!</strong></p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-gold-metallic text-black font-semibold text-xs uppercase tracking-[0.2em] hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-[#d4af37]/20"
            >
              {isLoggingIn ? 'AUTHENTICATING...' : 'ACCESS OWNER DASHBOARD'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setActiveView('home')}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products for Admin Table
  const adminFilteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // Filtered Orders for Admin Table
  const adminFilteredOrders = orders.filter(o => {
    if (!orderSearch) return true;
    const q = orderSearch.toLowerCase();
    return o.orderNumber.toLowerCase().includes(q) || o.customer.fullName.toLowerCase().includes(q) || o.customer.city.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#09090c] text-[#f4f4f5]">
      {/* Top Admin Bar */}
      <header className="border-b border-[#1f1f28] bg-[#0f0f14] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2a2210] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-brand text-sm sm:text-base font-bold tracking-wider text-white">
              CHHAVA EXECUTIVE ATELIER CONSOLE
            </h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
              Server-Verified Session · Super Admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Supabase Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#141822] border border-[#233045] rounded-xs text-[11px]">
            <span className={`w-2 h-2 rounded-full ${supabaseStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-300 font-mono text-[10px]">
              Supabase: {supabaseStatus.projectId}
            </span>
            <button
              onClick={handleSyncSupabase}
              disabled={isSyncingSupabase}
              title="Sync Orders with Supabase"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer ml-1 p-0.5"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingSupabase ? 'animate-spin text-[#d4af37]' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setActiveView('home')}
            className="py-1.5 px-3 bg-[#181822] hover:bg-[#222230] text-xs text-zinc-300 border border-zinc-700 transition-colors rounded-xs"
          >
            Storefront
          </button>
          <button
            onClick={adminLogout}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-xs text-red-200 transition-colors rounded-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#1f1f28]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
              activeTab === 'overview'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#14141a] text-zinc-400 hover:text-white hover:bg-[#1c1c24]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
              activeTab === 'products'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#14141a] text-zinc-400 hover:text-white hover:bg-[#1c1c24]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Garment Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
              activeTab === 'orders'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#14141a] text-zinc-400 hover:text-white hover:bg-[#1c1c24]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Patron Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
              activeTab === 'categories'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#14141a] text-zinc-400 hover:text-white hover:bg-[#1c1c24]'
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
              activeTab === 'coupons'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#14141a] text-zinc-400 hover:text-white hover:bg-[#1c1c24]'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
              activeTab === 'settings'
                ? 'bg-[#d4af37] text-black'
                : 'bg-[#14141a] text-zinc-400 hover:text-white hover:bg-[#1c1c24]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Storefront Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121217] border border-[#20202c] p-5">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span className="uppercase tracking-wider">Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-[#d4af37]" />
                </div>
                <h3 className="font-brand text-2xl font-bold text-white">
                  {formatINR(metrics.totalRevenue)}
                </h3>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Real-time revenue counter</span>
                </p>
              </div>

              <div className="bg-[#121217] border border-[#20202c] p-5">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span className="uppercase tracking-wider">Orders Booked</span>
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                </div>
                <h3 className="font-brand text-2xl font-bold text-white">
                  {metrics.totalOrders}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {metrics.pendingOrders} awaiting fulfillment
                </p>
              </div>

              <div className="bg-[#121217] border border-[#20202c] p-5">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span className="uppercase tracking-wider">Active Products</span>
                  <Package className="w-4 h-4 text-[#d4af37]" />
                </div>
                <h3 className="font-brand text-2xl font-bold text-white">
                  {metrics.totalProducts}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1">Across {categories.length} categories</p>
              </div>

              <div className="bg-[#121217] border border-[#20202c] p-5">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span className="uppercase tracking-wider">Low Stock Warnings</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-brand text-2xl font-bold text-amber-400">
                  {metrics.lowStockAlerts}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1">Sizes with stock &lt; 5 units</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#121217] border border-[#20202c] p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-4">
                <h3 className="font-brand text-base font-bold text-white tracking-wider">
                  RECENT PATRON ORDERS
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] uppercase tracking-wider text-zinc-500 bg-[#16161f]">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Patron</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e28] text-zinc-300">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-[#181822]">
                        <td className="p-3 font-mono font-medium text-white">{o.orderNumber}</td>
                        <td className="p-3">{o.customer.fullName}</td>
                        <td className="p-3">{o.customer.city}</td>
                        <td className="p-3 font-semibold text-white">{formatINR(o.total)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              o.paymentStatus === 'Paid'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {o.paymentMethod} ({o.paymentStatus})
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-[#262010] text-[#f7df94] border border-[#d4af37]/40">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter garments by name or SKU..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full bg-[#14141a] border border-[#262634] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductFormData({
                    name: '',
                    sku: `CHV-NEW-${Math.floor(100 + Math.random() * 900)}`,
                    category: 't-shirts',
                    price: 2499,
                    discountPrice: 1999,
                    tagline: 'Crafted from luxury Indian Supima cotton',
                    description: 'Modern luxury apparel tailored with premium fabrics and artisanal finish.',
                    fabric: '100% Cotton (280 GSM)',
                    fit: 'Relaxed Fit',
                    care: 'Dry clean recommended',
                    images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
                    colorName: 'Pitch Black',
                    colorHex: '#0a0a0c',
                    stockS: 10,
                    stockM: 15,
                    stockL: 15,
                    stockXL: 8,
                    stockXXL: 5,
                    isNewArrival: true,
                    isBestSeller: false,
                    isFeatured: true,
                  });
                  setIsProductModalOpen(true);
                }}
                className="py-2.5 px-4 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Creation</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#121217] border border-[#20202c] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase tracking-wider text-zinc-500 bg-[#16161f]">
                  <tr>
                    <th className="p-3">Garment</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price / MRP</th>
                    <th className="p-3">Stock by Size</th>
                    <th className="p-3">Badges</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e28] text-zinc-300">
                  {adminFilteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-[#181822]">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-12 object-cover bg-black shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white">{prod.name}</p>
                          <p className="font-mono text-[10px] text-[#d4af37]">{prod.sku}</p>
                        </div>
                      </td>
                      <td className="p-3 capitalize">{prod.category.replace(/-/g, ' ')}</td>
                      <td className="p-3">
                        <span className="font-bold text-white">
                          {formatINR(prod.discountPrice || prod.price)}
                        </span>
                        {prod.discountPrice && (
                          <span className="text-[10px] text-zinc-500 line-through ml-1.5">
                            {formatINR(prod.price)}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1.5 text-[10px]">
                          {prod.sizes.map(s => (
                            <span
                              key={s.size}
                              className={`px-1.5 py-0.5 border ${
                                s.stock <= 3
                                  ? 'border-amber-600 bg-amber-950/40 text-amber-300'
                                  : 'border-zinc-800 bg-[#1a1a24] text-zinc-300'
                              }`}
                            >
                              {s.size}:{s.stock}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {prod.isNewArrival && (
                            <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 text-[9px] uppercase font-bold">
                              New
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 text-[9px] uppercase font-bold">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-zinc-400 hover:text-[#d4af37] hover:bg-[#20202c] transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-[#20202c] transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Supabase Realtime Database Sync Banner */}
            <div className="bg-[#101522] border border-[#1f2b44] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#162238] border border-[#273d66] flex items-center justify-center text-emerald-400 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs sm:text-sm">
                      Supabase Cloud Database
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-[#1b263b] text-emerald-400 border border-emerald-500/30 rounded-xs">
                      Project: {supabaseStatus.projectId}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {supabaseStatus.message || 'Orders placed by patrons are securely mirrored in your Supabase backend.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSyncSupabase}
                  disabled={isSyncingSupabase}
                  className="flex items-center gap-1.5 py-2 px-3.5 bg-[#1c2942] hover:bg-[#253759] border border-[#344b75] text-xs text-white font-medium transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#d4af37] ${isSyncingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSupabase ? 'Syncing...' : 'Sync Supabase Orders'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSqlModalOpen(true)}
                  className="py-2 px-3.5 bg-[#181820] hover:bg-[#20202d] border border-zinc-700 text-xs text-zinc-300 font-medium transition-colors cursor-pointer"
                >
                  SQL Setup Guide
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer or city..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full bg-[#14141a] border border-[#262634] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="text-xs text-zinc-400">
                Total Orders Recorded: <strong className="text-white">{orders.length}</strong>
              </div>
            </div>

            <div className="bg-[#121217] border border-[#20202c] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase tracking-wider text-zinc-500 bg-[#16161f]">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Patron & Destination</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Fulfillment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e28] text-zinc-300">
                  {adminFilteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#181822]">
                      <td className="p-3 font-mono font-medium text-white">{order.orderNumber}</td>
                      <td className="p-3 text-[11px] text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-white">{order.customer.fullName}</p>
                        <p className="text-[11px] text-zinc-400">{order.customer.city}, {order.customer.state}</p>
                        <p className="text-[10px] text-zinc-500">{order.customer.phone}</p>
                      </td>
                      <td className="p-3">
                        {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'}
                      </td>
                      <td className="p-3 font-bold text-white">{formatINR(order.total)}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 text-[10px] uppercase font-bold bg-[#262010] text-[#f7df94] border border-[#d4af37]/40">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderForStatus(order);
                            setNewStatus(order.status);
                          }}
                          className="py-1 px-3 bg-[#1e1e2a] hover:bg-[#282838] border border-zinc-700 text-xs text-zinc-200 transition-colors"
                        >
                          Update Phase
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-brand text-base font-bold text-white">Configured Categories</h3>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="py-2 px-4 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-[#121217] border border-[#20202c] p-4 flex flex-col justify-between">
                  <div className="flex gap-3 mb-3">
                    <img src={cat.image} alt={cat.name} className="w-16 h-20 object-cover bg-black" />
                    <div>
                      <h4 className="font-brand text-base font-bold text-white">{cat.name}</h4>
                      <p className="font-mono text-[10px] text-[#d4af37]">slug: {cat.slug}</p>
                      <p className="text-xs text-zinc-400 font-light line-clamp-2 mt-1">{cat.description}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#1e1e28] flex justify-end gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Remove category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-brand text-base font-bold text-white">Discount & Privilege Coupons</h3>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="py-2 px-4 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map(coup => (
                <div key={coup.code} className="bg-[#121217] border border-[#20202c] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-brand text-lg font-bold text-[#f7df94] tracking-wider">
                        {coup.code}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 border border-emerald-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium mb-1">
                      {coup.discountType === 'percentage' ? `${coup.discountValue}% OFF` : `₹${coup.discountValue} FLAT OFF`}
                    </p>
                    <p className="text-xs text-zinc-400 font-light">{coup.description}</p>
                    <p className="text-[11px] text-zinc-500 mt-2">
                      Min Order Value: {formatINR(coup.minOrderValue)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1e1e28] mt-4 flex justify-end">
                    <button
                      onClick={() => deleteCoupon(coup.code)}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STOREFRONT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-[#121217] border border-[#20202c] p-6 sm:p-8 space-y-6">
            <h3 className="font-brand text-base font-bold text-white tracking-wider pb-3 border-b border-[#20202c]">
              HOMEPAGE & STOREFRONT PROMOTIONS
            </h3>

            {settingsSaved && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs">
                Storefront settings updated successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-zinc-300 font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcementActive}
                    onChange={e =>
                      setSettingsForm(prev => ({ ...prev, announcementActive: e.target.checked }))
                    }
                    className="accent-[#d4af37]"
                  />
                  <span>Announcement Bar Active</span>
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={e =>
                    setSettingsForm(prev => ({ ...prev, announcementText: e.target.value }))
                  }
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={settingsForm.heroHeadline}
                  onChange={e =>
                    setSettingsForm(prev => ({ ...prev, heroHeadline: e.target.value }))
                  }
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Hero Subheadline Prose
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.heroSubheadline}
                  onChange={e =>
                    setSettingsForm(prev => ({ ...prev, heroSubheadline: e.target.value }))
                  }
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Complimentary Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={e =>
                    setSettingsForm(prev => ({
                      ...prev,
                      freeShippingThreshold: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 cursor-pointer"
              >
                Save Storefront Configuration
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#121217] border border-[#252535] max-w-2xl w-full p-6 sm:p-8 my-8 text-white relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#20202c] mb-6">
              <h3 className="font-brand text-lg font-bold text-white">
                {editingProductId ? 'Edit Atelier Creation' : 'Add New Atelier Garment'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.sku}
                    onChange={e => setProductFormData({ ...productFormData, sku: e.target.value })}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                    Regular MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productFormData.price}
                    onChange={e => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                    Discounted Price (₹)
                  </label>
                  <input
                    type="number"
                    value={productFormData.discountPrice}
                    onChange={e => setProductFormData({ ...productFormData, discountPrice: Number(e.target.value) })}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Image URLs (comma separated)
                </label>
                <input
                  type="text"
                  value={productFormData.images}
                  onChange={e => setProductFormData({ ...productFormData, images: e.target.value })}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Sizes Stock Inputs */}
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-2 font-medium">
                  Inventory Units per Size:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Size S</span>
                    <input
                      type="number"
                      value={productFormData.stockS}
                      onChange={e => setProductFormData({ ...productFormData, stockS: Number(e.target.value) })}
                      className="w-full bg-[#181822] border border-[#2b2b3b] py-1.5 px-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Size M</span>
                    <input
                      type="number"
                      value={productFormData.stockM}
                      onChange={e => setProductFormData({ ...productFormData, stockM: Number(e.target.value) })}
                      className="w-full bg-[#181822] border border-[#2b2b3b] py-1.5 px-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Size L</span>
                    <input
                      type="number"
                      value={productFormData.stockL}
                      onChange={e => setProductFormData({ ...productFormData, stockL: Number(e.target.value) })}
                      className="w-full bg-[#181822] border border-[#2b2b3b] py-1.5 px-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Size XL</span>
                    <input
                      type="number"
                      value={productFormData.stockXL}
                      onChange={e => setProductFormData({ ...productFormData, stockXL: Number(e.target.value) })}
                      className="w-full bg-[#181822] border border-[#2b2b3b] py-1.5 px-2 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block mb-0.5">Size XXL</span>
                    <input
                      type="number"
                      value={productFormData.stockXXL}
                      onChange={e => setProductFormData({ ...productFormData, stockXXL: Number(e.target.value) })}
                      className="w-full bg-[#181822] border border-[#2b2b3b] py-1.5 px-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#20202c]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2.5 px-4 border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#d4af37] text-black font-semibold uppercase tracking-wider hover:opacity-90"
                >
                  Save Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#121217] border border-[#252535] max-w-md w-full p-6 text-white relative">
            <h3 className="font-brand text-base font-bold text-white mb-2">
              Update Order Phase: {selectedOrderForStatus.orderNumber}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Patron: {selectedOrderForStatus.customer.fullName} ({selectedOrderForStatus.customer.city})
            </p>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Select New Status Phase
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                >
                  <option value="Placed">Placed</option>
                  <option value="Processing">Processing (Atelier Inspection)</option>
                  <option value="Shipped">Shipped (Dispatched in Transit)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                  Milestone Note / Tracking Log Message
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched from Mumbai logistics hub"
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="py-2 px-4 border border-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#d4af37] text-black font-semibold uppercase tracking-wider"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#121217] border border-[#252535] max-w-md w-full p-6 text-white relative">
            <h3 className="font-brand text-base font-bold text-white mb-4">Add Product Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandhgalas & Vests"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={newCatImage}
                  onChange={e => setNewCatImage(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="py-2 px-4 border border-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#d4af37] text-black font-semibold uppercase tracking-wider"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#121217] border border-[#252535] max-w-md w-full p-6 text-white relative">
            <h3 className="font-brand text-base font-bold text-white mb-4">Create Promo Coupon</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP20"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={e => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-zinc-300 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={e => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1">
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={e => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                />
              </div>
              <div>
                <label className="block uppercase tracking-wider text-zinc-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={e => setNewCouponDesc(e.target.value)}
                  className="w-full bg-[#181822] border border-[#2b2b3b] py-2 px-3 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="py-2 px-4 border border-zinc-700 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#d4af37] text-black font-semibold uppercase tracking-wider"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase SQL Setup Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#10131c] border border-[#232b3f] max-w-2xl w-full p-6 text-white relative max-h-[90vh] flex flex-col shadow-2xl">
            <button
              onClick={() => setIsSqlModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-sm bg-[#162238] border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-brand text-base font-bold text-white">
                  Supabase Database Schema Setup
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Project ID: <span className="font-mono text-emerald-400">xmyhiwpoxkficfrqdoxz</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 mt-2 mb-4 leading-relaxed">
              To ensure customer orders are persisted and visible in both your Supabase dashboard and this Atelier console, run the SQL script below in your Supabase SQL Editor.
            </p>

            <div className="relative flex-1 min-h-0 bg-[#090b10] border border-[#1b2234] p-4 overflow-y-auto mb-4 font-mono text-[11px] text-zinc-300">
              <pre className="whitespace-pre-wrap">{SUPABASE_SCHEMA_SQL}</pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1b2234]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySupabaseSql}
                  className="flex items-center gap-1.5 py-2 px-4 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e2c15c] transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy SQL Query</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://supabase.com/dashboard/project/xmyhiwpoxkficfrqdoxz/sql`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 bg-[#182133] border border-[#2b3a58] text-xs text-zinc-200 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsSqlModalOpen(false)}
                  className="py-2 px-4 border border-zinc-700 text-xs text-zinc-300 hover:text-white"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

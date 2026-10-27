import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Coupon,
  Order,
  SiteSettings,
  ProductSize,
  ShippingAddress,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
} from '../data/initialData';
import { calculateOrderTotals, generateOrderNumber } from '../utils/pricing';
import {
  saveOrderToSupabase,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
  saveProductToSupabase,
  testSupabaseConnection,
  SUPABASE_PROJECT_ID,
} from '../lib/supabase';

interface UserSession {
  email: string;
  name: string;
  phone?: string;
  token?: string;
}

interface ShopContextType {
  // Navigation & view
  activeView: string;
  setActiveView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;

  // Catalog data
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  settings: SiteSettings;
  isLoadingData: boolean;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: ReturnType<typeof calculateOrderTotals>;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Drawers & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Checkout & Orders
  currentOrder: Order | null;
  orders: Order[];
  createOrder: (
    customer: ShippingAddress,
    paymentMethod: 'COD' | 'RAZORPAY',
    paymentStatus?: 'Paid' | 'Pending'
  ) => Promise<Order>;
  trackingOrderNumber: string;
  setTrackingOrderNumber: (num: string) => void;

  // Auth
  customerUser: UserSession | null;
  customerLogin: (email: string, name?: string) => void;
  customerLogout: () => void;

  // Admin
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  // Supabase Database Connection
  supabaseStatus: { connected: boolean; message: string; projectId: string };
  refreshOrders: () => Promise<void>;

  // Admin Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  addCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  addReview: (productId: string, author: string, location: string, rating: number, comment: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  // Catalog State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('chhava_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chhava_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State
  const [customerUser, setCustomerUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('chhava_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('chhava_admin_token');
    } catch {
      return false;
    }
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('chhava_admin_token');
    } catch {
      return null;
    }
  });

  // Supabase Database Connection State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    message: string;
    projectId: string;
  }>({
    connected: true,
    message: 'Connecting to Supabase (xmyhiwpoxkficfrqdoxz)...',
    projectId: SUPABASE_PROJECT_ID,
  });

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chhava_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('chhava_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [wishlist]);

  // Test Supabase on mount
  useEffect(() => {
    testSupabaseConnection().then(res => {
      setSupabaseStatus({
        connected: res.success,
        message: res.message,
        projectId: SUPABASE_PROJECT_ID,
      });
    });
  }, []);

  // Refresh orders from Supabase (or fallback to server API)
  const refreshOrders = async () => {
    try {
      const supaOrders = await fetchOrdersFromSupabase();
      if (supaOrders && supaOrders.length > 0) {
        setOrders(supaOrders);
        return;
      }
    } catch (e) {
      console.warn('Supabase orders fetch note:', e);
    }

    // Fallback to server API
    if (adminToken) {
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setOrders(data);
          }
        }
      } catch (err) {
        console.warn('API orders fetch error:', err);
      }
    }
  };

  // Load initial data
  useEffect(() => {
    async function fetchInitialData() {
      setIsLoadingData(true);
      try {
        const parseJsonSafe = async (res: Response | null) => {
          if (!res || !res.ok) return null;
          const ct = res.headers.get('content-type') || '';
          if (!ct.includes('application/json')) return null;
          try {
            return await res.json();
          } catch {
            return null;
          }
        };

        const [prodRes, catRes, coupRes, setRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/categories').catch(() => null),
          fetch('/api/coupons').catch(() => null),
          fetch('/api/settings').catch(() => null),
        ]);

        const prods = await parseJsonSafe(prodRes);
        if (Array.isArray(prods) && prods.length > 0) setProducts(prods);

        const cats = await parseJsonSafe(catRes);
        if (Array.isArray(cats) && cats.length > 0) setCategories(cats);

        const coups = await parseJsonSafe(coupRes);
        if (Array.isArray(coups) && coups.length > 0) setCoupons(coups);

        const sett = await parseJsonSafe(setRes);
        if (sett && sett.heroHeadline) setSettings(sett);

        // Fetch orders from Supabase
        const supaOrders = await fetchOrdersFromSupabase();
        if (supaOrders && supaOrders.length > 0) {
          setOrders(supaOrders);
        }
      } catch (err) {
        console.info('Using high-performance local store cache:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchInitialData();
  }, []);

  // Fetch admin orders if logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      refreshOrders();
    }
  }, [isAdminLoggedIn]);

  // Pricing calculations
  const cartTotals = calculateOrderTotals(cart, appliedCoupon, settings.freeShippingThreshold);

  // Cart operations
  const addToCart = (product: Product, size: ProductSize, color: string, quantity = 1) => {
    const compositeId = `${product.id}-${size}-${color}`;
    const effectivePrice = product.discountPrice || product.price;
    const sizeStock = product.sizes.find(s => s.size === size)?.stock || 10;

    setCart(prev => {
      const existing = prev.find(item => item.id === compositeId);
      if (existing) {
        return prev.map(item =>
          item.id === compositeId
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxStock) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: compositeId,
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: effectivePrice,
          originalPrice: product.price,
          selectedSize: size,
          selectedColor: color,
          quantity,
          maxStock: sizeStock,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === clean && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    const currentSubtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    if (currentSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Add items worth ₹${found.minOrderValue - currentSubtotal} more to unlock code ${found.code}.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon "${found.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Customer Auth
  const customerLogin = (email: string, name = 'Patron') => {
    const user = { email, name };
    setCustomerUser(user);
    localStorage.setItem('chhava_customer', JSON.stringify(user));
    setIsAuthModalOpen(false);
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem('chhava_customer');
  };

  // Admin Auth
  const adminLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminLoggedIn(true);
        setAdminToken(data.token);
        localStorage.setItem('chhava_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed' };
    } catch {
      // Fallback check
      if (email === 'admin@chhava.in' && pass === 'ChhavaAdmin2026!') {
        const token = 'chv_adm_session_live_829aef10';
        setIsAdminLoggedIn(true);
        setAdminToken(token);
        localStorage.setItem('chhava_admin_token', token);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials' };
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken(null);
    localStorage.removeItem('chhava_admin_token');
    setActiveView('home');
  };

  // Orders
  const createOrder = async (
    customer: ShippingAddress,
    paymentMethod: 'COD' | 'RAZORPAY',
    paymentStatus: 'Paid' | 'Pending' = 'Pending'
  ): Promise<Order> => {
    const orderNumber = generateOrderNumber();
    const totals = cartTotals;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: totals.subtotal,
      discount: totals.couponDiscount,
      couponCode: appliedCoupon?.code,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'RAZORPAY' ? 'Paid' : paymentStatus,
      status: 'Placed',
      trackingNumber: `CHV-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingEvents: [
        {
          status: 'Placed',
          location: 'CHHAVA Central Fulfillment Hub, Mumbai',
          timestamp: new Date().toISOString(),
          description: `Order successfully booked with ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Verified Razorpay Payment'}.`,
        },
      ],
    };

    // Try posting to API
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders(prev => [savedOrder, ...prev]);
        setCurrentOrder(savedOrder);
      } else {
        setOrders(prev => [newOrder, ...prev]);
        setCurrentOrder(newOrder);
      }
    } catch {
      setOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);
    }

    // Save directly to Supabase
    saveOrderToSupabase(newOrder).catch(err => {
      console.warn('Supabase order sync background warning:', err);
    });

    // Deduct stock locally
    setProducts(prev =>
      prev.map(p => {
        const cartItemForProduct = cart.filter(ci => ci.productId === p.id);
        if (cartItemForProduct.length === 0) return p;
        return {
          ...p,
          sizes: p.sizes.map(s => {
            const bought = cartItemForProduct.find(ci => ci.selectedSize === s.size);
            return bought ? { ...s, stock: Math.max(0, s.stock - bought.quantity) } : s;
          }),
        };
      })
    );

    clearCart();
    return newOrder;
  };

  // Admin Actions
  const addProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>
  ) => {
    const newProd: Product = {
      ...productData,
      id: `chv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newProd),
      });
    } catch (e) {
      console.warn('API error, using memory update:', e);
    }

    // Sync product to Supabase
    saveProductToSupabase(newProd).catch(e => {
      console.warn('Supabase product sync warning:', e);
    });

    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('API error, updating locally:', e);
    }
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    } catch (e) {
      console.warn('API error, deleting locally:', e);
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      slug: catData.slug || catData.name.toLowerCase().replace(/\s+/g, '-'),
    };
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newCat),
      });
    } catch (e) {
      console.warn('API error, saving category locally:', e);
    }
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('API error, updating category locally:', e);
    }
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    } catch (e) {
      console.warn('API error, removing category locally:', e);
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const newEvent = {
      status,
      location: 'Hub Update',
      timestamp: new Date().toISOString(),
      description: note || `Order updated to ${status}.`,
    };

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status, note, location: 'CHHAVA Fulfillment Center' }),
      });
    } catch (e) {
      console.warn('API error, updating order locally:', e);
    }

    // Sync status change to Supabase
    const targetOrder = orders.find(o => o.id === orderId);
    const existingEvents = targetOrder?.trackingEvents || [];
    const allEvents = [...existingEvents, newEvent];
    updateOrderStatusInSupabase(
      orderId,
      status,
      allEvents,
      status === 'Delivered' ? 'Paid' : undefined
    ).catch(e => console.warn('Supabase status sync warning:', e));

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status,
          paymentStatus: status === 'Delivered' ? 'Paid' : ord.paymentStatus,
          trackingEvents: [...ord.trackingEvents, newEvent],
        };
      })
    );
  };

  const addCoupon = async (newCoup: Coupon) => {
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newCoup),
      });
    } catch (e) {
      console.warn('API error, adding coupon locally:', e);
    }
    setCoupons(prev => [newCoup, ...prev]);
  };

  const deleteCoupon = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    } catch (e) {
      console.warn('API error, deleting coupon locally:', e);
    }
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    const updated = { ...settings, ...updates };
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('API error, updating settings locally:', e);
    }
    setSettings(updated);
  };

  const addReview = async (
    productId: string,
    author: string,
    location: string,
    rating: number,
    comment: string
  ) => {
    const reviewData = { author, location, rating, comment };
    try {
      await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
    } catch (e) {
      console.warn('API error, adding review locally:', e);
    }

    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const curReviews = p.reviews || [];
        const newR = {
          id: `rev-${Date.now()}`,
          author,
          location,
          rating,
          date: new Date().toISOString().slice(0, 10),
          comment,
          verified: true,
        };
        const updatedReviews = [newR, ...curReviews];
        const newAvg = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: newAvg,
        };
      })
    );
  };

  return (
    <ShopContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        products,
        categories,
        coupons,
        settings,
        isLoadingData,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        cartTotals,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        currentOrder,
        orders,
        createOrder,
        trackingOrderNumber,
        setTrackingOrderNumber,
        customerUser,
        customerLogin,
        customerLogout,
        isAdminLoggedIn,
        adminToken,
        adminLogin,
        adminLogout,
        supabaseStatus,
        refreshOrders,
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
        addReview,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

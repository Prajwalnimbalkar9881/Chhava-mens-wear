export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  fabric: string;
  fit: string;
  care: string;
  category: string;
  price: number; // Regular MRP in INR
  discountPrice?: number; // Discounted Selling price in INR
  images: string[];
  colors: ProductColor[];
  sizes: {
    size: ProductSize;
    stock: number;
  }[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique item composite key: `${product.id}-${size}-${color}`
  productId: string;
  name: string;
  image: string;
  price: number; // effective price
  originalPrice?: number;
  selectedSize: ProductSize;
  selectedColor: string;
  quantity: number;
  maxStock: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD' | 'RAZORPAY';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface OrderTrackingEvent {
  status: OrderStatus;
  location: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string;
  trackingEvents: OrderTrackingEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: ShippingAddress[];
  orders: string[]; // Order IDs
}

export interface SiteSettings {
  announcementText: string;
  announcementActive: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  promotionalOfferText: string;
  freeShippingThreshold: number;
}

import { CartItem, Coupon } from '../types';

export const DEFAULT_FREE_SHIPPING_THRESHOLD = 1499; // ₹1499 for free shipping
export const STANDARD_SHIPPING_FEE = 99; // ₹99 standard shipping across India
export const GST_RATE = 0.12; // 12% apparel GST standard in India (included or calculated)

/**
 * Format Indian Rupee currency with standard Indian numbering format (e.g. ₹2,499)
 */
export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Calculate cart subtotal
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

/**
 * Calculate MRP subtotal (before product discounts) to show total customer savings
 */
export function calculateMrpSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => {
    const itemOriginal = item.originalPrice && item.originalPrice > item.price ? item.originalPrice : item.price;
    return acc + itemOriginal * item.quantity;
  }, 0);
}

/**
 * Calculate discount based on active coupon
 */
export function calculateCouponDiscount(subtotal: number, coupon?: Coupon | null): number {
  if (!coupon || !coupon.isActive) return 0;
  if (subtotal < coupon.minOrderValue) return 0;

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return Math.max(0, discount);
}

/**
 * Calculate shipping charges
 */
export function calculateShipping(
  subtotalAfterDiscount: number,
  threshold: number = DEFAULT_FREE_SHIPPING_THRESHOLD
): number {
  if (subtotalAfterDiscount <= 0) return 0;
  return subtotalAfterDiscount >= threshold ? 0 : STANDARD_SHIPPING_FEE;
}

/**
 * Calculate total order summary
 */
export function calculateOrderTotals(
  items: CartItem[],
  coupon?: Coupon | null,
  freeShippingThreshold: number = DEFAULT_FREE_SHIPPING_THRESHOLD
) {
  const subtotal = calculateSubtotal(items);
  const mrpTotal = calculateMrpSubtotal(items);
  const couponDiscount = calculateCouponDiscount(subtotal, coupon);
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const shipping = calculateShipping(taxableAmount, freeShippingThreshold);
  // In premium fashion, GST is either inclusive or nominal. We specify 0 extra for inclusive display or clear itemized
  const tax = Math.round(taxableAmount * 0.05); // 5% GST included
  const total = taxableAmount + shipping;
  const totalSavings = Math.max(0, mrpTotal - subtotal + couponDiscount);

  return {
    subtotal,
    mrpTotal,
    couponDiscount,
    taxableAmount,
    shipping,
    tax,
    total,
    totalSavings,
    isFreeShipping: shipping === 0,
    amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - taxableAmount),
  };
}

/**
 * Generate unique branded order number (e.g. CHV-8204-IN)
 */
export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CHV-${dateStr}-${randomSuffix}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(regularPrice: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= regularPrice) return 0;
  return Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
}

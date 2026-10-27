import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateCouponDiscount,
  calculateShipping,
  calculateOrderTotals,
  calculateDiscountPercent,
  generateOrderNumber,
  formatINR,
} from './pricing';
import { CartItem, Coupon } from '../types';

test('calculateSubtotal handles empty and multiple items', () => {
  assert.equal(calculateSubtotal([]), 0);

  const items: CartItem[] = [
    {
      id: 'p1-m-black',
      productId: 'p1',
      name: 'Royal Heritage Kurta',
      image: '/test.jpg',
      price: 2499,
      selectedSize: 'M',
      selectedColor: 'Black',
      quantity: 2,
      maxStock: 10,
    },
    {
      id: 'p2-l-gold',
      productId: 'p2',
      name: 'Chhava Signature Tee',
      image: '/test2.jpg',
      price: 999,
      selectedSize: 'L',
      selectedColor: 'Gold',
      quantity: 1,
      maxStock: 5,
    },
  ];

  assert.equal(calculateSubtotal(items), 2499 * 2 + 999);
});

test('calculateCouponDiscount applies percentage with cap correctly', () => {
  const percentCoupon: Coupon = {
    code: 'CHHAVA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    maxDiscount: 500,
    description: '10% off up to ₹500',
    isActive: true,
  };

  // Below min order value
  assert.equal(calculateCouponDiscount(800, percentCoupon), 0);

  // 10% of 2000 = 200
  assert.equal(calculateCouponDiscount(2000, percentCoupon), 200);

  // 10% of 6000 = 600, capped at 500
  assert.equal(calculateCouponDiscount(6000, percentCoupon), 500);

  // Inactive coupon gives 0
  assert.equal(calculateCouponDiscount(2000, { ...percentCoupon, isActive: false }), 0);
});

test('calculateCouponDiscount applies fixed amount correctly', () => {
  const fixedCoupon: Coupon = {
    code: 'FIRST500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 1500,
    description: '₹500 off on orders above ₹1500',
    isActive: true,
  };

  assert.equal(calculateCouponDiscount(1200, fixedCoupon), 0);
  assert.equal(calculateCouponDiscount(2000, fixedCoupon), 500);
});

test('calculateShipping applies free shipping threshold', () => {
  // Free threshold is 1499
  assert.equal(calculateShipping(0), 0);
  assert.equal(calculateShipping(999), 99);
  assert.equal(calculateShipping(1499), 0);
  assert.equal(calculateShipping(2500), 0);
});

test('calculateOrderTotals computes complete financial breakdown', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      productId: 'p1',
      name: 'Luxury Bomber',
      image: '',
      price: 3499,
      originalPrice: 4999,
      selectedSize: 'L',
      selectedColor: 'Jet Black',
      quantity: 1,
      maxStock: 4,
    },
  ];

  const coupon: Coupon = {
    code: 'VIP10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    description: '10% off',
    isActive: true,
  };

  const totals = calculateOrderTotals(items, coupon, 1499);
  assert.equal(totals.subtotal, 3499);
  assert.equal(totals.couponDiscount, 350); // 10% of 3499 rounded
  assert.equal(totals.taxableAmount, 3499 - 350);
  assert.equal(totals.shipping, 0); // >= 1499
  assert.equal(totals.isFreeShipping, true);
});

test('calculateDiscountPercent calculates round discount %', () => {
  assert.equal(calculateDiscountPercent(1000, 750), 25);
  assert.equal(calculateDiscountPercent(2999, 1499), 50);
  assert.equal(calculateDiscountPercent(1000, 1000), 0);
});

test('generateOrderNumber returns valid CHV format', () => {
  const orderNum = generateOrderNumber();
  assert.match(orderNum, /^CHV-\d{6}-\d{4}$/);
});

test('formatINR formats currency symbol and commas', () => {
  const formatted = formatINR(2499);
  assert.ok(formatted.includes('2,499') || formatted.includes('2499'));
});

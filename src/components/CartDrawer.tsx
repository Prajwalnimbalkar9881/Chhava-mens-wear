import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/pricing';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotals,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setActiveView,
    coupons,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Free shipping calculation percentage
  const freeShippingThreshold = 1499;
  const progressPercent = Math.min(
    100,
    Math.round((cartTotals.taxableAmount / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#111116] border-l border-[#242430] h-full flex flex-col justify-between shadow-2xl z-10 text-[#f4f4f5]">
        {/* Header */}
        <div className="p-5 border-b border-[#20202c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            <span className="font-brand text-base font-bold tracking-wider text-white">
              YOUR ATELIER BAG ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-[#181822] px-5 py-3 border-b border-[#242434]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-zinc-300">
              {cartTotals.isFreeShipping ? (
                <span className="text-[#d4af37] flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Privilege unlocked: Free Express Shipping!
                </span>
              ) : (
                <>
                  Add <strong className="text-[#d4af37]">{formatINR(cartTotals.amountNeededForFreeShipping)}</strong> more for Free Shipping
                </>
              )}
            </span>
            <span className="text-[11px] text-zinc-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#0d0d12] h-1.5 overflow-hidden">
            <div
              className="bg-gold-metallic h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="font-brand text-lg text-zinc-300">Your Bag is Empty</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Explore our collections of hand-crafted kurtas, bespoke jackets, and heavyweight tees.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('shop');
                }}
                className="mt-4 py-2.5 px-6 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90"
              >
                Browse Silhouettes
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-[#16161e] border border-[#222230] relative group"
              >
                {/* Item Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover shrink-0 bg-[#0c0c10]"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-zinc-400 mt-1 space-x-2">
                      <span>Size: <strong className="text-zinc-200">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span>Colour: <strong className="text-zinc-200">{item.selectedColor}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#232332]">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#2d2d3d] bg-[#111116]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-zinc-400 hover:text-white text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-2 py-1 text-zinc-400 hover:text-white disabled:text-zinc-700 text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        {formatINR(item.price * item.quantity)}
                      </p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-[10px] text-zinc-500 line-through">
                          {formatINR(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Coupon Code & Subtotal Breakdown */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#20202c] bg-[#13131a] space-y-4">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#1e1c12] border border-[#d4af37]/40 text-xs">
                  <div className="flex items-center gap-1.5 text-[#f7df94]">
                    <Tag className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>
                      Code <strong>{appliedCoupon.code}</strong> applied (-{formatINR(cartTotals.couponDiscount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-400 hover:text-white text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Enter coupon (e.g. CHHAVA10)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-[#1b1b24] border border-[#2b2b3b] py-2 pl-8 pr-3 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-3 bg-[#232330] hover:bg-[#303040] text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors uppercase"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Coupon status / clickable suggestions */}
              {couponMessage && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    couponMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}

              {!appliedCoupon && (
                <div className="flex items-center gap-2 mt-2 overflow-x-auto text-[10px] text-zinc-400">
                  <span>Try:</span>
                  {coupons.slice(0, 2).map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCouponInput(c.code);
                        applyCouponCode(c.code);
                      }}
                      className="text-[#d4af37] underline hover:text-white"
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-[#20202c]">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="text-white font-medium">{formatINR(cartTotals.subtotal)}</span>
              </div>

              {cartTotals.couponDiscount > 0 && (
                <div className="flex justify-between text-[#d4af37]">
                  <span>Coupon Privilege</span>
                  <span>- {formatINR(cartTotals.couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>
                  {cartTotals.isFreeShipping ? (
                    <span className="text-[#d4af37] font-semibold uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  ) : (
                    formatINR(cartTotals.shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Estimated GST</span>
                <span>Included (5%)</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#20202c]">
                <span>Total Amount</span>
                <span className="font-brand text-base text-gold-gradient">
                  {formatINR(cartTotals.total)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 bg-gold-metallic hover:opacity-95 text-black font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 transition-all cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

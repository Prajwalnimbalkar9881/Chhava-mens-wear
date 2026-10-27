import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/pricing';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  ShieldCheck,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { currentOrder, setActiveView, setTrackingOrderNumber } = useShop();

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-brand text-2xl text-white mb-2">No Active Order Found</h2>
        <p className="text-xs text-zinc-400 mb-6">
          You haven't placed an order in this active session yet.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="py-3 px-6 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleTrackOrder = () => {
    setTrackingOrderNumber(currentOrder.orderNumber);
    setActiveView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyOrderId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentOrder.orderNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[#181d15] border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
            Atelier Booking Confirmed
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-bold text-white mt-1 mb-2">
            WEAR YOUR IDENTITY.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto font-light">
            Thank you, {currentOrder.customer.fullName}. Your handcrafted CHHAVA garments have been
            reserved and sent to our Mumbai atelier for inspection.
          </p>
        </div>

        {/* Order Identifier Banner */}
        <div className="bg-[#14141a] border border-[#2b2b3b] p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-400">Unique Order Identifier</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-brand text-lg sm:text-xl font-bold text-[#f7df94]">
                {currentOrder.orderNumber}
              </span>
              <button
                onClick={handleCopyOrderId}
                className="p-1 text-zinc-400 hover:text-white"
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                dateStyle: 'long',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTrackOrder}
              className="py-2.5 px-4 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 shadow-md"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Shipment Live</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white"
              title="Print Order Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#121217] border border-[#20202c] p-6 mb-8">
          <h2 className="font-brand text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#20202c] mb-6">
            GARMENT DISPATCH MANIFEST
          </h2>

          <div className="space-y-4 mb-8">
            {currentOrder.items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 border-b border-[#1b1b24] last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover bg-[#0d0d12] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                  <div className="text-xs text-zinc-400 mt-1 space-x-2">
                    <span>Size: <strong className="text-zinc-200">{item.selectedSize}</strong></span>
                    <span>·</span>
                    <span>Colour: <strong className="text-zinc-200">{item.selectedColor}</strong></span>
                    <span>·</span>
                    <span>Qty: <strong className="text-zinc-200">{item.quantity}</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#20202c]">
            {/* Delivery Details */}
            <div className="text-xs text-zinc-300 space-y-1.5">
              <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
                Shipping Address
              </h4>
              <p className="font-semibold text-white">{currentOrder.customer.fullName}</p>
              <p>{currentOrder.customer.addressLine}</p>
              {currentOrder.customer.landmark && <p>Landmark: {currentOrder.customer.landmark}</p>}
              <p>
                {currentOrder.customer.city}, {currentOrder.customer.state} - {currentOrder.customer.pincode}
              </p>
              <p className="text-zinc-400">Phone: {currentOrder.customer.phone}</p>
              <p className="text-zinc-400">Email: {currentOrder.customer.email}</p>
            </div>

            {/* Financial Details */}
            <div className="space-y-2 text-xs text-zinc-300">
              <h4 className="font-brand text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2">
                Payment Summary
              </h4>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="text-white font-medium">
                  {currentOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay Online'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span
                  className={`font-semibold ${
                    currentOrder.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {currentOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(currentOrder.subtotal)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-[#d4af37]">
                  <span>Privilege Discount ({currentOrder.couponCode})</span>
                  <span>- {formatINR(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>
                  {currentOrder.shipping === 0 ? (
                    <span className="text-[#d4af37]">COMPLIMENTARY</span>
                  ) : (
                    formatINR(currentOrder.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#20202c]">
                <span>Total Amount</span>
                <span className="text-gold-gradient font-brand text-lg">
                  {formatINR(currentOrder.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('shop')}
            className="w-full sm:w-auto py-3 px-8 border border-zinc-600 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:text-[#d4af37] transition-colors"
          >
            Explore More Silhouettes
          </button>
          <button
            onClick={handleTrackOrder}
            className="w-full sm:w-auto py-3 px-8 bg-gold-metallic text-black text-xs font-semibold uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, PaymentMethod } from '../types';
import { formatINR } from '../utils/pricing';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
];

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotals, appliedCoupon, createOrder, setActiveView, customerUser } = useShop();

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: customerUser?.name || 'Prajwal Nimbalkar',
    email: customerUser?.email || 'prajwalnimbalkar300@gmail.com',
    phone: '+91 98814 56041',
    addressLine: 'Near Historic Purandar Road',
    landmark: 'Saswad City Center',
    city: 'Saswad',
    state: 'Maharashtra',
    pincode: '412301',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Razorpay Modal Simulation State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-brand text-2xl text-white mb-2">No Items in Bag to Checkout</h2>
        <p className="text-xs text-zinc-400 mb-6">
          Your shopping bag is empty. Please select garments from our collection.
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine.trim()) {
      setErrorMessage('Please fill all required delivery address fields.');
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (paymentMethod === 'RAZORPAY') {
      // Trigger Razorpay gateway flow
      setShowRazorpayModal(true);
      return;
    }

    // Direct Cash on Delivery submission
    setIsSubmitting(true);
    try {
      await createOrder(formData, 'COD', 'Pending');
      setActiveView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete Razorpay Verified Payment Simulation
  const handleRazorpaySuccess = async () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      try {
        await createOrder(formData, 'RAZORPAY', 'Paid');
        setShowRazorpayModal(false);
        setIsProcessingPayment(false);
        setActiveView('order-confirmation');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
        setErrorMessage(err.message || 'Payment confirmation error.');
        setShowRazorpayModal(false);
        setIsProcessingPayment(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] pt-8 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex items-center justify-between border-b border-[#20202c] pb-4">
          <button
            onClick={() => setActiveView('shop')}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#d4af37] font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Secure Checkout</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-700/80 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Form: Delivery Address & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleFormSubmit} id="checkout-form">
              {/* Step 1: Customer Contact & Delivery Address */}
              <div className="bg-[#121217] border border-[#20202c] p-6 mb-8">
                <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-brand text-base font-bold text-white tracking-wider">
                      DELIVERY DESTINATION
                    </h2>
                  </div>
                  <span className="text-[11px] text-zinc-500">Pan-India Express</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="e.g. Arjun Patil"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        Mobile Number (+91) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98200 00000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      Email Address (For Invoicing & Tracking) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="patron@domain.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      Street Address / Flat / Building *
                    </label>
                    <input
                      type="text"
                      name="addressLine"
                      required
                      placeholder="Flat 402, Royal Residency, Senapati Bapat Marg"
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        placeholder="Near Phoenix Mills"
                        value={formData.landmark || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="e.g. Mumbai"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        placeholder="400013"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#181822] border border-[#2c2c3e] py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="bg-[#121217] border border-[#20202c] p-6 mb-8">
                <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-brand text-base font-bold text-white tracking-wider">
                      SELECT PAYMENT METHOD
                    </h2>
                  </div>
                  <span className="text-[11px] text-zinc-500">100% Encrypted</span>
                </div>

                <div className="space-y-3">
                  {/* COD Option */}
                  <label
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#d4af37] bg-[#1a1710]'
                        : 'border-[#262634] bg-[#15151c] hover:border-zinc-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 accent-[#d4af37]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#d4af37]" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 border border-emerald-800">
                          Zero Surcharge
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        Pay in cash or via UPI QR code when your luxury package arrives at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay Online Option */}
                  <label
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-[#d4af37] bg-[#1a1710]'
                        : 'border-[#262634] bg-[#15151c] hover:border-zinc-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="mt-1 accent-[#d4af37]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#d4af37]" />
                          Online Payment (Razorpay Secure)
                        </span>
                        <span className="text-[10px] bg-[#221c10] text-[#f7df94] px-2 py-0.5 border border-[#d4af37]/40">
                          Instant Confirmation
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        UPI (GPay, PhonePe, Paytm), Visa/Mastercard/Amex Cards, and Net Banking.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gold-metallic hover:opacity-95 text-black font-semibold text-xs uppercase tracking-[0.25em] transition-all shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'CONFIRMING ATELIER BOOKING...'
                    : paymentMethod === 'COD'
                    ? `PLACE CASH ON DELIVERY ORDER (${formatINR(cartTotals.total)})`
                    : `PAY VIA RAZORPAY (${formatINR(cartTotals.total)})`}
                </span>
              </button>
            </form>
          </div>

          {/* Right Summary: Items & Totals (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#121217] border border-[#20202c] p-6 sticky top-28">
              <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-[#20202c] mb-4">
                ORDER ATELIER SUMMARY ({cart.length} {cart.length === 1 ? 'ITEM' : 'ITEMS'})
              </h3>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 py-2 border-b border-[#1b1b24]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover shrink-0 bg-[#0e0e13]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-zinc-400">
                        Size: {item.selectedSize} · Qty: {item.quantity} · {item.selectedColor}
                      </p>
                      <p className="text-xs font-bold text-white mt-1">
                        {formatINR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs text-zinc-300 pb-4 border-b border-[#20202c]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium">{formatINR(cartTotals.subtotal)}</span>
                </div>

                {cartTotals.couponDiscount > 0 && (
                  <div className="flex justify-between text-[#d4af37]">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>- {formatINR(cartTotals.couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>
                    {cartTotals.isFreeShipping ? (
                      <span className="text-[#d4af37] font-semibold text-[11px]">COMPLIMENTARY</span>
                    ) : (
                      formatINR(cartTotals.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span>GST (included)</span>
                  <span>{formatINR(cartTotals.tax)} (5%)</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Total Payable
                </span>
                <span className="font-brand text-2xl font-bold text-gold-gradient">
                  {formatINR(cartTotals.total)}
                </span>
              </div>

              {/* Trust Callout */}
              <div className="mt-6 p-3 bg-[#171720] border border-[#242432] space-y-1.5 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Estimated Delivery: 2-4 business days</span>
                </div>
                <p className="text-[10px] leading-relaxed">
                  Delivered in sealed waterproof tamper-evident packaging with authenticity certificate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Simulator Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121620] border border-[#1f2937] max-w-md w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#232f42] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  R
                </div>
                <span className="font-bold tracking-wider text-sm">RAZORPAY GATEWAY</span>
              </div>
              <span className="text-xs text-zinc-400">Live Test Mode</span>
            </div>

            <div className="mb-4 bg-[#0d1117] p-3 border border-[#232f42]">
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Paying CHHAVA Luxury Couture</span>
                <span className="font-bold text-white">{formatINR(cartTotals.total)}</span>
              </div>
              <p className="text-[11px] text-zinc-500">Order ID: RAZOR-{Date.now()}</p>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Select Instant Payment Option
              </p>
              {['Google Pay UPI', 'PhonePe UPI', 'Paytm UPI', 'Visa / Mastercard Card ending 4242'].map(
                app => (
                  <button
                    key={app}
                    onClick={() => setSelectedUpiApp(app)}
                    className={`w-full text-left p-2.5 text-xs border transition-all flex items-center justify-between ${
                      selectedUpiApp === app
                        ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                        : 'border-[#232f42] bg-[#161c28] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <span>{app}</span>
                    {selectedUpiApp === app && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>
                )
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRazorpayModal(false)}
                disabled={isProcessingPayment}
                className="flex-1 py-2.5 border border-zinc-700 text-xs font-semibold uppercase text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRazorpaySuccess}
                disabled={isProcessingPayment}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold uppercase text-white shadow-md flex items-center justify-center gap-1.5"
              >
                {isProcessingPayment ? (
                  <span>Verifying Transaction...</span>
                ) : (
                  <span>Approve & Pay</span>
                )}
              </button>
            </div>

            <p className="text-[10px] text-zinc-500 text-center mt-4">
              PCI-DSS Level 1 Compliant. No raw credit card details stored.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

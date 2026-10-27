import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { formatINR } from '../utils/pricing';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Placed', label: 'Order Confirmed', desc: 'Garment reserved & inspected' },
  { status: 'Processing', label: 'Atelier Packaging', desc: 'Crafted in gold-foil box' },
  { status: 'Shipped', label: 'Dispatched in Transit', desc: 'Express Air courier' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier agent on route' },
  { status: 'Delivered', label: 'Delivered', desc: 'Handed over to patron' },
];

export const OrderTrackingPage: React.FC = () => {
  const { trackingOrderNumber, setTrackingOrderNumber, orders, currentOrder } = useShop();

  const [inputOrderNumber, setInputOrderNumber] = useState(trackingOrderNumber || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-search if trackingOrderNumber provided
  useEffect(() => {
    if (trackingOrderNumber) {
      setInputOrderNumber(trackingOrderNumber);
      handleSearch(trackingOrderNumber);
    } else if (currentOrder) {
      setInputOrderNumber(currentOrder.orderNumber);
      setMatchedOrder(currentOrder);
      setSearchAttempted(true);
    }
  }, [trackingOrderNumber, currentOrder]);

  const handleSearch = async (numToSearch: string) => {
    const clean = numToSearch.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setSearchAttempted(true);

    try {
      // First check local/context orders
      const local = orders.find(o => o.orderNumber.toUpperCase() === clean);
      if (local) {
        setMatchedOrder(local);
        setLoading(false);
        return;
      }

      if (currentOrder && currentOrder.orderNumber.toUpperCase() === clean) {
        setMatchedOrder(currentOrder);
        setLoading(false);
        return;
      }

      // Check backend API
      const res = await fetch(`/api/orders/track/${clean}`);
      if (res.ok) {
        const data = await res.json();
        setMatchedOrder(data);
      } else {
        setMatchedOrder(null);
      }
    } catch {
      setMatchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex(s => s.status === status);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
            Real-Time Logistics
          </span>
          <h1 className="font-brand text-3xl sm:text-4xl font-bold text-white mt-1 mb-2">
            TRACK YOUR CHHAVA ATELIER ORDER
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-light">
            Enter your unique order identifier (e.g. CHV-261026-8812) to view live logistics milestones and dispatch status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-[#121217] border border-[#20202c] p-6 mb-8 max-w-2xl mx-auto">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSearch(inputOrderNumber);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                placeholder="Enter Order ID (e.g. CHV-261026-8812)"
                value={inputOrderNumber}
                onChange={e => setInputOrderNumber(e.target.value.toUpperCase())}
                className="w-full bg-[#181822] border border-[#2b2b3b] py-3 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-zinc-500 uppercase tracking-wider focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-gold-metallic hover:opacity-95 text-black text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              {loading ? 'Locating...' : 'Track'}
            </button>
          </form>

          {/* Quick Demo ID helper */}
          <div className="mt-3 text-[11px] text-zinc-500 flex items-center gap-2">
            <span>Sample Track ID:</span>
            <button
              onClick={() => {
                setInputOrderNumber('CHV-261026-8812');
                handleSearch('CHV-261026-8812');
              }}
              className="text-[#d4af37] underline hover:text-white"
            >
              CHV-261026-8812
            </button>
          </div>
        </div>

        {/* Order Result Card */}
        {matchedOrder ? (
          <div className="bg-[#121217] border border-[#20202c] p-6 sm:p-8 space-y-8">
            {/* Header Information */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#20202c] gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                  Order Identifier
                </span>
                <h2 className="font-brand text-2xl font-bold text-white mt-0.5">
                  {matchedOrder.orderNumber}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Airway Bill (AWB):{' '}
                  <strong className="text-zinc-200">
                    {matchedOrder.trackingNumber || 'DELHIVERY-CHV-EXPRESS'}
                  </strong>
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs uppercase tracking-wider text-zinc-400">Current Phase</span>
                <div className="mt-1">
                  <span className="py-1 px-3 bg-[#241d10] text-[#f7df94] border border-[#d4af37]/40 text-xs font-bold uppercase tracking-wider">
                    {matchedOrder.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-300 mb-6">
                Live Fulfillment Progress
              </h3>

              <div className="relative">
                {/* Horizontal progress bar for desktop */}
                <div className="hidden md:grid grid-cols-5 gap-2 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(matchedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.status} className="flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all mb-2 z-10 ${
                            isCompleted
                              ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/20'
                              : 'bg-[#181822] text-zinc-500 border-[#2a2a38]'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            isCompleted ? 'text-white' : 'text-zinc-500'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-0.5 max-w-[120px]">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Timeline Events */}
            <div className="pt-6 border-t border-[#20202c]">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-300 mb-4">
                Milestone Activity Log
              </h3>

              <div className="space-y-4">
                {(matchedOrder.trackingEvents || []).map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#d4af37] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-zinc-300">
                        <strong className="text-white font-medium">{ev.location}</strong>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(ev.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-zinc-400 mt-0.5 text-[11px]">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          searchAttempted &&
          !loading && (
            <div className="p-8 text-center bg-[#121217] border border-[#242432] max-w-xl mx-auto space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-brand text-lg text-white">No Order Found</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                We could not locate an active order with identifier "{inputOrderNumber}". Please verify
                the order number sent to your email or SMS, or contact customer care.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

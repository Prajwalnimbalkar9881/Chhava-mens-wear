import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveView, setSelectedCategorySlug, settings } = useShop();

  const handleShopNow = () => {
    setSelectedCategorySlug('all');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplore = () => {
    setSelectedCategorySlug('traditional-wear');
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full bg-[#09090b] overflow-hidden">
      {/* High-Resolution Fashion Background with Vignette & Overlays */}
      <div className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center">
        {/* Background image container */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop"
            alt="CHHAVA Royal Haute Couture"
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.12] scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle Dark and Gold Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-[#0b0b0d]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d]/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(212,175,55,0.08),transparent_60%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="max-w-2xl">
            {/* Tagline Kicker */}
            <div className="inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Autumn / Winter Luxury Atelier</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-300">Wear Your Identity</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-brand text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 drop-shadow-sm">
              FORGED WITH <br />
              <span className="text-gold-gradient">FEARLESS PRIDE.</span>
            </h1>

            {/* Subheadline prose */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-sans-clean leading-relaxed mb-10 max-w-xl font-light">
              {settings.heroSubheadline}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleShopNow}
                className="py-4 px-8 bg-gold-metallic hover:opacity-95 text-black font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleExplore}
                className="py-4 px-8 border border-zinc-500 hover:border-[#d4af37] bg-black/40 hover:bg-black/60 text-white hover:text-[#d4af37] font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Value Pillars Bar */}
      <div className="border-y border-[#1f1f28] bg-[#0e0e13] py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-zinc-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-zinc-200">100% Authentic</p>
              <p className="text-[11px] text-zinc-400">Pure French terry & handloom silk</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#d4af37] shrink-0" />
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-zinc-200">Express Delivery</p>
              <p className="text-[11px] text-zinc-400">Complimentary above ₹1,499</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#d4af37] shrink-0" />
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-zinc-200">7-Day Exchange</p>
              <p className="text-[11px] text-zinc-400">Doorstep pickup across India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border border-[#d4af37] flex items-center justify-center text-[10px] text-[#d4af37] font-bold">
              ₹
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-zinc-200">Cash on Delivery</p>
              <p className="text-[11px] text-zinc-400">Available across 27,000+ PIN codes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

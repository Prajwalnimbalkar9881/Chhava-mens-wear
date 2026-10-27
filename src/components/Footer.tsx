import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Shield, Sparkles, Truck, Lock, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPolicy: (policy: 'shipping' | 'privacy' | 'terms' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  const { setActiveView, setSelectedCategorySlug } = useShop();

  const handleNav = (view: string, cat?: string) => {
    setActiveView(view);
    if (cat !== undefined) setSelectedCategorySlug(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08080a] border-t border-[#1a1a22] text-[#d4d4d8] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#181822]">
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-brand text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-gold-gradient">
                CHHAVA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
            </div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-zinc-400 font-semibold">
              Wear Your Identity
            </p>
            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-sm">
              Contemporary Indian luxury fashion house forged with fearless pride. Handcrafted kurtas,
              architectural jackets, and heavyweight Supima silhouettes crafted for those who command their destiny.
            </p>

            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>CHHAVA Atelier, Saswad, Pune, Maharashtra 412301</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>concierge@chhava.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>+91 98814 56041 (Mon-Sat 10AM - 7PM IST)</span>
              </p>
            </div>
          </div>

          {/* Col 3: Atelier Silhouettes */}
          <div>
            <h4 className="font-brand text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">
              Atelier Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => handleNav('shop', 'traditional-wear')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Sovereign Kurtas & Bundis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'jackets')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Bandhgala Bombers & Jackets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 't-shirts')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  280 GSM Supima Tees
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'shirts')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  European Flax Linen Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'hoodies-and-sweatshirts')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Gilded Lionheart Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('shop', 'sale')}
                  className="hover:text-[#d4af37] transition-colors text-[#e5c158]"
                >
                  Curated Archive Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Patron Care */}
          <div>
            <h4 className="font-brand text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">
              Patron Services
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => handleNav('track-order')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Track Atelier Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Shipping & 7-Day Exchange
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('brand-story')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Our Heritage & Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('contact')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Concierge & Atelier Visit
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-[#d4af37] transition-colors flex items-center gap-1 text-zinc-500 hover:text-zinc-300"
                >
                  <Shield className="w-3 h-3 text-[#d4af37]" />
                  <span>Owner Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Security */}
          <div>
            <h4 className="font-brand text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Terms of Atelier Service
                </button>
              </li>
            </ul>

            {/* Security Badges */}
            <div className="mt-6 pt-4 border-t border-[#1e1e28] space-y-2">
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>100% Encrypted Payment Flow</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Pan-India Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Payment Logos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 CHHAVA. All Rights Reserved. Made with pride in India.</p>
          <div className="flex items-center gap-3 text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            <span>Razorpay</span>
            <span>·</span>
            <span>UPI (GPay / PhonePe)</span>
            <span>·</span>
            <span>Visa / Mastercard</span>
            <span>·</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

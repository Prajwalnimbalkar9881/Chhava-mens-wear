import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  ArrowRight,
  Star,
  Quote,
  Instagram,
  Mail,
  CheckCircle2,
  Crown,
  Shield,
  Layers,
} from 'lucide-react';

export const HomepageSections: React.FC = () => {
  const { products, setActiveView, setSelectedCategorySlug } = useShop();

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Best sellers & New Arrivals filters
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Curated Patron Testimonials
  const testimonials = [
    {
      name: 'Vikramaditya Shinde',
      city: 'Mumbai, Maharashtra',
      comment:
        'The drape of the Sovereign Kurta with 18k gold buttons is unlike anything else in Indian fashion. It commands absolute respect without shouting. True royal luxury.',
      rating: 5,
      role: 'Creative Director',
    },
    {
      name: 'Aditya Oberoi',
      city: 'New Delhi',
      comment:
        'The 280 GSM Supima tees retain their razor-sharp collar shape and heavyweight structure even after a dozen washes. CHHAVA is easily at par with Balenciaga or Fear of God.',
      rating: 5,
      role: 'Architect & Collector',
    },
    {
      name: 'Rohan Deshmukh',
      city: 'Pune, Maharashtra',
      comment:
        'The Apex Bandhgala Bomber is an architectural masterpiece. Indian mandarin poise blended into a high-altitude military bomber. Unmatched silhouette.',
      rating: 5,
      role: 'Fashion Consultant',
    },
  ];

  // Instagram Lookbook Grid
  const lookbookItems = [
    {
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      handle: '@chhava.atelier',
      tag: 'Sovereign Raw Silk',
    },
    {
      image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop',
      handle: '@chhava.atelier',
      tag: 'Bandhgala Bomber Noir',
    },
    {
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      handle: '@chhava.atelier',
      tag: '280 GSM Supima Tee',
    },
    {
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
      handle: '@chhava.atelier',
      tag: 'Flax Cuban Linen',
    },
  ];

  return (
    <div className="space-y-28">
      {/* SECTION 5: TRENDING & BEST-SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#1f1f28] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37] flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span>Imperial Signature</span>
            </span>
            <h2 className="font-brand text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              BEST SELLERS & ICONIC PIECES
            </h2>
          </div>

          <button
            onClick={() => handleCategoryClick('best-sellers')}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 7: PREMIUM PROMOTIONAL BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#17140b] via-[#241c0e] to-[#121008] border-y border-[#3d3014]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37] bg-black/50 py-1 px-3 border border-[#d4af37]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Royal Festive Privilege · Limited Edition Drop</span>
              </div>

              <h2 className="font-brand text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                THE SOVEREIGN HERITAGE DROP. <br />
                <span className="text-gold-gradient">HANDCRAFTED WITH 18K GOLD ACCENTS.</span>
              </h2>

              <p className="text-xs sm:text-base text-zinc-300 font-light max-w-2xl leading-relaxed">
                Strictly limited to 100 crafted pieces per silhouette across India. Receive complimentary
                express air dispatch and a personalized gold-foil inscribed presentation case.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleCategoryClick('traditional-wear')}
                  className="py-3.5 px-8 bg-gold-metallic text-black font-semibold text-xs uppercase tracking-[0.2em] hover:opacity-95 shadow-lg shadow-[#d4af37]/20 cursor-pointer"
                >
                  Acquire Sovereign Piece
                </button>
                <div className="text-xs text-[#d4af37] font-mono tracking-wider flex items-center gap-2">
                  <span>Use Privilege Code:</span>
                  <span className="bg-black/60 px-2.5 py-1 border border-[#d4af37] text-white font-bold">
                    CHHAVA10
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:flex justify-end">
              <div className="relative w-64 h-80 border-2 border-[#d4af37]/40 p-2 bg-[#0c0a06]/80 rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
                  alt="Gold Embroidered Kurta"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: NEW ARRIVALS COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#1f1f28] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
              Fresh from Atelier
            </span>
            <h2 className="font-brand text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              NEW ARRIVALS · RUNWAY DROP
            </h2>
          </div>

          <button
            onClick={() => handleCategoryClick('new-arrivals')}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37] hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 9: BRAND STORY SECTION SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121217] border border-[#20202c] p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-5 relative z-10">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
              Atelier Manifesto
            </span>
            <h2 className="font-brand text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              WEAR YOUR IDENTITY.
            </h2>
            <p className="text-xs sm:text-base text-zinc-300 font-light leading-relaxed">
              Named after the legendary lion cub and inspired by Maratha valor, CHHAVA merges regal Indian
              cultural dignity with contemporary streetwear architecture. We build substantial,
              uncompromising garments for those who stand resolute in their truth.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveView('brand-story');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3 px-6 border border-[#d4af37] text-xs font-semibold uppercase tracking-[0.2em] text-[#f7df94] hover:bg-[#d4af37] hover:text-black transition-all flex items-center gap-2"
              >
                <span>Read Full Brand Chronicle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
            Verified Patron Voices
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl font-bold text-white mt-1">
            ACCLAIM FROM INDIAN CONNOISSEURS
          </h2>
          <div className="w-12 h-0.5 bg-[#d4af37] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#121217] border border-[#1f1f2a] p-6 sm:p-8 flex flex-col justify-between hover:border-[#d4af37]/40 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-[#d4af37]/30 mb-4" />
                <div className="flex items-center text-[#d4af37] mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1e1e28]">
                <h4 className="text-xs font-bold text-white">{t.name}</h4>
                <p className="text-[11px] text-[#d4af37]">{t.role}</p>
                <p className="text-[10px] text-zinc-500">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 12: INSTAGRAM & SOCIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#1f1f28] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37] flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5" />
              <span>@chhava.atelier</span>
            </span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-white mt-1">
              THE PATRON LOOKBOOK
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-light">Tag #WearYourIdentity to be featured</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lookbookItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] bg-[#121217] border border-[#20202c] overflow-hidden cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.tag}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-[#f7df94]">{item.tag}</span>
                <span className="text-[10px] text-zinc-400">{item.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-b from-[#161622] to-[#101017] border border-[#262638] p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <Mail className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#d4af37]">
            Private Atelier Bulletin
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl font-bold text-white mt-1 mb-3">
            RECEIVE BESPOKE PRIVILEGES
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-md mx-auto mb-6">
            Subscribe to receive private preview links to limited edition drops and unlock an immediate 10%
            privilege code for your first acquisition.
          </p>

          {newsletterSubmitted ? (
            <div className="p-4 bg-emerald-950/80 border border-emerald-700 max-w-md mx-auto text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Privilege unlocked! Use code <strong>CHHAVA10</strong> at checkout for 10% off.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-[#1c1c28] border border-[#2c2c3c] py-3 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="py-3 px-6 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
              >
                Join Sanctuary
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

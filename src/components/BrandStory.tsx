import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, ShieldCheck, Feather, Award } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Hero */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.35em] font-semibold text-[#d4af37]">
            The Heritage & Vision
          </span>
          <h1 className="font-brand text-4xl sm:text-6xl font-extrabold text-white mt-2 mb-6">
            WEAR YOUR <span className="text-gold-gradient">IDENTITY.</span>
          </h1>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mb-8" />
          <p className="text-sm sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto">
            CHHAVA was born out of an uncompromising conviction: modern Indian youth should never have to choose between their regal cultural lineage and contemporary global luxury.
          </p>
        </div>

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div className="aspect-[4/5] bg-[#14141a] border border-[#262634] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"
              alt="CHHAVA Royal Visionary"
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
            />
          </div>

          <div className="space-y-4">
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
              Chapter 01 · The Name
            </span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-white leading-snug">
              THE ROAR OF THE LION CUB
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              In Marathi, <em>Chhava</em> translates to the spirited young cub of a lion. It is an emblem of unyielding valor, fearlessness, and an innate royalty that does not need permission to command the room.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Drawing spiritual inspiration from the legendary legacy of Chhatrapati Sambhaji Maharaj, each piece from the CHHAVA atelier carries this indomitable character — structured silhouettes, regal poise, and absolute quiet power.
            </p>
          </div>
        </div>

        {/* Narrative Section 2: Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 md:flex-row-reverse">
          <div className="space-y-4 md:order-2">
            <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
              Chapter 02 · Atelier Craftsmanship
            </span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-white leading-snug">
              SAVILE ROW TAILORING MEETS INDIAN WEAVES
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              We source raw handloom Matka silk, certified European flax linen, and 280–460 GSM extra-long staple Supima cotton. Every collar, bandhgala fold, and button shank is drafted with architectural precision.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Our hardware features bespoke 18k electroplated gold insignia buttons and solid brass fasteners engineered to age with an exquisite antique patina.
            </p>
          </div>

          <div className="aspect-[4/5] bg-[#14141a] border border-[#262634] overflow-hidden md:order-1">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop"
              alt="Artisanal Handcrafting"
              className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.1]"
            />
          </div>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          <div className="p-6 bg-[#121217] border border-[#20202c] text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
            <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-white">
              Fearless Heritage
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Rooted in Indian dignity, reimagined for the modern international street.
            </p>
          </div>

          <div className="p-6 bg-[#121217] border border-[#20202c] text-center space-y-2">
            <Feather className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
            <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-white">
              Material Mastery
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Substantial fabric weights that drape naturally and outlast fast-fashion cycles.
            </p>
          </div>

          <div className="p-6 bg-[#121217] border border-[#20202c] text-center space-y-2">
            <Award className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
            <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-white">
              Limited Atelier Drops
            </h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Strictly numbered batch runs to ensure your sartorial identity remains singular.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 bg-gradient-to-b from-[#161620] to-[#101016] border border-[#2a2a3a]">
          <h3 className="font-brand text-2xl font-bold text-white mb-2">
            EXPERIENCE THE ATELIER
          </h3>
          <p className="text-xs text-zinc-400 mb-6 max-w-md mx-auto">
            Discover our sovereign kurtas, structured bombers, and heavyweight streetwear silhouettes.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="py-3.5 px-8 bg-gold-metallic text-black font-semibold text-xs uppercase tracking-[0.2em] hover:opacity-95 shadow-lg shadow-[#d4af37]/20"
          >
            Explore All Creations
          </button>
        </div>
      </div>
    </div>
  );
};

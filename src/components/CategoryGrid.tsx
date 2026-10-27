import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories, setSelectedCategorySlug, setActiveView } = useShop();

  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.28em] text-[#d4af37] font-semibold">
            Curated Silhouettes
          </span>
          <h2 className="font-brand text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            SHOP BY CATEGORY
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-2 md:mt-0 font-light">
          Each silhouette is an homage to Indian sartorial legacy, engineered with contemporary streetwear craftsmanship.
        </p>
      </div>

      {/* Grid of Large Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat.slug)}
            className="group relative h-96 overflow-hidden bg-[#121217] border border-[#1e1e28] hover:border-[#d4af37]/60 transition-all duration-500 cursor-pointer"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.08] transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.75]"
              loading="lazy"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-zinc-400 tracking-wider">
                  0{idx + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-black/60 border border-zinc-700 flex items-center justify-center text-white group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <h3 className="font-brand text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-gold-gradient transition-all">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-300 font-light mt-1.5 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                    Explore Atelier
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

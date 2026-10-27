import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/pricing';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';

export const SearchDrawer: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setSelectedProductId,
    setActiveView,
    setSelectedCategorySlug,
  } = useShop();

  const [query, setQuery] = useState('');

  const trendingTerms = ['Sovereign Kurta', 'Bandhgala Bomber', 'Supima Tee', 'Flax Linen', 'Pleated Trouser'];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isSearchOpen) return null;

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setActiveView('product-detail');
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTermClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-start justify-center pt-16 sm:pt-24 p-4 backdrop-blur-md">
      <div className="bg-[#121217] border border-[#252535] max-w-2xl w-full p-6 text-white relative shadow-2xl">
        {/* Search Input Bar */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
          <input
            type="text"
            autoFocus
            placeholder="Search by silhouette, fabric (e.g. Supima, Raw Silk), or SKU..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-[#181822] border border-[#2b2b3b] py-3 pl-11 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trending Suggestions */}
        {!query && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Trending Haute Couture Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTerms.map(term => (
                <button
                  key={term}
                  onClick={() => handleTermClick(term)}
                  className="py-1.5 px-3 bg-[#191924] hover:bg-[#222230] border border-[#2a2a38] text-xs text-zinc-300 hover:text-[#d4af37] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Display */}
        {query && (
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-[#20202c] mb-3">
              <span>Found {searchResults.length} {searchResults.length === 1 ? 'creation' : 'creations'}</span>
              {searchResults.length > 0 && (
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setActiveView('shop');
                  }}
                  className="text-[#d4af37] hover:underline"
                >
                  View All in Catalog →
                </button>
              )}
            </div>

            {searchResults.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No bespoke garments match "{query}". Try browsing by category or clear keywords.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelect(p.id)}
                    className="flex items-center gap-3 p-2 bg-[#171720] hover:bg-[#1f1f2c] border border-[#262634] cursor-pointer transition-colors group"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-14 object-cover bg-black shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition-colors truncate">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 capitalize truncate">
                        {p.category.replace(/-/g, ' ')} · {p.fabric}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-white">
                        {formatINR(p.discountPrice || p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

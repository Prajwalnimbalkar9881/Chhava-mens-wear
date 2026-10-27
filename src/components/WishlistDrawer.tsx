import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatINR } from '../utils/pricing';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    setSelectedProductId,
    setActiveView,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveToCart = (prod: any) => {
    addToCart(prod, prod.sizes[0]?.size || 'M', prod.colors[0]?.name || 'Standard', 1);
    toggleWishlist(prod.id);
  };

  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
    setActiveView('product-detail');
    setIsWishlistOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#111116] border-l border-[#242430] h-full flex flex-col justify-between shadow-2xl z-10 text-white">
        {/* Header */}
        <div className="p-5 border-b border-[#20202c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
            <span className="font-brand text-base font-bold tracking-wider text-white">
              SAVED SILHOUETTES ({wishlist.length})
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1 text-zinc-400 hover:text-white"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
              <p className="font-brand text-lg text-zinc-300">Your Wishlist is Empty</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto font-light">
                Tap the heart on any creation to save it for your next royal occasion.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setActiveView('shop');
                }}
                className="mt-4 py-2.5 px-6 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            wishlistedProducts.map(prod => (
              <div
                key={prod.id}
                className="flex gap-4 p-3 bg-[#16161e] border border-[#222230] relative group"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  onClick={() => handleViewProduct(prod.id)}
                  className="w-20 h-24 object-cover shrink-0 bg-[#0c0c10] cursor-pointer"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => handleViewProduct(prod.id)}
                        className="text-xs font-semibold text-white hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-1"
                      >
                        {prod.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-zinc-400 mt-0.5 capitalize">
                      {prod.category.replace(/-/g, ' ')}
                    </p>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xs font-bold text-white">
                        {formatINR(prod.discountPrice || prod.price)}
                      </span>
                      {prod.discountPrice && (
                        <span className="text-[10px] text-zinc-500 line-through">
                          {formatINR(prod.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#232332] flex items-center justify-between">
                    <button
                      onClick={() => handleMoveToCart(prod)}
                      className="py-1 px-3 bg-[#d4af37] text-black text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 hover:opacity-90"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-5 border-t border-[#20202c] bg-[#13131a]">
            <button
              onClick={() => {
                setIsWishlistOpen(false);
                setActiveView('shop');
              }}
              className="w-full py-3 border border-zinc-700 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-wider text-zinc-200 hover:text-[#d4af37] transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

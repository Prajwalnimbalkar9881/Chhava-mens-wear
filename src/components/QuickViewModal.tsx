import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductSize } from '../types';
import { formatINR, calculateDiscountPercent } from '../utils/pricing';
import { X, ShoppingBag, Heart, Star, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProductId,
    setActiveView,
  } = useShop();

  if (!quickViewProduct) return null;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    quickViewProduct.sizes.find(s => s.stock > 0)?.size || 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    quickViewProduct.colors[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  const discountPercent = calculateDiscountPercent(
    quickViewProduct.price,
    quickViewProduct.discountPrice
  );
  const effectivePrice = quickViewProduct.discountPrice || quickViewProduct.price;
  const wishlisted = isWishlisted(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  const handleFullDetail = () => {
    setSelectedProductId(quickViewProduct.id);
    setActiveView('product-detail');
    setQuickViewProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#121217] border border-[#252535] max-w-2xl w-full text-white relative shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image */}
        <div className="md:w-1/2 aspect-[3/4] bg-black relative">
          <img
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setQuickViewProduct(null)}
            className="md:hidden absolute top-3 right-3 p-1.5 bg-black/70 rounded-full text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="hidden md:flex justify-end">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold mb-1">
              {quickViewProduct.category.replace(/-/g, ' ')} · {quickViewProduct.sku}
            </div>

            <h3 className="font-brand text-lg font-bold text-white mb-1">
              {quickViewProduct.name}
            </h3>

            <div className="flex items-center gap-1.5 mb-3 text-xs text-zinc-400">
              <div className="flex text-[#d4af37]">
                <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
              </div>
              <span className="text-white font-medium">{quickViewProduct.rating}</span>
              <span>({quickViewProduct.reviewCount} Reviews)</span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-brand text-xl font-bold text-white">
                {formatINR(effectivePrice)}
              </span>
              {quickViewProduct.discountPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatINR(quickViewProduct.price)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-[#d4af37] bg-[#221c10] px-1.5 py-0.5 border border-[#d4af37]/30">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 font-light line-clamp-2 mb-4">
              {quickViewProduct.description}
            </p>

            {/* Size Selector */}
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium block mb-2">
                Size
              </span>
              <div className="flex gap-1.5">
                {quickViewProduct.sizes.map(s => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-1.5 px-3 text-xs font-semibold uppercase border transition-all ${
                      s.stock === 0
                        ? 'border-zinc-800 text-zinc-600 line-through cursor-not-allowed'
                        : selectedSize === s.size
                        ? 'border-[#d4af37] bg-[#d4af37] text-black font-bold'
                        : 'border-[#262636] bg-[#161620] text-white hover:border-zinc-400'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#1e1e28]">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#d4af37] hover:opacity-95 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 border transition-colors ${
                  wishlisted
                    ? 'border-[#d4af37] bg-[#d4af37] text-black'
                    : 'border-[#262636] bg-[#161620] text-zinc-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-black' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleFullDetail}
              className="w-full text-center text-xs text-zinc-400 hover:text-[#d4af37] py-1 transition-colors flex items-center justify-center gap-1"
            >
              <span>View Complete Garment Specifications</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

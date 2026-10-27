import React, { useState } from 'react';
import { Product, ProductSize } from '../types';
import { useShop } from '../context/ShopContext';
import { formatINR, calculateDiscountPercent } from '../utils/pricing';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductId,
    setActiveView,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
  } = useShop();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<ProductSize>(
    product.sizes.find(s => s.stock > 0)?.size || 'M'
  );
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const discountPercent = calculateDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice || product.price;
  const wishlisted = isWishlisted(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent, size: ProductSize) => {
    e.stopPropagation();
    addToCart(product, size, product.colors[0]?.name || 'Standard', 1);
    setShowQuickSizes(false);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#121217] border border-[#1e1e28] hover:border-[#383848] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Product Image Frame */}
      <div
        onClick={handleCardClick}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d10] cursor-pointer"
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="text-[10px] uppercase font-bold tracking-widest bg-black/80 text-white px-2 py-0.5 border border-zinc-700">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-widest bg-[#d4af37] text-black px-2 py-0.5">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            wishlisted
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-black/60 text-white hover:bg-black hover:text-[#d4af37]'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-black' : ''}`} />
        </button>

        {/* Quick View Button (hover overlay) */}
        <button
          onClick={handleQuickViewClick}
          className="absolute bottom-3 right-3 p-2 bg-black/70 hover:bg-black text-white hover:text-[#d4af37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          aria-label="Quick View"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Quick Add To Cart Tray (slide up on hover) */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3 pt-6 transition-all duration-300 z-10 ${
            showQuickSizes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
          }`}
        >
          <p className="text-[11px] text-zinc-400 mb-1.5 uppercase tracking-wider text-center">
            Quick Add Size
          </p>
          <div className="flex justify-center gap-1.5">
            {product.sizes.map(s => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={e => handleQuickAdd(e, s.size)}
                className={`py-1 px-2 text-xs font-semibold uppercase border transition-all ${
                  s.stock === 0
                    ? 'border-zinc-800 text-zinc-600 line-through cursor-not-allowed'
                    : 'border-zinc-700 bg-black/60 text-white hover:border-[#d4af37] hover:bg-[#d4af37] hover:text-black'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="uppercase tracking-widest text-[10px] text-[#d4af37] font-medium truncate">
              {product.category.replace(/-/g, ' ')}
            </span>
            {/* Color Swatch Dots */}
            <div className="flex items-center gap-1">
              {product.colors.map(c => (
                <span
                  key={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleCardClick}
            className="text-sm font-medium text-zinc-100 hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-[#d4af37]">
              <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
            </div>
            <span className="text-xs font-medium text-zinc-300">{product.rating}</span>
            <span className="text-[11px] text-zinc-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-[#1e1e28] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-white">
              {formatINR(effectivePrice)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-zinc-500 line-through">
                {formatINR(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
          >
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

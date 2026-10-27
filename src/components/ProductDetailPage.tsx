import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductSize, ProductReview } from '../types';
import { formatINR, calculateDiscountPercent } from '../utils/pricing';
import { ProductCard } from './ProductCard';
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronRight,
  Share2,
  ZoomIn,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
    setIsSizeGuideOpen,
    setActiveView,
    addReview,
  } = useShop();

  const product = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(() => {
    const available = product.sizes.find(s => s.stock > 0);
    return available ? available.size : 'M';
  });
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  // Pin Code Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Notifications
  const [copyNotification, setCopyNotification] = useState(false);

  const discountPercent = calculateDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice || product.price;
  const wishlisted = isWishlisted(product.id);

  // Selected size stock info
  const sizeStockInfo = product.sizes.find(s => s.size === selectedSize);
  const isOutOfStock = !sizeStockInfo || sizeStockInfo.stock <= 0;

  // Related products (same category or featured)
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
      .slice(0, 4);
  }, [products, product]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    // Realistic Indian delivery estimation
    const metroPrefixes = ['400', '110', '560', '500', '700', '600', '411'];
    const isMetro = metroPrefixes.some(pref => pincode.startsWith(pref));

    if (isMetro) {
      setPincodeStatus(`Verified: Delivery within 24-48 Hours to PIN ${pincode} with Express Air & COD available.`);
    } else {
      setPincodeStatus(`Verified: Delivery in 3-4 business days to PIN ${pincode} via Delhivery Express & COD available.`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    await addReview(
      product.id,
      reviewAuthor.trim(),
      reviewLocation.trim() || 'India',
      reviewRating,
      reviewComment.trim()
    );

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setReviewAuthor('');
      setReviewComment('');
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] pt-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-zinc-400 mb-6 flex items-center gap-2">
          <button
            onClick={() => setActiveView('home')}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => {
              setActiveView('shop');
            }}
            className="hover:text-white transition-colors capitalize"
          >
            {product.category.replace(/-/g, ' ')}
          </button>
          <span>/</span>
          <span className="text-[#d4af37] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Showcase: Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails Strip */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 shrink-0 overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#d4af37] ring-1 ring-[#d4af37]'
                      : 'border-[#262634] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage Image with Zoom Trigger */}
            <div className="relative flex-1 bg-[#121217] border border-[#20202c] overflow-hidden group">
              <div
                className="relative aspect-[3/4] w-full cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
              >
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsZoomed(true);
                  }}
                  className="absolute bottom-4 right-4 p-2.5 bg-black/70 hover:bg-black text-white hover:text-[#d4af37] rounded-full backdrop-blur-xs transition-colors"
                  title="Expand & Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Tag Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                {product.isNewArrival && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-black/80 text-white px-2.5 py-1 border border-zinc-700">
                    New Arrival
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#d4af37] text-black px-2.5 py-1">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Garment Specs, Sizes, Buttons (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* SKU & Category & Share */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="font-mono text-[#d4af37] tracking-wider uppercase">
                  SKU: {product.sku}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    title="Share silhouette link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copyNotification ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="font-brand text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mb-4 italic">
                {product.tagline}
              </p>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-[#20202c]">
                <div className="flex items-center text-[#d4af37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-[#d4af37]' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-white">{product.rating}</span>
                <span className="text-xs text-zinc-400">·</span>
                <span className="text-xs text-zinc-400">
                  {product.reviewCount} Patron Reviews
                </span>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-brand text-3xl font-bold text-white">
                  {formatINR(effectivePrice)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-zinc-500 line-through">
                      {formatINR(product.price)}
                    </span>
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider bg-[#262010] py-0.5 px-2 border border-[#d4af37]/40">
                      Save {formatINR(product.price - product.discountPrice)}
                    </span>
                  </>
                )}
                <span className="text-[11px] text-zinc-400 font-light ml-auto">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="uppercase tracking-wider text-zinc-300 font-medium">
                    Colour: <span className="text-[#d4af37] font-semibold">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`group flex items-center gap-2 p-1.5 border transition-all ${
                        selectedColor === color.name
                          ? 'border-[#d4af37] bg-[#1a1710]'
                          : 'border-[#262634] bg-[#141419] hover:border-zinc-500'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/40"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-zinc-300 pr-1">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector + Size Guide Modal Trigger */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wider text-zinc-300 font-medium">
                      Select Size:
                    </span>
                    {sizeStockInfo && sizeStockInfo.stock > 0 && sizeStockInfo.stock <= 5 && (
                      <span className="text-[11px] text-amber-400 font-medium">
                        Only {sizeStockInfo.stock} left in stock!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide (IN / CM)</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {product.sizes.map(s => {
                    const isSelected = selectedSize === s.size;
                    const isSoldOut = s.stock === 0;

                    return (
                      <button
                        key={s.size}
                        disabled={isSoldOut}
                        onClick={() => setSelectedSize(s.size)}
                        className={`relative py-3 text-xs font-bold uppercase border transition-all ${
                          isSoldOut
                            ? 'border-[#202028] bg-[#0e0e12] text-zinc-600 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-md'
                            : 'border-[#292938] bg-[#15151c] text-white hover:border-zinc-400'
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Add to Bag / Buy Now */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#2b2b3b] bg-[#14141a]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-3 text-zinc-300 hover:text-white disabled:text-zinc-600 text-sm font-semibold"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-semibold text-white">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(quantity + 1, sizeStockInfo ? sizeStockInfo.stock : 10)
                        )
                      }
                      disabled={quantity >= (sizeStockInfo ? sizeStockInfo.stock : 10)}
                      className="px-3 py-3 text-zinc-300 hover:text-white disabled:text-zinc-600 text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 py-3.5 px-6 font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-gold-metallic hover:opacity-95 text-black shadow-lg shadow-[#d4af37]/20 cursor-pointer'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 border transition-all ${
                      wishlisted
                        ? 'border-[#d4af37] bg-[#d4af37] text-black'
                        : 'border-[#2b2b3b] bg-[#14141a] text-zinc-300 hover:text-white hover:border-zinc-500'
                    }`}
                    aria-label="Wishlist"
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-black' : ''}`} />
                  </button>
                </div>

                {/* Direct Buy Now button */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-6 border border-zinc-600 hover:border-[#d4af37] bg-black/60 hover:bg-[#1a1710] text-white hover:text-[#d4af37] font-semibold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer"
                >
                  Buy Now With 1-Click
                </button>
              </div>

              {/* Pin Code Delivery Estimator */}
              <div className="bg-[#131318] border border-[#20202b] p-4 mb-6">
                <div className="flex items-center gap-2 mb-2 text-xs text-zinc-300 font-medium uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-[#d4af37]" />
                  <span>Check Express Delivery & COD Availability</span>
                </div>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code (e.g. 400001)"
                    value={pincode}
                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#1a1a24] border border-[#282836] py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-[#232330] hover:bg-[#303042] text-xs font-semibold uppercase tracking-wider text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] text-zinc-300 mt-2 font-light">{pincodeStatus}</p>
                )}
              </div>
            </div>

            {/* Atelier Guarantees */}
            <div className="pt-4 border-t border-[#1f1f28] grid grid-cols-3 gap-2 text-center text-zinc-400 text-[11px]">
              <div className="flex flex-col items-center gap-1 p-2 bg-[#121217]">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium text-zinc-200">100% Authentic</span>
                <span className="text-[9px] text-zinc-500">Pure Indian Craft</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-[#121217]">
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium text-zinc-200">Free Shipping</span>
                <span className="text-[9px] text-zinc-500">On orders ₹1499+</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-[#121217]">
                <RotateCcw className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium text-zinc-200">7-Day Easy Return</span>
                <span className="text-[9px] text-zinc-500">Hassle-Free Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Care, Brand Craft */}
        <div className="mb-20 bg-[#121217] border border-[#1e1e28] p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#222230]">
            <div className="md:pr-6">
              <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-[#d4af37] mb-3">
                Silhouettes & Philosophy
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-light mb-4">
                {product.description}
              </p>
              <div className="space-y-1.5 text-xs text-zinc-400">
                <p>
                  <strong className="text-zinc-200 font-medium">Fit Profile:</strong> {product.fit}
                </p>
                <p>
                  <strong className="text-zinc-200 font-medium">Origin:</strong> Handcrafted in
                  Maharashtra & Gujarat, India
                </p>
              </div>
            </div>

            <div className="pt-6 md:pt-0 md:px-6">
              <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-[#d4af37] mb-3">
                Fabric & Weave
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-light mb-4">
                {product.fabric}
              </p>
              <div className="space-y-1.5 text-xs text-zinc-400">
                <p>
                  <strong className="text-zinc-200 font-medium">Hardware:</strong> Custom brass & 18k
                  gold electroplated buttons
                </p>
                <p>
                  <strong className="text-zinc-200 font-medium">Stitching:</strong> 14 stitches per inch
                  French seams
                </p>
              </div>
            </div>

            <div className="pt-6 md:pt-0 md:pl-6">
              <h3 className="font-brand text-sm font-bold uppercase tracking-wider text-[#d4af37] mb-3">
                Care & Longevity
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-light mb-4">
                {product.care}
              </p>
              <div className="space-y-1.5 text-xs text-zinc-400">
                <p>
                  <strong className="text-zinc-200 font-medium">Packaging:</strong> Packed in custom
                  gold-foil CHHAVA archival keepsake box
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Testimonials Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#20202c] mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Patron Impressions
              </span>
              <h2 className="font-brand text-2xl sm:text-3xl font-bold text-white mt-1">
                RATINGS & REVIEWS
              </h2>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="py-2.5 px-5 bg-[#1a1a24] hover:bg-[#252535] border border-[#d4af37]/40 text-xs font-semibold uppercase tracking-wider text-[#f7df94] transition-colors"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-10 bg-[#14141a] border border-[#2b2b3b] p-6 max-w-xl"
            >
              <h3 className="font-brand text-base font-bold text-white mb-4">
                Share Your Experience with {product.name}
              </h3>

              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs text-center font-medium">
                  Thank you! Your verified patron review has been recorded.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kunal Deshmukh"
                        value={reviewAuthor}
                        onChange={e => setReviewAuthor(e.target.value)}
                        className="w-full bg-[#1b1b24] border border-[#2c2c3c] py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
                        City, State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pune, Maharashtra"
                        value={reviewLocation}
                        onChange={e => setReviewLocation(e.target.value)}
                        className="w-full bg-[#1b1b24] border border-[#2c2c3c] py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-zinc-300 mb-1">
                      Your Detailed Review *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Comment on the fabric weight, fit, stitching and drape..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      className="w-full bg-[#1b1b24] border border-[#2c2c3c] py-2 px-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#d4af37] hover:opacity-90 text-black text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(product.reviews && product.reviews.length > 0 ? product.reviews : []).map(rev => (
              <div
                key={rev.id}
                className="bg-[#121217] border border-[#1e1e28] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-[#d4af37]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-[#d4af37]' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500">{rev.date}</span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1e1e28] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-zinc-200">{rev.author}</span>
                    <p className="text-[10px] text-zinc-500">{rev.location}</p>
                  </div>
                  {rev.verified && (
                    <span className="text-[10px] text-[#d4af37] flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" />
                      Verified Patron
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="pb-6 border-b border-[#20202c] mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Curated Accompaniments
              </span>
              <h2 className="font-brand text-2xl font-bold text-white mt-1">
                YOU MAY ALSO ADMIRE
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(rel => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Large Image Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="max-h-[85vh] w-auto mx-auto object-contain shadow-2xl"
            />
            <p className="text-center text-xs text-zinc-400 mt-3 uppercase tracking-wider">
              Click anywhere to close full screen view
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

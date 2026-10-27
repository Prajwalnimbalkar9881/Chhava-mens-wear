import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ProductSize } from '../types';
import {
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  RotateCcw,
  Plus,
} from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    setIsAddProductModalOpen,
  } = useShop();

  // Filters State
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const availableSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Extract unique colors across all products
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => {
      p.colors.forEach(c => map.set(c.name, c.hex));
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategorySlug !== 'all') {
        if (selectedCategorySlug === 'new-arrivals' && !product.isNewArrival) return false;
        if (selectedCategorySlug === 'best-sellers' && !product.isBestSeller) return false;
        if (selectedCategorySlug === 'sale' && !product.isSale && (!product.discountPrice || product.discountPrice >= product.price)) return false;
        if (
          selectedCategorySlug !== 'new-arrivals' &&
          selectedCategorySlug !== 'best-sellers' &&
          selectedCategorySlug !== 'sale' &&
          product.category !== selectedCategorySlug
        ) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesSku) return false;
      }

      // Price filter
      const effectivePrice = product.discountPrice || product.price;
      if (effectivePrice > maxPrice) return false;

      // Size filter
      if (selectedSizes.length > 0) {
        const hasSize = product.sizes.some(
          s => selectedSizes.includes(s.size) && s.stock > 0
        );
        if (!hasSize) return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasColor = product.colors.some(c => selectedColors.includes(c.name));
        if (!hasColor) return false;
      }

      // In-stock filter
      if (onlyInStock) {
        const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
        if (totalStock <= 0) return false;
      }

      // Min discount filter
      if (minDiscount > 0) {
        if (!product.discountPrice) return false;
        const discountPct = Math.round(((product.price - product.discountPrice) / product.price) * 100);
        if (discountPct < minDiscount) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popularity') return b.reviewCount - a.reviewCount;
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    products,
    selectedCategorySlug,
    searchQuery,
    maxPrice,
    selectedSizes,
    selectedColors,
    onlyInStock,
    minDiscount,
    sortBy,
  ]);

  const toggleSizeFilter = (size: ProductSize) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColorFilter = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const resetFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(8000);
    setOnlyInStock(false);
    setMinDiscount(0);
    setSearchQuery('');
  };

  const activeFiltersCount =
    (selectedSizes.length > 0 ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (maxPrice < 8000 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const currentCategoryName = useMemo(() => {
    if (selectedCategorySlug === 'all') return 'All Creations';
    if (selectedCategorySlug === 'new-arrivals') return 'New Arrivals';
    if (selectedCategorySlug === 'best-sellers') return 'Best Sellers';
    if (selectedCategorySlug === 'sale') return 'Curated Sale';
    const found = categories.find(c => c.slug === selectedCategorySlug);
    return found ? found.name : 'Collection';
  }, [selectedCategorySlug, categories]);

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] pt-6 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="border-b border-[#1f1f28] pb-6 mb-8">
          <div className="text-xs text-zinc-400 mb-2 flex items-center gap-2">
            <span className="hover:text-white cursor-pointer" onClick={() => setSelectedCategorySlug('all')}>
              Atelier
            </span>
            <span>/</span>
            <span className="text-[#d4af37]">{currentCategoryName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-brand text-2xl sm:text-4xl font-bold tracking-tight text-white">
                {currentCategoryName.toUpperCase()}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
                Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>

            {/* Top Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`py-1.5 px-3 text-xs tracking-wider uppercase font-medium transition-all whitespace-nowrap ${
                  selectedCategorySlug === 'all'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#16161c] text-zinc-300 hover:text-white hover:bg-[#202028]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategorySlug('new-arrivals')}
                className={`py-1.5 px-3 text-xs tracking-wider uppercase font-medium transition-all whitespace-nowrap ${
                  selectedCategorySlug === 'new-arrivals'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#16161c] text-zinc-300 hover:text-white hover:bg-[#202028]'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setSelectedCategorySlug('best-sellers')}
                className={`py-1.5 px-3 text-xs tracking-wider uppercase font-medium transition-all whitespace-nowrap ${
                  selectedCategorySlug === 'best-sellers'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#16161c] text-zinc-300 hover:text-white hover:bg-[#202028]'
                }`}
              >
                Best Sellers
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategorySlug(c.slug)}
                  className={`py-1.5 px-3 text-xs tracking-wider uppercase font-medium transition-all whitespace-nowrap ${
                    selectedCategorySlug === c.slug
                      ? 'bg-[#d4af37] text-black font-semibold'
                      : 'bg-[#16161c] text-zinc-300 hover:text-white hover:bg-[#202028]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategorySlug('sale')}
                className={`py-1.5 px-3 text-xs tracking-wider uppercase font-medium transition-all whitespace-nowrap ${
                  selectedCategorySlug === 'sale'
                    ? 'bg-[#d4af37] text-black font-semibold'
                    : 'bg-[#221c10] text-[#e5c158] hover:bg-[#322915]'
                }`}
              >
                Sale
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filter Toggle, Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-[#121217] p-3 border border-[#1f1f28]">
          {/* Search bar inside PLP */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search garments, fabric, SKU or style..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#181820] border border-[#262633] py-2 pl-9 pr-8 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Owner Add Garment Action */}
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-1.5 py-2 px-3 bg-[#241c0e] hover:bg-[#342713] border border-[#d4af37]/60 text-xs font-semibold text-[#f7df94] transition-colors cursor-pointer"
              title="Shop Owner: Add New Garment"
            >
              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">Add Garment</span>
              <span className="md:hidden">+ Add</span>
            </button>

            {/* Filter Drawer Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 py-2 px-3.5 bg-[#1a1a24] hover:bg-[#242432] border border-[#2b2b3b] text-xs font-medium text-zinc-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-zinc-400">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#1a1a24] border border-[#2b2b3b] text-xs text-zinc-200 py-2 px-3 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="newest">Newest First</option>
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-zinc-400">Active Filters:</span>
            {selectedSizes.map(size => (
              <span
                key={size}
                className="inline-flex items-center gap-1 py-0.5 px-2 bg-[#1c1c24] border border-[#2b2b38] text-[11px] text-zinc-300"
              >
                Size: {size}
                <button onClick={() => toggleSizeFilter(size)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedColors.map(color => (
              <span
                key={color}
                className="inline-flex items-center gap-1 py-0.5 px-2 bg-[#1c1c24] border border-[#2b2b38] text-[11px] text-zinc-300"
              >
                Color: {color}
                <button onClick={() => toggleColorFilter(color)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {maxPrice < 8000 && (
              <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-[#1c1c24] border border-[#2b2b38] text-[11px] text-zinc-300">
                Under ₹{maxPrice}
                <button onClick={() => setMaxPrice(8000)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 py-0.5 px-2 bg-[#1c1c24] border border-[#2b2b38] text-[11px] text-zinc-300">
                In Stock Only
                <button onClick={() => setOnlyInStock(false)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Main Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[#282838] p-12">
            <h3 className="font-brand text-xl text-zinc-300 mb-2">No Matching Silhouettes Found</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mb-6">
              Try adjusting your size, price range or category filter criteria to explore other bespoke creations.
            </p>
            <button
              onClick={resetFilters}
              className="py-2.5 px-6 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.slice(0, visibleCount).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < filteredProducts.length && (
              <div className="mt-14 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="py-3 px-8 border border-zinc-600 hover:border-[#d4af37] text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 hover:text-[#d4af37] transition-all bg-[#121218]"
                >
                  Load More Silhouettes ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Side Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-[#111116] border-l border-[#242430] h-full overflow-y-auto p-6 z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#242430] mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-brand text-base font-bold text-white tracking-wider">
                    FILTER CREATIONS
                  </span>
                </div>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Range Slider */}
              <div className="mb-6 pb-6 border-b border-[#20202a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium">
                    Maximum Price
                  </span>
                  <span className="text-xs font-semibold text-[#d4af37]">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="8000"
                  step="500"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#d4af37] bg-zinc-800"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>₹1,000</span>
                  <span>₹8,000+</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6 pb-6 border-b border-[#20202a]">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium block mb-3">
                  Select Size
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSizeFilter(size)}
                        className={`py-2 text-xs font-semibold uppercase border transition-all ${
                          isSelected
                            ? 'bg-[#d4af37] text-black border-[#d4af37]'
                            : 'bg-[#171720] text-zinc-300 border-[#2a2a38] hover:border-zinc-500'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="mb-6 pb-6 border-b border-[#20202a]">
                <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium block mb-3">
                  Color Swatch
                </span>
                <div className="flex flex-wrap gap-2">
                  {allColors.map(color => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggleColorFilter(color.name)}
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded-xs border text-xs transition-all ${
                          isSelected
                            ? 'border-[#d4af37] bg-[#221c10] text-[#f7df94]'
                            : 'border-[#262634] bg-[#16161e] text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/40"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[11px] truncate max-w-[100px]">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability & Discount */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={e => setOnlyInStock(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  <span>Show In-Stock Only</span>
                </label>

                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-300 font-medium block mb-2">
                    Minimum Discount
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 10, 20, 30].map(disc => (
                      <button
                        key={disc}
                        onClick={() => setMinDiscount(disc)}
                        className={`py-1.5 text-[11px] font-semibold border ${
                          minDiscount === disc
                            ? 'bg-[#d4af37] text-black border-[#d4af37]'
                            : 'bg-[#16161e] text-zinc-400 border-[#262634]'
                        }`}
                      >
                        {disc === 0 ? 'All' : `${disc}%+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#242430] flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 border border-zinc-700 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-[#1f1f28]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-[#d4af37] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-90"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

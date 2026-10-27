import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductSize } from '../types';
import {
  X,
  Plus,
  Crown,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Tag,
  Shield,
  Palette,
} from 'lucide-react';

// Curated luxury photo presets so shop owner can choose in 1-click
const PHOTO_PRESETS = [
  {
    label: 'Royal Kurta / Traditional',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Bandhgala / Jacket',
    url: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Heavyweight Tee',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Flax Linen Shirt',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Gilded Hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
  },
  {
    label: 'Pleated Trouser',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
  },
];

export const AddProductModal: React.FC = () => {
  const {
    isAddProductModalOpen,
    setIsAddProductModalOpen,
    categories,
    addProduct,
    isAdminLoggedIn,
    adminLogin,
    setSelectedProductId,
    setActiveView,
  } = useShop();

  const [form, setForm] = useState({
    name: 'Sovereign Heritage Bandhani Kurta',
    sku: `CHV-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
    category: 'traditional-wear',
    price: 4499,
    discountPrice: 3499,
    tagline: 'Hand-dyed Artisanal Silk with 18k Electroplated Gold Accents',
    description:
      'Engineered for distinguished Indian occasions. Woven with rich handloom threads and tailored with razor-sharp bandhgala precision.',
    fabric: '85% Pure Handloom Raw Silk, 15% Organic Cotton',
    fit: 'Contemporary Royal Tailored Fit',
    care: 'Dry Clean Only. Steam press on low heat.',
    images: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
    colorName: 'Royal Obsidian & Gold',
    colorHex: '#121214',
    stockXS: 5,
    stockS: 15,
    stockM: 20,
    stockL: 18,
    stockXL: 10,
    stockXXL: 6,
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState('ChhavaAdmin2026!');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAddProductModalOpen) return null;

  const handleQuickAuthenticate = async () => {
    setAuthError(null);
    const res = await adminLogin('admin@chhava.in', ownerPassword);
    if (!res.success) {
      setAuthError('Authentication failed. Default password is ChhavaAdmin2026!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      const res = await adminLogin('admin@chhava.in', ownerPassword);
      if (!res.success) {
        setAuthError('Please authenticate with the owner password before publishing.');
        return;
      }
    }

    setIsSubmitting(true);
    const imgArray = form.images
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const sizesArray = [
      { size: 'XS' as ProductSize, stock: Number(form.stockXS) },
      { size: 'S' as ProductSize, stock: Number(form.stockS) },
      { size: 'M' as ProductSize, stock: Number(form.stockM) },
      { size: 'L' as ProductSize, stock: Number(form.stockL) },
      { size: 'XL' as ProductSize, stock: Number(form.stockXL) },
      { size: 'XXL' as ProductSize, stock: Number(form.stockXXL) },
    ];

    try {
      await addProduct({
        name: form.name,
        sku: form.sku,
        category: form.category,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        tagline: form.tagline,
        description: form.description,
        fabric: form.fabric,
        fit: form.fit,
        care: form.care,
        images:
          imgArray.length > 0
            ? imgArray
            : [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
              ],
        colors: [{ name: form.colorName, hex: form.colorHex }],
        sizes: sizesArray,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        isFeatured: form.isFeatured,
      });

      setSuccessNotice(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessNotice(false);
        setIsAddProductModalOpen(false);
        setActiveView('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const generateNewSKU = () => {
    const catCode = form.category.slice(0, 3).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    setForm(prev => ({ ...prev, sku: `CHV-${catCode}-${rand}` }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#111116] border border-[#2b2b3c] max-w-2xl w-full p-6 sm:p-8 text-white relative shadow-2xl my-8 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#20202c] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#241d10] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-brand text-base sm:text-lg font-bold text-white tracking-wider flex items-center gap-2">
                <span>SHOP OWNER: ADD NEW GARMENT</span>
                <span className="text-[10px] bg-[#d4af37] text-black font-bold uppercase px-2 py-0.5">
                  Atelier
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Publish a new handcrafted silhouette directly to the CHHAVA live catalog.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddProductModalOpen(false)}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>
              Garment <strong>"{form.name}"</strong> successfully published to the live store!
              Redirecting...
            </span>
          </div>
        )}

        {/* Owner Authentication Status Check */}
        {!isAdminLoggedIn && (
          <div className="mb-6 p-4 bg-[#1a1710] border border-[#d4af37]/40 text-xs text-zinc-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#f7df94] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                Owner Security Authorization
              </span>
              <span className="text-[10px] text-zinc-400">admin@chhava.in</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-light">
              Enter your master owner password (default: <code>ChhavaAdmin2026!</code>) to authorize
              this product release:
            </p>
            {authError && <p className="text-[11px] text-red-400">{authError}</p>}
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Owner Password"
                value={ownerPassword}
                onChange={e => setOwnerPassword(e.target.value)}
                className="flex-1 bg-[#121217] border border-[#2c2c3e] py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={handleQuickAuthenticate}
                className="py-1.5 px-4 bg-[#d4af37] text-black font-semibold uppercase text-xs hover:opacity-90 transition-opacity"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* Product Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Garment Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Garment Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Heritage Silk Kurta"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#161620] border border-[#282838] py-2.5 px-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="uppercase tracking-wider text-zinc-300 font-medium">
                  SKU Code *
                </label>
                <button
                  type="button"
                  onClick={generateNewSKU}
                  className="text-[10px] text-[#d4af37] underline hover:text-white"
                >
                  Generate SKU
                </button>
              </div>
              <input
                type="text"
                required
                value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                className="w-full bg-[#161620] border border-[#282838] py-2.5 px-3 text-white uppercase font-mono focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Category, MRP, Selling Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#161620] border border-[#282838] py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37]"
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Regular MRP (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="4999"
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-[#161620] border border-[#282838] py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Discount Selling Price (₹)
              </label>
              <input
                type="number"
                placeholder="3999"
                value={form.discountPrice}
                onChange={e => setForm({ ...form, discountPrice: Number(e.target.value) })}
                className="w-full bg-[#161620] border border-[#282838] py-2.5 px-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <div>
            <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
              Sartorial Tagline / Kicker
            </label>
            <input
              type="text"
              placeholder="e.g. 100% Raw Silk with 18k Electroplated Gold Accents"
              value={form.tagline}
              onChange={e => setForm({ ...form, tagline: e.target.value })}
              className="w-full bg-[#161620] border border-[#282838] py-2 px-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Garment Images + Presets */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="uppercase tracking-wider text-zinc-300 font-medium">
                Product Image URL(s)
              </label>
              <span className="text-[10px] text-zinc-500">Comma-separated for multi-photos</span>
            </div>
            <input
              type="text"
              value={form.images}
              onChange={e => setForm({ ...form, images: e.target.value })}
              className="w-full bg-[#161620] border border-[#282838] py-2 px-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
            />

            {/* Quick Presets */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto text-[10px] text-zinc-400">
              <span className="shrink-0 text-zinc-500 font-medium">Quick Photo Presets:</span>
              {PHOTO_PRESETS.map(preset => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setForm(prev => ({ ...prev, images: preset.url }))}
                  className="py-0.5 px-2 bg-[#1b1b24] hover:bg-[#252532] border border-[#292938] text-zinc-300 hover:text-[#d4af37] shrink-0"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Color Name
              </label>
              <input
                type="text"
                placeholder="e.g. Imperial Maroon"
                value={form.colorName}
                onChange={e => setForm({ ...form, colorName: e.target.value })}
                className="w-full bg-[#161620] border border-[#282838] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Color Swatch Hex
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.colorHex}
                  onChange={e => setForm({ ...form, colorHex: e.target.value })}
                  className="w-8 h-8 rounded-xs border border-zinc-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={form.colorHex}
                  onChange={e => setForm({ ...form, colorHex: e.target.value })}
                  className="flex-1 bg-[#161620] border border-[#282838] py-2 px-3 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Inventory Stock by Size */}
          <div>
            <label className="block uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
              Stock Units per Available Size:
            </label>
            <div className="grid grid-cols-6 gap-2">
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5 text-center">XS</span>
                <input
                  type="number"
                  value={form.stockXS}
                  onChange={e => setForm({ ...form, stockXS: Number(e.target.value) })}
                  className="w-full bg-[#161620] border border-[#282838] py-1.5 px-2 text-center text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5 text-center">S</span>
                <input
                  type="number"
                  value={form.stockS}
                  onChange={e => setForm({ ...form, stockS: Number(e.target.value) })}
                  className="w-full bg-[#161620] border border-[#282838] py-1.5 px-2 text-center text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5 text-center">M</span>
                <input
                  type="number"
                  value={form.stockM}
                  onChange={e => setForm({ ...form, stockM: Number(e.target.value) })}
                  className="w-full bg-[#161620] border border-[#282838] py-1.5 px-2 text-center text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5 text-center">L</span>
                <input
                  type="number"
                  value={form.stockL}
                  onChange={e => setForm({ ...form, stockL: Number(e.target.value) })}
                  className="w-full bg-[#161620] border border-[#282838] py-1.5 px-2 text-center text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5 text-center">XL</span>
                <input
                  type="number"
                  value={form.stockXL}
                  onChange={e => setForm({ ...form, stockXL: Number(e.target.value) })}
                  className="w-full bg-[#161620] border border-[#282838] py-1.5 px-2 text-center text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block mb-0.5 text-center">XXL</span>
                <input
                  type="number"
                  value={form.stockXXL}
                  onChange={e => setForm({ ...form, stockXXL: Number(e.target.value) })}
                  className="w-full bg-[#161620] border border-[#282838] py-1.5 px-2 text-center text-white"
                />
              </div>
            </div>
          </div>

          {/* Description & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Fabric Details
              </label>
              <input
                type="text"
                value={form.fabric}
                onChange={e => setForm({ ...form, fabric: e.target.value })}
                className="w-full bg-[#161620] border border-[#282838] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
                Fit Silhouette
              </label>
              <input
                type="text"
                value={form.fit}
                onChange={e => setForm({ ...form, fit: e.target.value })}
                className="w-full bg-[#161620] border border-[#282838] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-zinc-300 mb-1 font-medium">
              Garment Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#161620] border border-[#282838] py-2 px-3 text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Badges Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2 pb-2 border-y border-[#20202c]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.isNewArrival}
                onChange={e => setForm({ ...form, isNewArrival: e.target.checked })}
                className="accent-[#d4af37]"
              />
              <span>Mark as New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={e => setForm({ ...form, isBestSeller: e.target.checked })}
                className="accent-[#d4af37]"
              />
              <span>Mark as Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                className="accent-[#d4af37]"
              />
              <span>Feature on Runway Drop</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="py-2.5 px-4 border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 bg-gold-metallic text-black font-semibold uppercase tracking-wider hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing to Store...' : 'Publish Garment to Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

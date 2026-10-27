import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  Shield,
  ChevronRight,
  Sparkles,
  Plus,
  Crown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    cart,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    setIsAddProductModalOpen,
    customerUser,
    customerLogout,
    setActiveView,
    setSelectedCategorySlug,
    categories,
    isAdminLoggedIn,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (view: string, categorySlug?: string) => {
    setActiveView(view);
    if (categorySlug !== undefined) {
      setSelectedCategorySlug(categorySlug);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0b0d]/95 backdrop-blur-md border-b border-[#22222a]">
      {/* Announcement Bar */}
      {settings.announcementActive && (
        <div className="bg-gradient-to-r from-[#18181f] via-[#241e12] to-[#18181f] border-b border-[#342b17] py-2 px-4 text-center text-xs tracking-wider font-medium text-[#e5c158]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0 animate-pulse" />
            <span className="truncate">{settings.announcementText}</span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile Menu Toggle & Brand Wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* CHHAVA Wordmark Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="text-left flex flex-col items-start group focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="font-brand text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-gold-gradient group-hover:opacity-90 transition-opacity">
                  CHHAVA
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-zinc-400 font-sans uppercase font-medium -mt-1 group-hover:text-zinc-200 transition-colors">
                Wear Your Identity
              </span>
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              onClick={() => handleNavClick('shop', 'all')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-300 hover:text-[#d4af37] transition-colors font-medium py-1"
            >
              Shop All
            </button>
            <button
              onClick={() => handleNavClick('shop', 'traditional-wear')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-300 hover:text-[#d4af37] transition-colors font-medium py-1"
            >
              Traditional
            </button>
            <button
              onClick={() => handleNavClick('shop', 'jackets')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-300 hover:text-[#d4af37] transition-colors font-medium py-1"
            >
              Jackets
            </button>
            <button
              onClick={() => handleNavClick('shop', 't-shirts')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-300 hover:text-[#d4af37] transition-colors font-medium py-1"
            >
              T-Shirts
            </button>
            <button
              onClick={() => handleNavClick('shop', 'shirts')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-300 hover:text-[#d4af37] transition-colors font-medium py-1"
            >
              Shirts
            </button>
            <button
              onClick={() => handleNavClick('shop', 'hoodies-and-sweatshirts')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-300 hover:text-[#d4af37] transition-colors font-medium py-1"
            >
              Hoodies
            </button>
            <button
              onClick={() => handleNavClick('shop', 'sale')}
              className="text-xs uppercase tracking-[0.16em] text-[#e5c158] hover:text-white transition-colors font-semibold py-1"
            >
              Sale
            </button>
            <button
              onClick={() => handleNavClick('brand-story')}
              className="text-xs uppercase tracking-[0.16em] text-zinc-400 hover:text-zinc-200 transition-colors font-medium py-1"
            >
              Story
            </button>
          </nav>

          {/* Right Actions: Search, Account, Wishlist, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-300 hover:text-[#d4af37] transition-colors focus:outline-none"
              aria-label="Search clothing"
              title="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Account / Auth */}
            <div className="relative">
              {customerUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 text-xs text-zinc-300 hover:text-[#d4af37] transition-colors"
                    aria-label="User account menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#1c1c24] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-semibold text-xs">
                      {customerUser.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#141419] border border-[#2b2b36] shadow-xl py-2 z-50 rounded-sm">
                      <div className="px-4 py-2 border-b border-[#2b2b36]">
                        <p className="text-xs text-zinc-400">Patron</p>
                        <p className="text-sm font-medium text-white truncate">{customerUser.name}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveView('track-order');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1e1e26] hover:text-[#d4af37] transition-colors"
                      >
                        Track Orders
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          customerLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#1e1e26] transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 text-zinc-300 hover:text-[#d4af37] transition-colors focus:outline-none"
                  aria-label="Sign in"
                  title="Sign in / Register"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-zinc-300 hover:text-[#d4af37] transition-colors focus:outline-none"
              aria-label="Open wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#d4af37] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 py-2 px-3 bg-[#171720] hover:bg-[#20202d] border border-[#2a2a38] text-white rounded-sm transition-all focus:outline-none group"
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wider">{totalCartCount}</span>
            </button>

            {/* Shop Owner: Add Product CTA */}
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 bg-[#241c0e] hover:bg-[#342713] border border-[#d4af37]/60 text-[#f7df94] text-xs font-semibold rounded-xs shadow-xs transition-all hover:scale-102 cursor-pointer"
              title="Shop Owner: Add New Product"
            >
              <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Admin Portal Quick Icon if logged in */}
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden sm:flex items-center gap-1 py-1 px-2.5 bg-[#2a2210] border border-[#d4af37]/40 text-[#f3ca52] text-xs font-semibold rounded-sm hover:bg-[#3d3215] transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-[#111116] border-r border-[#242430] h-full overflow-y-auto flex flex-col justify-between p-6 z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#242430]">
                <div>
                  <span className="font-brand text-xl font-bold tracking-[0.2em] text-gold-gradient">
                    CHHAVA
                  </span>
                  <p className="text-[9px] tracking-[0.25em] text-zinc-400">WEAR YOUR IDENTITY</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-1">
                <button
                  onClick={() => handleNavClick('shop', 'all')}
                  className="w-full flex items-center justify-between py-3 px-2 text-sm uppercase tracking-wider text-zinc-200 hover:text-[#d4af37] hover:bg-[#191922] transition-colors rounded-sm"
                >
                  <span>Shop All Collection</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleNavClick('shop', cat.slug)}
                    className="w-full flex items-center justify-between py-3 px-2 text-sm uppercase tracking-wider text-zinc-300 hover:text-[#d4af37] hover:bg-[#191922] transition-colors rounded-sm"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                ))}

                <button
                  onClick={() => handleNavClick('shop', 'sale')}
                  className="w-full flex items-center justify-between py-3 px-2 text-sm uppercase tracking-wider text-[#d4af37] font-semibold hover:bg-[#191922] transition-colors rounded-sm"
                >
                  <span>Sale & Archive</span>
                  <ChevronRight className="w-4 h-4 text-[#d4af37]" />
                </button>

                <button
                  onClick={() => handleNavClick('brand-story')}
                  className="w-full flex items-center justify-between py-3 px-2 text-sm uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-[#191922] transition-colors rounded-sm"
                >
                  <span>Our Heritage Story</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() => handleNavClick('track-order')}
                  className="w-full flex items-center justify-between py-3 px-2 text-sm uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-[#191922] transition-colors rounded-sm"
                >
                  <span>Track Your Order</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#242430] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAddProductModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#241c0e] border border-[#d4af37]/60 text-xs font-bold text-[#f7df94] hover:bg-[#342713] transition-colors rounded-xs shadow-md"
              >
                <Plus className="w-4 h-4 text-[#d4af37]" />
                <span>Shop Owner: + Add New Garment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('admin');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#181822] border border-[#2e2e3e] text-xs font-semibold text-zinc-300 hover:text-[#d4af37] transition-colors rounded-sm"
              >
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Admin Management Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

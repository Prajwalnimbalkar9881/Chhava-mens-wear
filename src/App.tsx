/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { HomepageSections } from './components/HomepageSections';
import { ProductListingPage } from './components/ProductListingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { BrandStory } from './components/BrandStory';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchDrawer } from './components/SearchDrawer';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AddProductModal } from './components/AddProductModal';
import { Footer } from './components/Footer';
import { PolicyModal } from './components/PolicyModal';

const MainLayout: React.FC = () => {
  const { activeView } = useShop();
  const [activePolicy, setActivePolicy] = useState<'shipping' | 'privacy' | 'terms' | 'contact' | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0d] text-[#f4f4f5]">
      {/* Top Header & Sticky Navigation (hide on full admin view for cleaner workspace or keep accessible) */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroBanner />
            <CategoryGrid />
            <HomepageSections />
          </>
        )}

        {activeView === 'shop' && <ProductListingPage />}

        {activeView === 'product-detail' && <ProductDetailPage />}

        {activeView === 'checkout' && <CheckoutPage />}

        {activeView === 'order-confirmation' && <OrderConfirmationPage />}

        {activeView === 'track-order' && <OrderTrackingPage />}

        {activeView === 'admin' && <AdminDashboard />}

        {activeView === 'brand-story' && <BrandStory />}
      </main>

      {/* Comprehensive Footer */}
      <Footer onOpenPolicy={setActivePolicy} />

      {/* Global Slide-Over Drawers & Interactive Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchDrawer />
      <CustomerAuthModal />
      <SizeGuideModal />
      <QuickViewModal />
      <AddProductModal />
      <PolicyModal policy={activePolicy} onClose={() => setActivePolicy(null)} />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}

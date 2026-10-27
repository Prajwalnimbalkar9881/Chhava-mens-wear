import { Product, Category, Coupon, SiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-tshirts',
    slug: 't-shirts',
    name: 'T-Shirts',
    description: 'Heavyweight Supima cotton tees crafted with dropped shoulders and minimalist gold accents.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'cat-shirts',
    slug: 'shirts',
    name: 'Shirts',
    description: 'Tailored Cuban collar, mandarin and structured linen-cotton shirts for refined evenings.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'cat-jeans',
    slug: 'jeans-and-trousers',
    name: 'Jeans & Trousers',
    description: 'Japanese selvedge denim and architectural pleated trousers tailored for supreme comfort.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'cat-hoodies',
    slug: 'hoodies-and-sweatshirts',
    name: 'Hoodies & Sweatshirts',
    description: '450 GSM ultra-heavy French Terry luxury streetwear engineered with high-density gold embroidery.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'cat-jackets',
    slug: 'jackets',
    name: 'Jackets',
    description: 'Bespoke bandhgala overshirts, structured trench silhouettes and matte leather bombers.',
    image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'cat-traditional',
    slug: 'traditional-wear',
    name: 'Traditional Wear',
    description: 'Regal contemporary Kurtas, handcrafted Bundis and Nehru Jackets inspired by timeless Maratha heritage.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
    featured: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'chv-01',
    sku: 'CHV-TRD-001',
    name: 'Sovereign Royal Black Kurta',
    tagline: 'Hand-woven Raw Silk with Subtle Gold Zari Collar',
    description: 'Designed for the modern aristocrat. The Sovereign Kurta balances crisp asymmetrical structure with opulent hand-spun silk. Adorned with 18k electroplated gold insignia buttons crafted exclusively for the CHHAVA house.',
    fabric: '80% Handloom Raw Silk, 20% Organic Mulberry Cotton',
    fit: 'Tailored Royal Fit (True to Indian sizes)',
    care: 'Dry Clean Only. Steam press at low heat.',
    category: 'traditional-wear',
    price: 4999,
    discountPrice: 3899,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Onyx Black & Gold', hex: '#0f0f10' },
      { name: 'Imperial Maroon', hex: '#4a121a' },
      { name: 'Ivory Gold', hex: '#f6f4ea' },
    ],
    sizes: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 4 },
    ],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 42,
    reviews: [
      {
        id: 'rev-1',
        author: 'Vikramaditya S.',
        location: 'Mumbai, Maharashtra',
        rating: 5,
        date: '2026-10-14',
        comment: 'The drape and the subtle gold finish is extraordinary. Wore this to a royal wedding reception and received non-stop compliments. True luxury.',
        verified: true,
      },
      {
        id: 'rev-2',
        author: 'Rohan Deshmukh',
        location: 'Pune, Maharashtra',
        rating: 5,
        date: '2026-10-02',
        comment: 'Worth every single rupee. The fabric breathes beautifully even in warm halls. CHHAVA is redefining Indian luxury fashion.',
        verified: true,
      }
    ],
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'chv-02',
    sku: 'CHV-JKT-002',
    name: 'Chhava Apex Bandhgala Bomber',
    tagline: 'Fusion of High-Altitude Bomber & Regal Mandarin Collar',
    description: 'An architectural jacket combining heavyweight Japanese twill with a royal bandhgala silhouette. Features custom brushed-gold dual zippers, internal welt passport pockets, and high-density matte insulation.',
    fabric: 'Heavyweight 360 GSM Cotton-Twill Blend with Satin Bemberg Lining',
    fit: 'Structured Boxy Silhouette',
    care: 'Specialist Dry Clean Only',
    category: 'jackets',
    price: 6499,
    discountPrice: 4999,
    images: [
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Charcoal Noir', hex: '#1a1a1f' },
      { name: 'Olive Drab', hex: '#2f3528' },
    ],
    sizes: [
      { size: 'M', stock: 10 },
      { size: 'L', stock: 14 },
      { size: 'XL', stock: 6 },
    ],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 38,
    reviews: [
      {
        id: 'rev-3',
        author: 'Arjun Kulkarni',
        location: 'Bengaluru, Karnataka',
        rating: 5,
        date: '2026-10-18',
        comment: 'The zipper hardware alone feels like something out of a Milan boutique. Sturdy, sharp and intensely masculine.',
        verified: true,
      }
    ],
    createdAt: '2026-10-05T12:00:00Z',
  },
  {
    id: 'chv-03',
    sku: 'CHV-TSH-003',
    name: 'Identity Monogram Heavy Tee',
    tagline: '280 GSM Combed Supima Cotton in Deep Midnight Black',
    description: 'The cornerstone of modern confidence. Made from extra-long staple Indian Supima cotton for an exceptionally smooth, dense hand-feel that retains structure wash after wash. Features micro-embroidered CHHAVA crest on the nape.',
    fabric: '100% Ultra-combed Supima Cotton (280 GSM)',
    fit: 'Relaxed Oversized Drop-Shoulder',
    care: 'Machine wash cold inside out, gentle cycle. Hang dry.',
    category: 't-shirts',
    price: 1999,
    discountPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0c' },
      { name: 'Warm Ecru', hex: '#eae5d9' },
      { name: 'Smoky Slate', hex: '#373a40' }
    ],
    sizes: [
      { size: 'S', stock: 24 },
      { size: 'M', stock: 35 },
      { size: 'L', stock: 40 },
      { size: 'XL', stock: 20 },
      { size: 'XXL', stock: 12 },
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 94,
    reviews: [
      {
        id: 'rev-4',
        author: 'Aditya Mehta',
        location: 'New Delhi',
        rating: 5,
        date: '2026-10-11',
        comment: 'This is the heavyweight t-shirt Indian streetwear was missing. Collar does not bacon, weight feels substantial and luxurious.',
        verified: true,
      }
    ],
    createdAt: '2026-09-20T08:00:00Z',
  },
  {
    id: 'chv-04',
    sku: 'CHV-SHR-004',
    name: 'Bespoke Textured Linen Shirt',
    tagline: 'French Flax Linen with Camp Collar & Coconut Husk Buttons',
    description: 'Effortless sophistication for daytime soirees and coastal getaways. Breathable European flax linen pre-washed for velvety softness, styled with a breezy Cuban lapel and clean French seams.',
    fabric: '100% Pure Certified European Flax Linen (180 GSM)',
    fit: 'Contemporary Relaxed Fit',
    care: 'Hand wash or delicate machine wash cold. Iron slightly damp.',
    category: 'shirts',
    price: 3299,
    discountPrice: 2499,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Sandstone Beige', hex: '#d7cbb5' },
      { name: 'Midnight Navy', hex: '#111827' },
      { name: 'Sage Moss', hex: '#4b5548' }
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 16 },
      { size: 'L', stock: 14 },
      { size: 'XL', stock: 7 },
    ],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 29,
    reviews: [
      {
        id: 'rev-5',
        author: 'Sameer Sen',
        location: 'Goa',
        rating: 5,
        date: '2026-10-08',
        comment: 'Pure elegance. Perfect for sunset sundowners. Breathability is 10/10.',
        verified: true,
      }
    ],
    createdAt: '2026-10-09T09:30:00Z',
  },
  {
    id: 'chv-05',
    sku: 'CHV-HD-005',
    name: 'Gilded Lionheart Heavy Hoodie',
    tagline: '460 GSM Brushed French Terry with Metallic Gold Cord Ends',
    description: 'Imbued with regal valor. The Gilded Lionheart hoodie is our most luxurious pullover. Featuring double-layered heavyweight hood, hidden internal kangaroo zip pouch, and gold tipped engraved aglets.',
    fabric: '100% Ring-Spun Heavyweight Cotton (460 GSM Fleece)',
    fit: 'Heavy Oversized Silhouette',
    care: 'Cold wash inside out. Lay flat to dry.',
    category: 'hoodies-and-sweatshirts',
    price: 4499,
    discountPrice: 3299,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Royal Matte Black', hex: '#121214' },
      { name: 'Rich Maroon', hex: '#40121a' }
    ],
    sizes: [
      { size: 'M', stock: 12 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 9 },
      { size: 'XXL', stock: 5 },
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    isSale: true,
    rating: 4.9,
    reviewCount: 65,
    reviews: [
      {
        id: 'rev-6',
        author: 'Karan Patil',
        location: 'Hyderabad, Telangana',
        rating: 5,
        date: '2026-10-16',
        comment: 'The hood stands upright without drooping because of the double-layer lining. The gold details give it an insane premium vibe.',
        verified: true,
      }
    ],
    createdAt: '2026-09-15T15:00:00Z',
  },
  {
    id: 'chv-06',
    sku: 'CHV-TRS-006',
    name: 'Architectural Pleated Trouser',
    tagline: 'High-Waisted Italian Wool-Blend with Deep Double Front Pleats',
    description: 'Merging bespoke British tailoring with contemporary Tokyo street volume. Crafted with a tapered ankle break, inner curtain waistband, and custom horn buttons.',
    fabric: '65% Fine Merino Wool Blend, 35% Technical Lyocell',
    fit: 'High-Rise Relaxed Taper',
    care: 'Dry Clean Preferred. Cool iron.',
    category: 'jeans-and-trousers',
    price: 3999,
    discountPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#17171a' },
      { name: 'Graphite Grey', hex: '#373a40' },
      { name: 'Taupe Khaki', hex: '#8a8275' }
    ],
    sizes: [
      { size: 'S', stock: 7 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 6 },
    ],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 22,
    reviews: [
      {
        id: 'rev-7',
        author: 'Dhruv Rao',
        location: 'Ahmedabad, Gujarat',
        rating: 5,
        date: '2026-10-19',
        comment: 'Drapes like a bespoke Savile Row piece. The pleats stay razor-sharp.',
        verified: true,
      }
    ],
    createdAt: '2026-10-10T11:00:00Z',
  },
  {
    id: 'chv-07',
    sku: 'CHV-TRD-007',
    name: 'Maratha Heritage Bundi Vest',
    tagline: 'Quilted Raw Silk Bundi Jacket with Antique Brass Badges',
    description: 'A sovereign layer designed to be draped over kurtas or dress shirts. Traditional diamond quilting filled with organic cotton, finished with handcrafted antique brass buttons engraved with the CHHAVA crest.',
    fabric: 'Pure Matka Silk with Handloom Cotton Lining',
    fit: 'Tailored Sleeveless Silhouette',
    care: 'Dry Clean Only',
    category: 'traditional-wear',
    price: 5299,
    discountPrice: 3999,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Gilded Royal Ochre', hex: '#a67c1e' },
      { name: 'Midnight Charcoal', hex: '#1f1f24' }
    ],
    sizes: [
      { size: 'M', stock: 8 },
      { size: 'L', stock: 11 },
      { size: 'XL', stock: 5 },
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    reviews: [],
    createdAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'chv-08',
    sku: 'CHV-TSH-008',
    name: 'Chhava Warrior Acid-Wash Tee',
    tagline: 'Distressed Vintage Wash with Distorted Gold Typography',
    description: 'Individually garment-dyed and mineral washed for an authentic one-of-one vintage patina. Emblazoned with the iconic "WEAR YOUR IDENTITY" typography.',
    fabric: '100% Vintage Washed Combed Cotton (260 GSM)',
    fit: 'Drop-Shoulder Boxy',
    care: 'Machine wash cold. Do not tumble dry.',
    category: 't-shirts',
    price: 2199,
    discountPrice: 1699,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'
    ],
    colors: [
      { name: 'Vintage Acid Slate', hex: '#2c2e35' },
      { name: 'Washed Earth', hex: '#483f38' }
    ],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 14 },
    ],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 18,
    reviews: [],
    createdAt: '2026-10-15T14:20:00Z',
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'CHHAVA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 1000,
    description: '10% instant off on all orders above ₹999 (Max ₹1000)',
    isActive: true,
  },
  {
    code: 'FIRST500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2499,
    description: 'Flat ₹500 off on your first order above ₹2499',
    isActive: true,
  },
  {
    code: 'ROYALFEST',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 3999,
    maxDiscount: 1500,
    description: '15% Royal Festive privilege discount above ₹3999',
    isActive: true,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  announcementText: 'FESTIVE PRIVILEGE: ENJOY COMPLIMENTARY EXPRESS DISPATCH ACROSS INDIA & 10% OFF WITH CODE "CHHAVA10"',
  announcementActive: true,
  heroHeadline: 'FORGED WITH FEARLESS PRIDE.',
  heroSubheadline: 'Handcrafted luxury apparel blending timeless Indian valor with modern streetwear silhouettes. Designed for those who rule their world.',
  promotionalOfferText: 'LIMITED EDITION HERITAGE DROP — ONLY 100 PIECES PER SILHOUETTE',
  freeShippingThreshold: 1499,
};

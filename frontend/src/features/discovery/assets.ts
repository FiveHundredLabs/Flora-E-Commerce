/**
 * Curated High-Resolution Botanical Photographic Assets
 * Matches the Florial luxury editorial floral aesthetic.
 * All product and store photos are verified high-resolution photography with clean styling.
 */

export interface BotanicalPhoto {
  primary: string;
  secondary?: string;
  alt: string;
}

export interface BotanicalStorePhoto {
  primary: string;
  thumbnail: string;
  alt: string;
  source?: string;
}

export interface BotanicalCategoryPhoto {
  primary: string;
  thumbnail: string;
  alt: string;
  source?: string;
}

/**
 * Verified Real Sample Product Photography
 */
export const botanicalProducts: Record<string, BotanicalPhoto> = {
  'morning-bouquet': {
    primary: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Elegant hand-tied bouquet of blooming white peonies, soft garden roses, and silver-dollar eucalyptus in soft natural daylight',
  },
  'gathered-stems': {
    primary: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Breezy arrangement of fresh meadow wildflowers, tiny chamomile blossoms, larkspur, and assorted greenery in a clear glass vessel',
  },
  'little-fern': {
    primary: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1545165375-1b744b9ed444?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vibrant green indoor fern potted in a handcrafted textured ceramic bowl standing on natural wood legs',
  },
  'leafy-companion': {
    primary: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sculptural potted Monstera deliciosa with fenestrated leaves in a minimalist neutral stoneware container on a wooden plant stand',
  },
  'quiet-blooms': {
    primary: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80',
    alt: 'Handcrafted parcel of romantic blush garden roses and cream blooms wrapped in brown artisan kraft paper with twine',
  },
  'table-garden': {
    primary: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Living tabletop arrangement of assorted geometric succulents and soft moss in a shallow textured ceramic bowl',
  },
  'garden-stems': {
    primary: 'https://images.unsplash.com/photo-1589244159943-460088ed5c92?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1760618511460-44d991a10c58?auto=format&fit=crop&w=1200&q=80',
    alt: 'Generous cloud-like arrangement of fresh-cut garden hydrangeas and eucalyptus stems in a transparent glass vase',
  },
  'afternoon-flowers': {
    primary: 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
    alt: 'Radiant celebration bouquet composed of bright golden sunflowers, warm yellow garden roses, and vibrant celebration stems',
  },
  // Additional catalogue items
  'sunny-meadow': {
    primary: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golden sunflowers and yellow ranunculus in summer meadow bouquet',
  },
  'velvet-dahlia': {
    primary: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dramatic deep burgundy dahlias and dark chocolate cosmos bouquet',
  },
  'pure-lily': {
    primary: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1200&q=80',
    alt: 'Fragrant white oriental Casablanca lilies with glossy foliage',
  },
  'botanical-wonder': {
    primary: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
    alt: 'Monstera deliciosa and tropical palm arrangement in terracotta vessel',
  },
};

/**
 * Verified Real Sample Supplier Store Photography
 */
export const botanicalStores: Record<string, BotanicalStorePhoto> = {
  'willow-stem': {
    primary: 'https://images.unsplash.com/photo-1639696194673-67b86204b885?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1639696194673-67b86204b885?auto=format&fit=crop&w=400&q=80',
    alt: 'Rustic artisanal florist studio interior featuring natural reclaimed wood shelves, hanging dried florals, and freshly gathered organic stems',
  },
  'fern-house': {
    primary: 'https://images.unsplash.com/photo-1772907952251-09e722aafa6a?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1772907952251-09e722aafa6a?auto=format&fit=crop&w=400&q=80',
    alt: 'Sun-drenched glasshouse plant nursery filled with lush potted ferns, tropical hanging greenery, and verdant botanical displays',
  },
  'petal-room': {
    primary: 'https://images.unsplash.com/photo-1740297224094-8adce5e1286c?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1740297224094-8adce5e1286c?auto=format&fit=crop&w=400&q=80',
    alt: 'Flower boutique display filled with roses, leafy plants, and arranged blooms',
    source: 'https://unsplash.com/photos/a-display-of-flowers-in-a-flower-shop-AZ7tXcQcchg',
  },
  'garden-notes': {
    primary: 'https://images.unsplash.com/photo-1791736666714-dd9210aeb424?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1791736666714-dd9210aeb424?auto=format&fit=crop&w=400&q=80',
    alt: 'Contemporary flower shop interior with bouquets arranged in vases and on tables',
    source: 'https://unsplash.com/photos/flower-shop-interior-with-floral-bouquets-Qk5ZKKPJ5H8',
  },
  'cedar-bloom': {
    primary: 'https://images.unsplash.com/photo-1785721073831-565f8d0f094f?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1785721073831-565f8d0f094f?auto=format&fit=crop&w=400&q=80',
    alt: 'Warm florist studio display with dried flowers and softly textured botanical stems',
    source: 'https://unsplash.com/photos/dried-flowers-next-to-a-framed-hc7zUpHeH8A',
  },
  'orchid-lane': {
    primary: 'https://images.unsplash.com/photo-1699618584607-2a6c0d5cc3f0?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1699618584607-2a6c0d5cc3f0?auto=format&fit=crop&w=400&q=80',
    alt: 'White orchids cascading among green foliage inside a bright greenhouse',
    source: 'https://unsplash.com/photos/a-large-white-flower-in-a-green-house-Heq_G_tzd1w',
  },
  'moss-petal': {
    primary: 'https://images.unsplash.com/photo-1776996876078-ffb079c26f6e?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1776996876078-ffb079c26f6e?auto=format&fit=crop&w=400&q=80',
    alt: 'Lush greenhouse aisle filled with tropical foliage, potted plants, and flowers',
    source: 'https://unsplash.com/photos/lush-greenhouse-filled-with-diverse-plants-and-flowers-AUgafD40Ckw',
  },
  'rosewood-florals': {
    primary: 'https://images.unsplash.com/photo-1767824122857-9a1521db58d3?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1767824122857-9a1521db58d3?auto=format&fit=crop&w=400&q=80',
    alt: 'Rich red rose bouquet wrapped with delicate white filler flowers',
    source: 'https://unsplash.com/photos/a-person-holding-a-bouquet-of-red-roses-xP0RKsjaY0U',
  },
  'wildflower-atelier': {
    primary: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=400&q=80',
    alt: 'Loose meadow flowers and delicate botanical stems arranged in clear glass vessels',
    source: 'https://unsplash.com/s/photos/wildflowers',
  },
  'everleaf-studio': {
    primary: 'https://images.unsplash.com/photo-1600437731118-e87ada85832a?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600437731118-e87ada85832a?auto=format&fit=crop&w=400&q=80',
    alt: 'Light-filled plant shop with potted greenery arranged on natural wood shelving',
    source: 'https://unsplash.com/s/photos/plant-shop',
  },
};

/**
 * Botanical Category Showcase Photos
 */
export const botanicalCategories: Record<string, BotanicalCategoryPhoto> = {
  bouquets: {
    primary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80',
    alt: 'Luxurious artisan hand-tied bouquet filled with layered pastel roses, delicate seasonal blooms, and aromatic botanical foliage',
  },
  stems: {
    primary: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=400&q=80',
    alt: 'Curated assortment of delicate single-variety botanical stems and fresh meadow flowers styled in clear glass vases',
  },
  plants: {
    primary: 'https://images.unsplash.com/photo-1600437731118-e87ada85832a?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1600437731118-e87ada85832a?auto=format&fit=crop&w=400&q=80',
    alt: 'Light-filled botanical shop display with architectural indoor houseplants, cascading ferns, and ceramic pots on blonde wood shelving',
  },
  roses: {
    primary: 'https://images.unsplash.com/photo-1767824122857-9a1521db58d3?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1767824122857-9a1521db58d3?auto=format&fit=crop&w=400&q=80',
    alt: 'Hand-held bouquet of deep red roses with delicate white filler flowers',
    source: 'https://unsplash.com/photos/a-person-holding-a-bouquet-of-red-roses-xP0RKsjaY0U',
  },
  orchids: {
    primary: 'https://images.unsplash.com/photo-1694422485768-db8dbc366b80?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1694422485768-db8dbc366b80?auto=format&fit=crop&w=400&q=80',
    alt: 'Cascading pink orchids displayed inside a sunlit glass greenhouse',
    source: 'https://unsplash.com/photos/un-bouquet-de-fleurs-qui-sont-a-linterieur-dun-batiment-PRnaoz8KPv8',
  },
  'gift-sets': {
    primary: 'https://images.unsplash.com/photo-1581264692636-3cf6f29655c2?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581264692636-3cf6f29655c2?auto=format&fit=crop&w=400&q=80',
    alt: 'Red roses and small white flowers presented in an elegant gift box',
    source: 'https://unsplash.com/s/photos/flower-gift',
  },
  'wedding-flowers': {
    primary: 'https://images.unsplash.com/photo-1737498205256-52157504a8ed?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1737498205256-52157504a8ed?auto=format&fit=crop&w=400&q=80',
    alt: 'Bride holding a white rose wedding bouquet with eucalyptus and baby’s breath',
    source: 'https://unsplash.com/photos/a-bride-holding-a-bouquet-of-white-flowers-nG0NTufuJWY',
  },
  'dried-flowers': {
    primary: 'https://images.unsplash.com/photo-1728931935943-0d7b67f99f23?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1728931935943-0d7b67f99f23?auto=format&fit=crop&w=400&q=80',
    alt: 'Blue and purple dried flowers arranged as a botanical flat lay',
    source: 'https://unsplash.com/photos/a-collection-of-dried-flowers-on-a-white-surface-1ICCvx5wRnA',
  },
};

/** Default fallback bouquet */
export const defaultBouquetPhoto: BotanicalPhoto = {
  primary: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
  secondary: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80',
  alt: 'Artisanal seasonal flower bouquet',
};

/**
 * Editorial Florist Models
 */
export const floristModels = {
  heroWhiteTulips: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1100&q=85',
  catalogStrawHat: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  birthdaySpotlight: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=900&q=85',
  showroomThumbsUp: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85',
  teamFlorist1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
  teamFlorist2: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85',
  teamFlorist3: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
};

/**
 * Hot Category Showcase Circular Images
 */
export const categoryCirculars = {
  bespoke: {
    title: 'Bespoke',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=85',
    link: '/shops?category=bouquets',
    count: '12 items',
  },
  birthday: {
    title: 'Birthday',
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=600&q=85',
    link: '/shops?category=bouquets',
    count: '8 items',
  },
  nextDay: {
    title: 'Next Day',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=85',
    link: '/shops?category=stems',
    count: '9 items',
  },
  plant: {
    title: 'Plant',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=85',
    link: '/shops?category=plants',
    count: '8 items',
  },
};

/**
 * Asymmetric 3-Column Promo Banners
 */
export const promoBanners = {
  springCollection: {
    title: 'Spring Collection',
    subtitle: 'Fresh peony & rose harmonies',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85',
    link: '/shops?category=bouquets',
    action: 'Discover Now',
  },
  simpleElegant: {
    title: 'Simple & Elegant',
    subtitle: 'Minimalist white lilies & stems',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=85',
    link: '/shops?category=stems',
    action: 'Discover Now',
  },
  summerLoving: {
    title: 'Summer Loving',
    subtitle: 'Warm golden sunflowers & wild greens',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=85',
    link: '/shops?category=bouquets',
    action: 'Discover Now',
  },
};

/**
 * Flower Subscriptions
 */
export const flowerSubscriptions = [
  {
    frequency: 'Weekly Subscription',
    price: '$32.00 / week',
    savings: 'Save 20%',
    desc: 'A hand-crafted seasonal arrangement hand-delivered to your door every Friday morning.',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=85',
  },
  {
    frequency: 'Bi-Weekly Subscription',
    price: '$42.00 / 2 weeks',
    savings: 'Save 15%',
    desc: 'Freshly harvested botanical arrangements refreshed twice a month for sustained living vitality.',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=85',
    featured: true,
  },
  {
    frequency: 'Monthly Subscription',
    price: '$55.00 / month',
    savings: 'Save 10%',
    desc: 'An opulent luxury centerpiece celebrating the finest blooms in peak seasonal rotation.',
    image: 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?auto=format&fit=crop&w=600&q=85',
  },
];

/**
 * Blog Editorial Stories
 */
export const blogStories = [
  {
    title: 'How to Care for Your Peonies to Prolong Vase Radiance',
    date: 'Nov 18, 2026',
    author: 'Elena Gomez',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'Behind the Blooms: A Day in Our Sustainable Glasshouses',
    date: 'Nov 12, 2026',
    author: 'Ruwan Silva',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=85',
  },
  {
    title: 'The Art of Mindful Ikebana: Creating Balance with Garden Stems',
    date: 'Nov 04, 2026',
    author: 'Mei Lin',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=700&q=85',
  },
];

/**
 * About Page Gallery & Textures
 */
export const aboutAssets = {
  petalBanner: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1600&q=85',
  showroomPhoto: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85',
  team: [
    {
      name: 'Amara Senanayake',
      role: 'Master Floral Designer',
      image: floristModels.teamFlorist1,
      bio: 'Over 14 years specializing in heirloom roses and architectural botanical installations.',
    },
    {
      name: 'Nishan Mendis',
      role: 'Highland Horticulturist',
      image: floristModels.teamFlorist2,
      bio: 'Cultivates native highland orchids and promotes chemical-free slow flower agriculture.',
    },
    {
      name: 'Kavindi Perera',
      role: 'Botanical Stylist',
      image: floristModels.teamFlorist3,
      bio: 'Blends Japanese minimalist ikebana techniques with Sri Lankan tropical foliage.',
    },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=85',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=85',
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=85',
    'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=600&q=85',
  ],
  testimonials: [
    {
      name: 'ANN SMITH',
      role: 'Verified Customer',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=85',
      text: 'The Morning Bouquet arrived fresh with dewdrops still clinging to the petals. The presentation and fragrance transformed our living room completely.',
    },
    {
      name: 'ARIANNA DOE',
      role: 'Corporate Member',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=85',
      text: 'Ordering from local studios directly through Flower & Flora has elevated all of our showroom openings. The flower quality is unmatched.',
    },
    {
      name: 'JANE CLINTON',
      role: 'Subscriber',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=85',
      text: 'The bi-weekly subscription is the absolute best gift I ever gave myself. Every two weeks brings a whole new seasonal poetry into my studio.',
    },
  ],
};

/**
 * Accessors
 */
export function getProductPhoto(slug?: string): BotanicalPhoto {
  if (!slug) return defaultBouquetPhoto;
  return botanicalProducts[slug] ?? defaultBouquetPhoto;
}

export function getStorePhoto(slug?: string): BotanicalStorePhoto | undefined {
  if (!slug) return undefined;
  return botanicalStores[slug];
}

export function getCategoryPhoto(category?: string): BotanicalCategoryPhoto | undefined {
  if (!category) return undefined;
  return botanicalCategories[category];
}

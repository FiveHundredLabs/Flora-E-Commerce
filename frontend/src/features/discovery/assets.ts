/**
 * Curated High-Resolution Botanical Photographic Assets
 * Matches the Florial luxury editorial floral aesthetic.
 * All product photos are high-res floral bouquets with clean/transparent backgrounds
 * and soft drop shadows, paired with elegant florist model portraiture.
 */

export interface BotanicalPhoto {
  primary: string;
  secondary?: string;
  alt: string;
}

export const botanicalProducts: Record<string, BotanicalPhoto> = {
  'morning-bouquet': {
    primary: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85',
    alt: 'Hand-tied morning bouquet of white peonies, garden roses and fresh eucalyptus',
  },
  'gathered-stems': {
    primary: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=85',
    alt: 'Gathered meadow stems with larkspur, chamomile and wildflower greenery',
  },
  'little-fern': {
    primary: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=85',
    alt: 'Lush potted indoor maidenhair fern in artisan ceramic planter',
  },
  'leafy-companion': {
    primary: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85',
    alt: 'Sculptural potted ficus lyrata fiddle-leaf fig in matte pot',
  },
  'quiet-blooms': {
    primary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85',
    alt: 'Soft blush roses and cream ranunculus in gentle paper wrapping',
  },
  'table-garden': {
    primary: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85',
    alt: 'Living table garden featuring miniature succulents and moss arrangement',
  },
  'garden-stems': {
    primary: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
    alt: 'Open garden stems of hydrangeas, lisianthus and wild thyme',
  },
  'afternoon-flowers': {
    primary: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=85',
    alt: 'Vibrant afternoon celebration bouquet of yellow roses and ranunculus',
  },
  // Additional catalogue items
  'sunny-meadow': {
    primary: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
    alt: 'Golden sunflowers and yellow ranunculus in summer meadow bouquet',
  },
  'velvet-dahlia': {
    primary: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85',
    alt: 'Dramatic deep burgundy dahlias and dark chocolate cosmos bouquet',
  },
  'pure-lily': {
    primary: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85',
    alt: 'Fragrant white oriental Casablanca lilies with glossy foliage',
  },
  'botanical-wonder': {
    primary: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=85',
    secondary: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85',
    alt: 'Monstera deliciosa and tropical palm arrangement in terracotta vessel',
  },
};

/** Default fallback bouquet */
export const defaultBouquetPhoto: BotanicalPhoto = {
  primary: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=85',
  secondary: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=85',
  alt: 'Artisanal seasonal flower bouquet',
};

/**
 * Editorial Florist Models (as seen in screenshots 1, 2, 3, 4, 5)
 */
export const floristModels = {
  // Screenshot 5 hero slider: Model holding white tulips
  heroWhiteTulips: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1100&q=85',
  // Screenshot 3 catalog banner: Model with straw hat holding bright flowers
  catalogStrawHat: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  // Screenshot 5 mid-page spotlight: Florist holding bright yellow bouquet
  birthdaySpotlight: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=900&q=85',
  // Screenshot 4 about showroom: Florist with white lilies giving thumbs up
  showroomThumbsUp: 'https://images.unsplash.com/photo-1558350315-8aa00827a5fe?auto=format&fit=crop&w=1000&q=85',
  // Screenshot 4 team portraits
  teamFlorist1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
  teamFlorist2: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85',
  teamFlorist3: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
};

/**
 * Hot Category Showcase Circular Images (Screenshot 5 & 3)
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
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=85',
    link: '/shops?category=plants',
    count: '8 items',
  },
};

/**
 * Asymmetric 3-Column Promo Banners (Screenshot 5)
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
 * Flower Subscriptions (Screenshot 5)
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
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=600&q=85',
  },
];

/**
 * Blog Editorial Stories (Screenshot 5)
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
    image: 'https://images.unsplash.com/photo-1558350315-8aa00827a5fe?auto=format&fit=crop&w=700&q=85',
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
 * About Page Gallery & Textures (Screenshot 4)
 */
export const aboutAssets = {
  petalBanner: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1600&q=85',
  showroomPhoto: 'https://images.unsplash.com/photo-1558350315-8aa00827a5fe?auto=format&fit=crop&w=900&q=85',
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
 * Safe Botanical Image component with image fallback and soft shadow
 */
export function getProductPhoto(slug?: string): BotanicalPhoto {
  if (!slug) return defaultBouquetPhoto;
  return botanicalProducts[slug] ?? defaultBouquetPhoto;
}

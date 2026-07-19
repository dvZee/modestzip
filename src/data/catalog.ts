export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  specs: string[];
  sizes: string[];
  inStock: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
  date: string;
}

export const initialProducts: Product[] = [
  {
    id: 'prod-plum-01',
    title: 'Aura Pleated Plum Abaya',
    price: 5499,
    originalPrice: 6499,
    category: 'Abayas',
    image: '/assets/product-plum.jpg',
    description: 'Elevate your modesty with the Aura Abaya, featuring structured front pleats and a relaxed silhouette in premium, breathable georgette-crepe. Crafted in a rich plum-burgundy hue, this piece blends timeless elegance with everyday comfort.',
    specs: [
      'Fabric: Premium Korean Georgette-Crepe',
      'Detailing: Elegant vertical pin-pleats on front and cuffs',
      'Inclusions: Matching Plum Chiffon Hijab (72" x 28")',
      'Fit: Loose, flowing A-line silhouette',
      'Care: Hand wash or dry clean recommended'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    seoTitle: 'Aura Pleated Plum Abaya - Premium Modest Wear Pakistan | ModestZip',
    seoDescription: 'Buy the Aura Pleated Plum Abaya online at ModestZip. Elegant burgundy-plum crepe abaya with front pleat detailing. Free shipping across Pakistan.'
  },
  {
    id: 'prod-black-02',
    title: 'Silk-Satin Midnight Black Abaya',
    price: 5999,
    originalPrice: 7200,
    category: 'Abayas',
    image: '/assets/product-black.jpg',
    description: 'A masterpiece of understated luxury. Made from ultra-soft, premium silk-satin blend, this black Abaya features custom tassel sleeve details and a flowing drape. It is the ultimate statement of modesty and sophistication.',
    specs: [
      'Fabric: Premium Silk-Satin Blend',
      'Detailing: Cuffs with adjustable silk drawstrings & tassels',
      'Inclusions: Premium Satin-Bordered Chiffon Hijab (72" x 28")',
      'Fit: Front open style with press-buttons',
      'Care: Dry clean only to preserve satin sheen'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    seoTitle: 'Silk-Satin Midnight Black Abaya - Tassel Sleeve Edit | ModestZip',
    seoDescription: 'Shop the luxurious Midnight Black Silk-Satin Abaya at ModestZip. Features delicate sleeve tassels and premium drape. Perfect for special occasions in Pakistan.'
  },
  {
    id: 'prod-teal-03',
    title: 'Zephyr Teal Pleated Abaya',
    price: 5699,
    originalPrice: 6800,
    category: 'Abayas',
    image: '/assets/product-teal.jpg',
    description: 'Adorn yourself in the Zephyr Abaya, showcasing a stunning deep teal shade and delicate pleating along the shoulders. Crafted from lightweight, high-grade crinkle fabric, it offers a sophisticated drape and breathable fit for all seasons.',
    specs: [
      'Fabric: High-grade Crinkle Georgette',
      'Detailing: Exquisite shoulder pleating and drop-shoulder sleeve cuffs',
      'Inclusions: Matching Teal Chiffon Hijab (72" x 28")',
      'Fit: Relaxed modern drape',
      'Care: Cool machine wash, no ironing required'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    seoTitle: 'Zephyr Teal Pleated Abaya - Crinkle Georgette Modest Wear | ModestZip',
    seoDescription: 'Discover the Zephyr Teal Pleated Abaya at ModestZip. Premium teal abaya made with lightweight crinkle georgette, featuring shoulder pleats. Order now!'
  }
];

// LocalStorage Helpers
const PRODUCTS_KEY = 'modestzip_products';
const ORDERS_KEY = 'modestzip_orders';

export const getDBProducts = (): Product[] => {
  if (typeof window === 'undefined') return initialProducts;
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
  return JSON.parse(data);
};

export const saveDBProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getDBOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDBOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

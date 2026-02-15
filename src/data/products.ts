import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export type ProductCategory = "charger" | "jump-starter" | "compressor";

export interface Product {
  id: number;
  image: string;
  images?: string[];
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  category: ProductCategory;
  brand: string;
  description?: string;
  specs?: Record<string, string>;
  sku?: string;
  inStock?: boolean;
}

export const categoryLabels: Record<ProductCategory, string> = {
  charger: "12/24V Car Battery Charger",
  "jump-starter": "Jump Starter (Booster)",
  compressor: "Compressor",
};

export const products: Product[] = [
  {
    id: 1, image: product1, name: "Smart 12V Battery Charger with LCD Display",
    price: 49.99, originalPrice: 69.99, rating: 4.8, reviews: 234,
    badge: "Best Seller", category: "charger", brand: "VoltMax",
  },
  {
    id: 2, image: product2, name: "Heavy Duty Jump Starter & Battery Booster",
    price: 129.99, rating: 4.9, reviews: 189, badge: "Pro",
    category: "jump-starter", brand: "PowerPro",
  },
  {
    id: 3, image: product3, name: "Portable 12V Air Compressor Tire Inflator",
    price: 79.99, originalPrice: 99.99, rating: 4.6, reviews: 156, badge: "Eco",
    category: "compressor", brand: "AirTech",
  },
  {
    id: 4, image: product4, name: "Multi-Stage 24V Battery Charger Maintainer",
    price: 189.99, rating: 5.0, reviews: 98,
    category: "charger", brand: "ChargeMaster",
  },
  {
    id: 5, image: product1, name: "Compact 6V/12V Automatic Battery Charger",
    price: 34.99, originalPrice: 44.99, rating: 4.5, reviews: 312, badge: "Sale",
    category: "charger", brand: "VoltMax",
  },
  {
    id: 6, image: product2, name: "Professional 2000A Jump Starter Booster Pack",
    price: 249.99, rating: 4.9, reviews: 67, badge: "Pro",
    category: "jump-starter", brand: "PowerPro",
  },
  {
    id: 7, image: product3, name: "Heavy Duty Digital Air Compressor 150PSI",
    price: 89.99, rating: 4.7, reviews: 145,
    category: "compressor", brand: "AirTech",
  },
  {
    id: 8, image: product4, name: "Lithium-Ion Battery Smart Charger 12/24V",
    price: 59.99, originalPrice: 79.99, rating: 4.8, reviews: 203, badge: "New",
    category: "charger", brand: "ChargeMaster",
  },
  {
    id: 9, image: product1, name: "Mini Portable Jump Starter 1500A",
    price: 29.99, rating: 4.6, reviews: 421, badge: "Best Seller",
    category: "jump-starter", brand: "VoltMax",
  },
  {
    id: 10, image: product2, name: "Dual Bank Onboard 12V Battery Charger",
    price: 169.99, rating: 4.7, reviews: 88,
    category: "charger", brand: "PowerPro",
  },
  {
    id: 11, image: product3, name: "Cordless Tire Inflator Air Compressor",
    price: 109.99, originalPrice: 139.99, rating: 4.8, reviews: 176, badge: "Sale",
    category: "compressor", brand: "AirTech",
  },
  {
    id: 12, image: product4, name: "Ultra-Fast 50A Battery Charger Station",
    price: 349.99, rating: 4.9, reviews: 42, badge: "Pro",
    category: "charger", brand: "ChargeMaster",
  },
  {
    id: 13, image: product1, name: "Emergency Jump Starter with Air Compressor",
    price: 199.99, rating: 4.4, reviews: 567,
    category: "jump-starter", brand: "PowerPro",
  },
  {
    id: 14, image: product2, name: "RV & Camper 24V Battery Charging System",
    price: 199.99, originalPrice: 249.99, rating: 4.7, reviews: 134,
    category: "charger", brand: "VoltMax",
  },
  {
    id: 15, image: product3, name: "Compact Portable Air Compressor 12V",
    price: 69.99, rating: 4.5, reviews: 198, badge: "Eco",
    category: "compressor", brand: "AirTech",
  },
  {
    id: 16, image: product4, name: "Workshop Multi-Battery Charging Station",
    price: 449.99, rating: 5.0, reviews: 31, badge: "Pro",
    category: "charger", brand: "ChargeMaster",
  },
  {
    id: 17, image: product1, name: "Cold Weather Jump Starter Booster 3000A",
    price: 94.99, originalPrice: 119.99, rating: 4.6, reviews: 89, badge: "New",
    category: "jump-starter", brand: "VoltMax",
  },
  {
    id: 18, image: product2, name: "Portable Emergency Battery Pack 2000A",
    price: 159.99, rating: 4.8, reviews: 256, badge: "Best Seller",
    category: "jump-starter", brand: "PowerPro",
  },
  {
    id: 19, image: product3, name: "Digital Tire Inflator with Pressure Gauge",
    price: 74.99, rating: 4.3, reviews: 112,
    category: "compressor", brand: "AirTech",
  },
];

export const brands = [...new Set(products.map((p) => p.brand))];

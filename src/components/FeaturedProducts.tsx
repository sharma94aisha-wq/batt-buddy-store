import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

type ProductCategory = "all" | "charger" | "jump-starter" | "compressor";

const categories: { value: ProductCategory; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "charger", label: "12/24V Car Battery Charger" },
  { value: "jump-starter", label: "Jump Starter (Booster)" },
  { value: "compressor", label: "Compressor" },
];

const products = [
  {
    id: 1,
    image: product1,
    name: "Smart 12V Battery Charger with LCD Display",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 234,
    badge: "Best Seller",
    category: "charger" as ProductCategory,
  },
  {
    id: 2,
    image: product2,
    name: "Heavy Duty Jump Starter & Battery Booster",
    price: 129.99,
    rating: 4.9,
    reviews: 189,
    badge: "Pro",
    category: "jump-starter" as ProductCategory,
  },
  {
    id: 3,
    image: product3,
    name: "Portable 12V Air Compressor Tire Inflator",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 156,
    badge: "Eco",
    category: "compressor" as ProductCategory,
  },
  {
    id: 4,
    image: product4,
    name: "Multi-Stage 24V Battery Charger Maintainer",
    price: 189.99,
    rating: 5.0,
    reviews: 98,
    category: "charger" as ProductCategory,
  },
  {
    id: 5,
    image: product1,
    name: "Compact 6V/12V Automatic Battery Charger",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviews: 312,
    badge: "Sale",
    category: "charger" as ProductCategory,
  },
  {
    id: 6,
    image: product2,
    name: "Professional 2000A Jump Starter Booster Pack",
    price: 249.99,
    rating: 4.9,
    reviews: 67,
    badge: "Pro",
    category: "jump-starter" as ProductCategory,
  },
  {
    id: 7,
    image: product3,
    name: "Heavy Duty Digital Air Compressor 150PSI",
    price: 89.99,
    rating: 4.7,
    reviews: 145,
    category: "compressor" as ProductCategory,
  },
  {
    id: 8,
    image: product4,
    name: "Lithium-Ion Battery Smart Charger 12/24V",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviews: 203,
    badge: "New",
    category: "charger" as ProductCategory,
  },
  {
    id: 9,
    image: product1,
    name: "Mini Portable Jump Starter 1500A",
    price: 29.99,
    rating: 4.6,
    reviews: 421,
    badge: "Best Seller",
    category: "jump-starter" as ProductCategory,
  },
  {
    id: 10,
    image: product2,
    name: "Dual Bank Onboard 12V Battery Charger",
    price: 169.99,
    rating: 4.7,
    reviews: 88,
    category: "charger" as ProductCategory,
  },
  {
    id: 11,
    image: product3,
    name: "Cordless Tire Inflator Air Compressor",
    price: 109.99,
    originalPrice: 139.99,
    rating: 4.8,
    reviews: 176,
    badge: "Sale",
    category: "compressor" as ProductCategory,
  },
  {
    id: 12,
    image: product4,
    name: "Ultra-Fast 50A Battery Charger Station",
    price: 349.99,
    rating: 4.9,
    reviews: 42,
    badge: "Pro",
    category: "charger" as ProductCategory,
  },
  {
    id: 13,
    image: product1,
    name: "Emergency Jump Starter with Air Compressor",
    price: 199.99,
    rating: 4.4,
    reviews: 567,
    category: "jump-starter" as ProductCategory,
  },
  {
    id: 14,
    image: product2,
    name: "RV & Camper 24V Battery Charging System",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 134,
    category: "charger" as ProductCategory,
  },
  {
    id: 15,
    image: product3,
    name: "Compact Portable Air Compressor 12V",
    price: 69.99,
    rating: 4.5,
    reviews: 198,
    badge: "Eco",
    category: "compressor" as ProductCategory,
  },
  {
    id: 16,
    image: product4,
    name: "Workshop Multi-Battery Charging Station",
    price: 449.99,
    rating: 5.0,
    reviews: 31,
    badge: "Pro",
    category: "charger" as ProductCategory,
  },
  {
    id: 17,
    image: product1,
    name: "Cold Weather Jump Starter Booster 3000A",
    price: 94.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 89,
    badge: "New",
    category: "jump-starter" as ProductCategory,
  },
  {
    id: 18,
    image: product2,
    name: "Portable Emergency Battery Pack 2000A",
    price: 159.99,
    rating: 4.8,
    reviews: 256,
    badge: "Best Seller",
    category: "jump-starter" as ProductCategory,
  },
  {
    id: 19,
    image: product3,
    name: "Digital Tire Inflator with Pressure Gauge",
    price: 74.99,
    rating: 4.3,
    reviews: 112,
    category: "compressor" as ProductCategory,
  },
];

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our top-rated battery chargers, jump starters, and compressors trusted by professionals and enthusiasts worldwide.
          </p>

          {/* Category Filters */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.value
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviews={product.reviews}
              badge={product.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

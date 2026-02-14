import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products, type ProductCategory } from "@/data/products";

type FilterCategory = "all" | ProductCategory;

const categories: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "charger", label: "12/24V Car Battery Charger" },
  { value: "jump-starter", label: "Jump Starter (Booster)" },
  { value: "compressor", label: "Compressor" },
];

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");

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

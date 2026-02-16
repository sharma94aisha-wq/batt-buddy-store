import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface DBProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number | null;
  reviews_count: number | null;
  badge: string | null;
  stock_quantity: number;
  category_id: string | null;
  is_active: boolean | null;
}

type FilterCategory = "all" | string;

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("categories").select("id, name, slug").order("sort_order"),
      ]);
      if (prodRes.data) setProducts(prodRes.data as unknown as DBProduct[]);
      if (catRes.data) setCategories(catRes.data as any[]);
    };
    fetchData();
  }, []);

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category_id === activeCategory);

  const filterOptions = [
    { value: "all", label: "All Products" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our top-rated battery chargers, jump starters, and compressors trusted by professionals and enthusiasts worldwide.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {filterOptions.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              image={product.image_url || "/placeholder.svg"}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price ?? undefined}
              rating={product.rating ?? 0}
              reviews={product.reviews_count ?? 0}
              badge={product.badge ?? undefined}
              stockQuantity={product.stock_quantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

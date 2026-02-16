import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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

const MOBILE_LIMIT = 3;

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true).order("stock_quantity", { ascending: false }),
        supabase.from("categories").select("id, name, slug").order("sort_order"),
      ]);
      if (prodRes.data) setProducts(prodRes.data as unknown as DBProduct[]);
      if (catRes.data) setCategories(catRes.data as any[]);
    };
    fetchData();
  }, []);

  // Reset showAll when category changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category_id === activeCategory);

  const visibleProducts = isMobile && !showAll
    ? filteredProducts.slice(0, MOBILE_LIMIT)
    : filteredProducts;

  const filterOptions = [
    { value: "all", label: "Všetky produkty" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Odporúčané <span className="text-primary">produkty</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Objavte naše najlepšie nabíjačky batérií, štartovacie boxy a kompresory, ktorým dôverujú profesionáli aj nadšenci po celom svete.
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
          {visibleProducts.map((product) => (
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

        {isMobile && !showAll && filteredProducts.length > MOBILE_LIMIT && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="rounded-lg border border-primary bg-transparent px-8 py-3 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              Zobraziť viac ({filteredProducts.length - MOBILE_LIMIT})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

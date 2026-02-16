import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categoryName, setCategoryName] = useState("Products");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      const { data: cat } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", slug!)
        .maybeSingle();
      
      if (cat) {
        setCategoryId(cat.id);
        setCategoryName(cat.name);
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", cat.id)
          .eq("is_active", true)
          .order("stock_quantity", { ascending: false });
        if (prods) setProducts(prods as unknown as DBProduct[]);
      }
      setLoading(false);
    };
    fetchCategory();
  }, [slug]);

  const maxPrice = useMemo(
    () => products.length ? Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10 : 500,
    [products]
  );

  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    switch (sortBy) {
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "rating": return [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "name": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return [...result].sort((a, b) => b.stock_quantity - a.stock_quantity);
    }
  }, [products, priceRange, selectedBrands, sortBy]);

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setSortBy("default");
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Sort By</h3>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Default" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Best Rating</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Price Range</h3>
        <Slider min={0} max={maxPrice} step={5} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>€{priceRange[0]}</span>
          <span>€{priceRange[1]}</span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={resetFilters}>Reset Filters</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <PageBreadcrumb items={[{ label: categoryName }]} />
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{categoryName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <Button variant="outline" className="lg:hidden" onClick={() => setShowMobileFilters(true)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          <div className="flex gap-8">
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-background/80" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute right-0 top-0 h-full w-80 max-w-full overflow-y-auto border-l border-border bg-card p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-foreground">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            )}

            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
                  <p className="text-lg text-muted-foreground">{loading ? "Loading..." : "No products match your filters."}</p>
                  {!loading && <Button variant="electric" className="mt-4" onClick={resetFilters}>Reset Filters</Button>}
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
              )}
            </div>

            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-8 rounded-xl border border-border bg-card p-6">
                <FilterSidebar />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProducts;

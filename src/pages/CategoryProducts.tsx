import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categoryLabels, brands, type ProductCategory } from "@/data/products";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug as ProductCategory;
  const categoryName = categoryLabels[category] || "Products";

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === category),
    [category]
  );

  const maxPrice = useMemo(
    () => Math.ceil(Math.max(...categoryProducts.map((p) => p.price)) / 10) * 10,
    [categoryProducts]
  );

  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categoryBrands = useMemo(
    () => [...new Set(categoryProducts.map((p) => p.brand))],
    [categoryProducts]
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = categoryProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    switch (sortBy) {
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "rating": return [...result].sort((a, b) => b.rating - a.rating);
      case "name": return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [categoryProducts, priceRange, selectedBrands, sortBy]);

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setSortBy("default");
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Sort By
        </h3>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Best Rating</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Price Range
        </h3>
        <Slider
          min={0}
          max={maxPrice}
          step={5}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Brand
        </h3>
        <div className="space-y-3">
          {categoryBrands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm text-muted-foreground">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{categoryName}</span>
          </nav>

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {categoryName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-8 rounded-xl border border-border bg-card p-6">
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-background/80" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute right-0 top-0 h-full w-80 max-w-full overflow-y-auto border-l border-border bg-card p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-foreground">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)}>
                      <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                  <FilterSidebar />
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
                  <p className="text-lg text-muted-foreground">No products match your filters.</p>
                  <Button variant="electric" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryProducts;

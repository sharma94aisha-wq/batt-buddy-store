import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Play } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

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
  description: string | null;
}

const SuggestedProducts = ({ categoryId, currentId }: { categoryId: string | null; currentId: string }) => {
  const [suggested, setSuggested] = useState<DBProduct[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .neq("id", currentId)
        .limit(5);
      if (data) setSuggested(data as unknown as DBProduct[]);
    };
    fetch();
  }, [currentId]);

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-2xl font-bold text-foreground">You May Also Like</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {suggested.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            slug={p.slug}
            image={p.image_url || "/placeholder.svg"}
            name={p.name}
            price={p.price}
            originalPrice={p.original_price ?? undefined}
            rating={p.rating ?? 0}
            reviews={p.reviews_count ?? 0}
            badge={p.badge ?? undefined}
            stockQuantity={p.stock_quantity}
          />
        ))}
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { id: slugParam } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Try by slug first, then by id
      let { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slugParam!)
        .maybeSingle();
      
      if (!data) {
        const res = await supabase.from("products").select("*").eq("id", slugParam!).maybeSingle();
        data = res.data;
      }
      
      setProduct(data as unknown as DBProduct | null);
      setLoading(false);
    };
    fetchProduct();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto flex items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
          <h1 className="font-display text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">Back to Home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [product.image_url || "/placeholder.svg"];
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const warranty1Price = Math.round(product.price * 0.3 * 100) / 100;
  const warranty2Price = Math.round(product.price * 0.4 * 100) / 100;

  const additionalServices = [
    { id: "warranty-1", label: "Extended Warranty +1 Year", price: warranty1Price, tooltip: "Extend your manufacturer warranty by an additional year for complete peace of mind." },
    { id: "warranty-2", label: "Extended Warranty +2 Years", price: warranty2Price, tooltip: "Extend your manufacturer warranty by two additional years for maximum protection." },
    { id: "auto-surprise", label: "Auto Surprise", price: 1, tooltip: "Treat yourself to a small surprise that will be a pleasant bonus to your order." },
  ];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    const addons = selectedServices.map((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId)!;
      return { id: service.id, label: service.label, price: service.price };
    });
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, image: product.image_url || "/placeholder.svg", name: product.name, price: product.price, addons: addons.length > 0 ? addons : undefined });
    }
    setSelectedServices([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <PageBreadcrumb items={[{ label: product.name }]} />

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={allImages[selectedImage]} alt={product.name} className="aspect-square w-full object-cover" />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              {product.badge && (
                <span className="inline-block rounded-lg bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                  {product.badge}
                </span>
              )}
              <div>
                <h1 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
              </div>
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating ?? 0) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating ?? 0} ({product.reviews_count ?? 0} reviews)</span>
              </div>
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-primary">€{product.price.toFixed(2)}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">€{product.original_price.toFixed(2)}</span>
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">-{discount}%</span>
                  </>
                )}
              </div>
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description || `High-quality ${product.name.toLowerCase()}. Designed for professional and home use with advanced features for reliable performance.`}
              </p>
              {/* Stock */}
              <div className="flex items-center gap-6 text-sm">
                <span className={`font-medium ${product.stock_quantity > 0 ? "text-green-500" : "text-destructive"}`}>
                  {product.stock_quantity === 0
                    ? "● Out of Stock"
                    : product.stock_quantity > 5
                      ? "● 5+ in stock"
                      : `● ${product.stock_quantity} in stock`}
                </span>
              </div>
              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-foreground transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground hover:text-foreground transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
                <Button variant="electric" size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </div>
              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">2-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <RotateCcw className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">30-Day Returns</span>
                </div>
              </div>

              {/* Additional Services */}
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Additional Services</h3>
                <TooltipProvider delayDuration={200}>
                  <div className="space-y-3">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={service.id}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <label htmlFor={service.id} className="cursor-pointer text-sm text-foreground">
                            {service.label}
                          </label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/40 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                                <span className="text-[10px] font-bold leading-none">!</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[220px] text-xs">
                              {service.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="text-sm font-medium text-primary">+€{service.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews_count ?? 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{product.description || `The ${product.name} is engineered for maximum performance and reliability. Whether you're a professional mechanic or a DIY enthusiast, this product delivers consistent results every time.`}</p>
                  <h3 className="text-foreground">Key Features</h3>
                  <ul>
                    <li>Advanced safety protection against overcharge, short circuit, and reverse polarity</li>
                    <li>Compact and portable design for easy storage and transportation</li>
                    <li>LED indicators for real-time status monitoring</li>
                    <li>Compatible with a wide range of vehicle types</li>
                    <li>Built with premium materials for long-lasting durability</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-display text-4xl font-bold text-foreground">{product.rating ?? 0}</p>
                    <div className="mt-1 flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating ?? 0) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{product.reviews_count ?? 0} reviews</p>
                  </div>
                </div>
                {[
                  { author: "John D.", date: "2 weeks ago", rating: 5, text: "Excellent product! Works exactly as described. Very reliable and easy to use." },
                  { author: "Sarah M.", date: "1 month ago", rating: 4, text: "Great value for the price. Solid build quality and performs well. Would recommend." },
                  { author: "Mike R.", date: "2 months ago", rating: 5, text: "Been using this for a few months now. No issues whatsoever. Top quality." },
                ].map((review, i) => (
                  <div key={i} className={`py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{review.author}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <SuggestedProducts categoryId={product.category_id} currentId={product.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

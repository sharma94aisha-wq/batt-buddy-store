import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus, Play, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductCategory } from "@/data/products";

const SuggestedProducts = ({ category }: { category: ProductCategory }) => {
  const suggested = useMemo(() => {
    const others = products.filter((p) => p.category !== category);
    return [...others].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [category]);

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-2xl font-bold text-foreground">You May Also Like</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {suggested.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            image={p.image}
            name={p.name}
            price={p.price}
            originalPrice={p.originalPrice}
            rating={p.rating}
            reviews={p.reviews}
            badge={p.badge}
            stockQuantity={p.stockQuantity}
          />
        ))}
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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

  const categoryLabel = product.category === "charger" ? "Chargers" : product.category === "jump-starter" ? "Jump Starters" : "Compressors";
  const allImages = product.images?.length ? product.images : [product.image, product.image, product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, image: product.image, name: product.name, price: product.price });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <PageBreadcrumb items={[
            { label: categoryLabel, href: `/category/${product.category}` },
            { label: product.name },
          ]} />

          {/* Product Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={allImages[selectedImage]} alt={product.name} className="aspect-square w-full object-cover" />
              </div>
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-border hover:border-primary/50"}`}
                  >
                    <img src={img} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
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
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <h1 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
              </div>
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
              </div>
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">-{discount}%</span>
                  </>
                )}
              </div>
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description || `High-quality ${product.name.toLowerCase()} from ${product.brand}. Designed for professional and home use with advanced features for reliable performance.`}
              </p>
              {/* SKU & Stock */}
              <div className="flex items-center gap-6 text-sm">
                <span className="text-muted-foreground">SKU: <span className="text-foreground">{product.sku || `SKU-${product.id.toString().padStart(4, "0")}`}</span></span>
                <span className={`font-medium ${(product.stockQuantity ?? 1) > 0 ? "text-green-500" : "text-destructive"}`}>
                  {(product.stockQuantity ?? 1) === 0
                    ? "● Out of Stock"
                    : (product.stockQuantity ?? 1) > 5
                      ? "● 5+ in stock"
                      : `● ${product.stockQuantity} in stock`}
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
                        <span className="text-sm font-medium text-primary">+${service.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </TooltipProvider>
              </div>

          {/* Tabs */}
          <Tabs defaultValue="specs" className="mt-12">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="media">Foto a video</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specs || {
                      "Brand": product.brand,
                      "Category": product.category === "charger" ? "Battery Charger" : product.category === "jump-starter" ? "Jump Starter" : "Compressor",
                      "Voltage": product.name.includes("24V") ? "24V" : "12V",
                      "Warranty": "2 Years",
                      "Weight": "2.5 kg",
                      "Dimensions": "25 × 15 × 10 cm",
                    }).map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{key}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="description" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{product.description || `The ${product.name} by ${product.brand} is engineered for maximum performance and reliability. Whether you're a professional mechanic or a DIY enthusiast, this product delivers consistent results every time.`}</p>
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

            {/* Foto a video Tab */}
            <TabsContent value="media" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Photos</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedImage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="group overflow-hidden rounded-lg border border-border transition-all hover:border-primary hover:shadow-lg"
                    >
                      <img src={img} alt={`${product.name} - photo ${i + 1}`} className="aspect-square w-full object-cover transition-transform group-hover:scale-105" />
                    </button>
                  ))}
                </div>

                <h3 className="mb-4 mt-8 font-display text-lg font-semibold text-foreground">Videos</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Placeholder video cards */}
                  {[
                    { title: "Product Overview", duration: "2:45" },
                    { title: "Installation Guide", duration: "5:12" },
                  ].map((video, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-lg border border-border bg-muted/30">
                      <div className="relative aspect-video w-full">
                        <img src={product.image} alt={video.title} className="h-full w-full object-cover opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                            <Play className="h-6 w-6 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-display text-4xl font-bold text-foreground">{product.rating}</p>
                    <div className="mt-1 flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{product.reviews} reviews</p>
                  </div>
                </div>
                {[
                  { author: "John D.", date: "2 weeks ago", rating: 5, text: "Excellent product! Works exactly as described. Very reliable and easy to use." },
                  { author: "Sarah M.", date: "1 month ago", rating: 4, text: "Great value for the price. Solid build quality and performs well. Would recommend." },
                  { author: "Mike R.", date: "2 months ago", rating: 5, text: "Been using this for a few months now. No issues whatsoever. Top quality from the brand." },
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

          {/* You May Also Like */}
          <SuggestedProducts category={product.category} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

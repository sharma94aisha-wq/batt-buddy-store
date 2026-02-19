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
import { Star, ShoppingCart, Truck, Shield, Users, Minus, Plus, Play } from "lucide-react";
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
  seo_title: string | null;
  seo_description: string | null;
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
      <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Mohlo by sa vám páčiť</h2>
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

const allReviews = [
  { author: "Ján D.", date: "pred 2 týždňami", rating: 5, text: "Výborný produkt! Funguje presne ako je popísané. Veľmi spoľahlivý a jednoduchý na použitie." },
  { author: "Zuzana M.", date: "pred 1 mesiacom", rating: 4.8, text: "Skvelá hodnota za cenu. Solídna kvalita a funguje dobre. Odporúčam." },
  { author: "Michal R.", date: "pred 2 mesiacmi", rating: 5, text: "Používam to už niekoľko mesiacov. Žiadne problémy. Vysoká kvalita." },
  { author: "Peter K.", date: "pred 2 mesiacmi", rating: 4.7, text: "Veľmi spokojný s nákupom. Doručenie bolo rýchle a produkt je presne taký, aký som očakával." },
  { author: "Mária H.", date: "pred 3 mesiacmi", rating: 5, text: "Kúpila som to ako darček a obdarovaný bol nadšený. Kvalitné spracovanie." },
  { author: "Tomáš B.", date: "pred 3 mesiacmi", rating: 4.6, text: "Dobrý produkt za rozumnú cenu. Funguje spoľahlivo, aj keď návod mohol byť podrobnejší." },
  { author: "Eva S.", date: "pred 3 mesiacmi", rating: 4.9, text: "Používam denne a som maximálne spokojná. Odporúčam každému." },
  { author: "Martin L.", date: "pred 4 mesiacmi", rating: 5, text: "Profesionálna kvalita. Presne to, čo som hľadal pre svoju dielňu." },
  { author: "Katarína N.", date: "pred 4 mesiacmi", rating: 4.5, text: "Splnilo moje očakávania. Jednoduchá obsluha a kompaktný dizajn." },
  { author: "Lukáš P.", date: "pred 5 mesiacmi", rating: 4.8, text: "Už druhýkrát objednávam z tohto obchodu. Vždy spoľahlivé produkty." },
  { author: "Andrea V.", date: "pred 5 mesiacmi", rating: 5, text: "Najlepší nákup za posledné mesiace. Kvalita predčila moje očakávania." },
  { author: "Róbert J.", date: "pred 6 mesiacmi", rating: 4.7, text: "Stabilný výkon a pekný dizajn. Za túto cenu výborná voľba." },
  { author: "Jana F.", date: "pred 6 mesiacmi", rating: 4.9, text: "Skvelé! Rýchle doručenie, produkt funguje bezchybne od prvého dňa." },
  { author: "Dávid T.", date: "pred 7 mesiacmi", rating: 4.6, text: "Solídny produkt. Trochu hlučnejší než som čakal, ale výkon je výborný." },
  { author: "Monika G.", date: "pred 8 mesiacmi", rating: 5, text: "Perfektné! Používam to pravidelne a zatiaľ žiadna porucha. Vrelo odporúčam." },
];

const ProductDetail = () => {
  const { id: slugParam } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      let { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slugParam!)
        .maybeSingle();
      
      if (!data) {
        const res = await supabase.from("products").select("*").eq("id", slugParam!).maybeSingle();
        data = res.data;
      }
      
      const prod = data as unknown as DBProduct | null;
      setProduct(prod);

      // Fetch additional images from product_images table
      if (prod) {
        const { data: images } = await supabase
          .from("product_images")
          .select("image_url, is_primary, sort_order")
          .eq("product_id", prod.id)
          .order("sort_order", { ascending: true });

        if (images && images.length > 0) {
          // Put primary image first, then rest by sort_order
          const sorted = [...images].sort((a, b) => {
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return a.sort_order - b.sort_order;
          });
          setProductImages(sorted.map((i) => i.image_url));
        } else {
          setProductImages([prod.image_url || "/placeholder.svg"]);
        }
      }

      setSelectedImage(0);
      setLoading(false);

      // Apply SEO metadata
      if (prod) {
        document.title = prod.seo_title || prod.name;
        const descMeta = document.querySelector('meta[name="description"]');
        const desc = prod.seo_description || prod.description || "";
        if (descMeta) {
          descMeta.setAttribute("content", desc);
        } else if (desc) {
          const meta = document.createElement("meta");
          meta.name = "description";
          meta.content = desc;
          document.head.appendChild(meta);
        }
      }
    };
    fetchProduct();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto flex items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">Načítavam...</p>
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
          <h1 className="font-display text-2xl font-bold text-foreground">Produkt nebol nájdený</h1>
          <Link to="/" className="mt-4 text-primary hover:underline">Späť na úvod</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = productImages.length > 0 ? productImages : [product.image_url || "/placeholder.svg"];
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const warranty1Price = Math.round(product.price * 0.3 * 100) / 100;
  const warranty2Price = Math.round(product.price * 0.4 * 100) / 100;

  const additionalServices = [
    { id: "warranty-1", label: "Predĺžená záruka +1 rok", price: warranty1Price, tooltip: "Predĺžte záručnú dobu výrobcu o ďalší rok pre úplný pokoj." },
    { id: "warranty-2", label: "Predĺžená záruka +2 roky", price: warranty2Price, tooltip: "Predĺžte záručnú dobu výrobcu o dva ďalšie roky pre maximálnu ochranu." },
    { id: "auto-surprise", label: "Auto prekvapenie", price: 1, tooltip: "Doprajte si malé prekvapenie, ktoré bude príjemným bonusom k vašej objednávke." },
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
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={allImages[selectedImage]} alt={product.name} className="aspect-square w-full object-cover" />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        i === selectedImage ? "border-primary" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {product.badge && (
                <span className="inline-block rounded-lg bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                  {product.badge}
                </span>
              )}
              <div>
                <h1 className="mt-1 font-display text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => {
                    const fill = Math.min(1, Math.max(0, (product.rating ?? 0) - i));
                    return fill >= 1 ? (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ) : fill > 0 ? (
                      <span key={i} className="relative h-5 w-5">
                        <Star className="absolute inset-0 h-5 w-5 fill-muted text-muted" />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                          <Star className="h-5 w-5 fill-primary text-primary" />
                        </span>
                      </span>
                    ) : (
                      <Star key={i} className="h-5 w-5 fill-muted text-muted" />
                    );
                  })}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating ?? 0} ({product.reviews_count ?? 0} recenzií)</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-primary">€{product.price.toFixed(2)}</span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">€{product.original_price.toFixed(2)}</span>
                    <span className="rounded bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">-{discount}%</span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || `Vysoko kvalitný ${product.name.toLowerCase()}. Navrhnutý pre profesionálne aj domáce použitie s pokročilými funkciami pre spoľahlivý výkon.`}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <span className={`font-medium ${product.stock_quantity > 0 ? "text-green-500" : "text-destructive"}`}>
                  {product.stock_quantity === 0
                    ? "● Vypredané"
                    : product.stock_quantity > 5
                      ? "● 5+ skladom"
                      : `● ${product.stock_quantity} skladom`}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-foreground transition-colors"><Minus className="h-4 w-4" /></button>
                  <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground hover:text-foreground transition-colors"><Plus className="h-4 w-4" /></button>
                </div>
                <Button variant="electric" size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Pridať do košíka
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Doprava zadarmo</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">365-dňová záruka</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Users className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Overené zákazníkmi</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Doplnkové služby</h3>
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

          <Tabs defaultValue="description" className="mt-12">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Popis</TabsTrigger>
              <TabsTrigger value="reviews">Recenzie ({product.reviews_count ?? 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>{product.description || `${product.name} je navrhnutý pre maximálny výkon a spoľahlivosť. Či ste profesionálny mechanik alebo domáci kutil, tento produkt poskytuje konzistentné výsledky zakaždým.`}</p>
                  <h3 className="text-foreground">Hlavné vlastnosti</h3>
                  <ul>
                    <li>Pokročilá bezpečnostná ochrana proti prebitiu, skratu a prepólovaniu</li>
                    <li>Kompaktný a prenosný dizajn pre jednoduché skladovanie a prepravu</li>
                    <li>LED indikátory pre sledovanie stavu v reálnom čase</li>
                    <li>Kompatibilný so širokou škálou typov vozidiel</li>
                    <li>Vyrobený z prémiových materiálov pre dlhú životnosť</li>
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
                      {[...Array(5)].map((_, i) => {
                        const fill = Math.min(1, Math.max(0, (product.rating ?? 0) - i));
                        return fill >= 1 ? (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ) : fill > 0 ? (
                          <span key={i} className="relative h-4 w-4">
                            <Star className="absolute inset-0 h-4 w-4 fill-muted text-muted" />
                            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                              <Star className="h-4 w-4 fill-primary text-primary" />
                            </span>
                          </span>
                        ) : (
                          <Star key={i} className="h-4 w-4 fill-muted text-muted" />
                        );
                      })}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{product.reviews_count ?? 0} recenzií</p>
                  </div>
                </div>
                {allReviews.slice(0, visibleReviews).map((review, i) => (
                  <div key={i} className={`py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{review.author}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => {
                            const fill = Math.min(1, Math.max(0, review.rating - j));
                            return fill >= 1 ? (
                              <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                            ) : fill > 0 ? (
                              <span key={j} className="relative h-3.5 w-3.5">
                                <Star className="absolute inset-0 h-3.5 w-3.5 fill-muted text-muted" />
                                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                </span>
                              </span>
                            ) : (
                              <Star key={j} className="h-3.5 w-3.5 fill-muted text-muted" />
                            );
                          })}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
                {visibleReviews < allReviews.length && (
                  <div className="pt-4 text-center">
                    <Button variant="outline" onClick={() => setVisibleReviews((v) => Math.min(v + 6, allReviews.length))}>
                      Zobraziť viac recenzií ({allReviews.length - visibleReviews} zostáva)
                    </Button>
                  </div>
                )}
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

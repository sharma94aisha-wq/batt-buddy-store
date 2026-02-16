import { ShoppingCart, Star, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";


interface ProductCardProps {
  id: string;
  slug: string;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  stockQuantity?: number;
}

const ProductCard = ({ id, slug, image, name, price, originalPrice, rating, reviews, badge, stockQuantity }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const handleAddToCart = () => {
    addToCart({ id, image, name, price });
  };
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", id)
        .maybeSingle()
        .then(({ data }) => {
          setIsBookmarked(!!data);
        });
    } else {
      const local: string[] = JSON.parse(localStorage.getItem("guest_bookmarks") || "[]");
      setIsBookmarked(local.includes(id));
    }
  }, [user, id]);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      if (isBookmarked) {
        await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("product_id", id);
        setIsBookmarked(false);
        toast.info("Záložka odstránená");
      } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, product_id: id });
        setIsBookmarked(true);
        toast.success("Pridané do záložiek!");
      }
    } else {
      const local: string[] = JSON.parse(localStorage.getItem("guest_bookmarks") || "[]");
      if (isBookmarked) {
        localStorage.setItem("guest_bookmarks", JSON.stringify(local.filter((b) => b !== id)));
        setIsBookmarked(false);
        toast.info("Záložka odstránená");
      } else {
        localStorage.setItem("guest_bookmarks", JSON.stringify([...local, id]));
        setIsBookmarked(true);
        toast.success("Pridané do záložiek!");
      }
    }
  };

  return (
    <Link to={`/product/${slug}`} className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
      {badge && (
        <div className="absolute left-3 top-3 z-10 rounded-lg bg-primary px-3 py-1">
          <span className="text-xs font-bold uppercase text-primary-foreground">{badge}</span>
        </div>
      )}

      {user && (
        <button
          onClick={toggleBookmark}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      )}

      {originalPrice && (
        <div className="absolute left-3 top-12 z-10 rounded-lg bg-destructive/10 px-2.5 py-1">
          <span className="text-sm font-semibold text-destructive">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </span>
        </div>
      )}
      
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 font-display text-sm font-semibold tracking-wide text-foreground line-clamp-2">
          {name}
        </h3>
        
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
              const fill = Math.min(1, Math.max(0, rating - i));
              return fill >= 1 ? (
                <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
              ) : fill > 0 ? (
                <span key={i} className="relative h-3.5 w-3.5">
                  <Star className="absolute inset-0 h-3.5 w-3.5 fill-muted text-muted" />
                  <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  </span>
                </span>
              ) : (
                <Star key={i} className="h-3.5 w-3.5 fill-muted text-muted" />
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        
        {stockQuantity !== undefined && (
          <div className="mb-3">
            <span className={`text-xs font-medium ${
              stockQuantity === 0 ? "text-destructive"
              : stockQuantity <= 2 ? "text-red-500"
              : stockQuantity <= 4 ? "text-orange-500"
              : "text-green-500"
            }`}>
              {stockQuantity === 0
                ? "Vypredané"
                : stockQuantity > 5
                  ? "5+ skladom"
                  : `${stockQuantity} skladom`}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-primary">€{price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">€{originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Button variant="electric" size="icon" className="h-9 w-9 shrink-0" onClick={(e) => { e.preventDefault(); handleAddToCart(); }} disabled={stockQuantity === 0}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

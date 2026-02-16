import { ShoppingCart, Star, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number | string;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  stockQuantity?: number;
}

const ProductCard = ({ id, image, name, price, originalPrice, rating, reviews, badge, stockQuantity }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", String(id))
        .maybeSingle()
        .then(({ data }) => {
          setIsBookmarked(!!data);
        });
    }
  }, [user, id]);

  const handleAddToCart = () => {
    addToCart({ id: typeof id === "string" ? parseInt(id.substring(0, 8), 16) : id, image, name, price });
  };

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isBookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("product_id", String(id));
      setIsBookmarked(false);
      toast.info("Bookmark removed");
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, product_id: String(id) });
      setIsBookmarked(true);
      toast.success("Bookmarked!");
    }
  };

  return (
    <Link to={`/product/${id}`} className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
      {/* Badge */}
      {badge && (
        <div className="absolute left-3 top-3 z-10 rounded-lg bg-primary px-3 py-1">
          <span className="text-xs font-bold uppercase text-primary-foreground">{badge}</span>
        </div>
      )}

      {/* Bookmark button */}
      <button
        onClick={toggleBookmark}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>

      {/* Discount badge */}
      {originalPrice && (
        <div className="absolute left-3 top-12 z-10 rounded-lg bg-destructive/10 px-2.5 py-1">
          <span className="text-sm font-semibold text-destructive">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </span>
        </div>
      )}
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 font-display text-sm font-semibold tracking-wide text-foreground line-clamp-2">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
        
        {/* Stock */}
        {stockQuantity !== undefined && (
          <div className="mb-3">
            <span className={`text-xs font-medium ${
              stockQuantity === 0 ? "text-destructive"
              : stockQuantity <= 2 ? "text-red-500"
              : stockQuantity <= 4 ? "text-orange-500"
              : "text-green-500"
            }`}>
              {stockQuantity === 0
                ? "Out of stock"
                : stockQuantity > 5
                  ? "5+ in stock"
                  : `${stockQuantity} in stock`}
            </span>
          </div>
        )}

        {/* Price & Add to Cart */}
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

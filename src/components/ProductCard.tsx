import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
}

const ProductCard = ({ id, image, name, price, originalPrice, rating, reviews, badge }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, image, name, price });
  };

  return (
    <Link to={`/product/${id}`} className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
      {/* Badge */}
      {badge && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1">
          <span className="text-xs font-bold uppercase text-primary-foreground">{badge}</span>
        </div>
      )}
      
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Quick add overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button variant="electric" size="sm" onClick={(e) => { e.preventDefault(); handleAddToCart(); }}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
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
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-primary">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

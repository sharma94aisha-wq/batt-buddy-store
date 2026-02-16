import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface BookmarkedProduct {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    slug: string;
    original_price: number | null;
  };
}

const AccountBookmarks = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [bookmarks, setBookmarks] = useState<BookmarkedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("id, product_id, products:product_id(id, name, price, image_url, slug, original_price)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) {
      setBookmarks(
        data.map((b: any) => ({
          id: b.id,
          product_id: b.product_id,
          product: b.products,
        }))
      );
    }
    setLoading(false);
  };

  const removeBookmark = async (bookmarkId: string) => {
    await supabase.from("bookmarks").delete().eq("id", bookmarkId);
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    toast.info("Bookmark removed");
  };

  const handleAddToCart = (product: BookmarkedProduct["product"]) => {
    addToCart({
      id: product.id,
      image: product.image_url || "/placeholder.svg",
      name: product.name,
      price: product.price,
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">My Bookmarks</h1>
        <p className="text-sm text-muted-foreground">Products you've saved for later</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-lg font-semibold">No bookmarks yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse products and click the bookmark icon to save them here.
          </p>
          <Link to="/">
            <Button variant="electric" className="mt-4">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <Link to={`/product/${b.product.slug}`}>
                <img
                  src={b.product.image_url || "/placeholder.svg"}
                  alt={b.product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${b.product.slug}`} className="font-medium hover:text-primary">
                  {b.product.name}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-primary">
                    €{b.product.price.toFixed(2)}
                  </span>
                  {b.product.original_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      €{b.product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="electric" size="sm" onClick={() => handleAddToCart(b.product)} className="gap-2">
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeBookmark(b.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountBookmarks;

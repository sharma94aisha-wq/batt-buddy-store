import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, Tag, X, CornerDownRight } from "lucide-react";
import FreeShippingProgress from "@/components/FreeShippingProgress";

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items, isCartOpen, setIsCartOpen, removeFromCart, removeAddon, updateQuantity,
    totalPrice, clearCart, promoCode, applyPromoCode, removePromoCode,
    discountAmount, finalPrice,
  } = useCart();
  const [promoInput, setPromoInput] = useState("");

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput("");
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="electric" onClick={() => setIsCartOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                      <div className="flex flex-1 flex-col">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <span className="text-primary font-bold">€{item.price.toFixed(2)}</span>
                        <div className="mt-auto flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {item.addons && item.addons.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {item.addons.map((addon) => (
                          <div key={addon.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CornerDownRight className="h-3 w-3" />
                              <span>{addon.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-primary font-medium">€{addon.price.toFixed(2)}</span>
                              <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" onClick={() => removeAddon(item.id, addon.id)}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <FreeShippingProgress currentTotal={finalPrice} />
              {/* Promo Code */}
              {promoCode ? (
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{promoCode.code}</span>
                    <span className="text-xs text-muted-foreground">({promoCode.label})</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removePromoCode}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyPromo} disabled={!promoInput.trim()}>
                    Apply
                  </Button>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1">
                {promoCode && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-green-500">
                      <span>Discount ({promoCode.label})</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">€{finalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button variant="electric" className="w-full" size="lg" onClick={handleCheckout}>
                Checkout
              </Button>
              <Button variant="ghost" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

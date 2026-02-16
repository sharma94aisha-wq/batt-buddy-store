import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, CreditCard, Lock, Truck, Tag, X, Trash2, Banknote, Building2 } from "lucide-react";
import FreeShippingProgress from "@/components/FreeShippingProgress";
import DeliveryMethodSelector, { DeliveryMethod, PacketaPoint } from "@/components/DeliveryMethodSelector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    items, totalPrice, clearCart, removeFromCart, removeAddon,
    promoCode, applyPromoCode, removePromoCode, discountAmount, finalPrice,
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "bank">("card");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
  const [selectedPoint, setSelectedPoint] = useState<PacketaPoint | null>(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    address: "", city: "", zipCode: "",
    cardNumber: "", expiryDate: "", cvv: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMethod === "pickup" && !selectedPoint) {
      toast.error("Prosím vyberte odberné miesto");
      return;
    }
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            addons: item.addons || [],
          })),
          promoCode: promoCode?.code || undefined,
          deliveryMethod,
          paymentMethod,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address || undefined,
            city: formData.city || undefined,
            zipCode: formData.zipCode || undefined,
          },
          pickupPointName: selectedPoint?.name || undefined,
          pickupPointAddress: selectedPoint
            ? `${selectedPoint.street}, ${selectedPoint.city} ${selectedPoint.zip}`
            : undefined,
        },
      });

      if (error) throw new Error(error.message || "Nepodarilo sa vytvoriť objednávku");
      if (data?.error) throw new Error(data.error);

      clearCart();
      toast.success("Objednávka bola úspešne vytvorená!");
      navigate("/order-confirmation");
    } catch (err: any) {
      toast.error(err.message || "Nepodarilo sa vytvoriť objednávku");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput("");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl">Váš košík je prázdny</h1>
          <Button variant="electric" onClick={() => navigate("/")}>Pokračovať v nákupe</Button>
        </div>
      </div>
    );
  }

  const codFee = paymentMethod === "cod" ? 1 : 0;
  const shippingBase = deliveryMethod === "pickup" ? 2 : 6;
  const freeThreshold = deliveryMethod === "pickup" ? 40 : 80;
  const shipping = finalPrice >= freeThreshold ? 0 : shippingBase;
  const tax = finalPrice * 0.08;
  const orderTotal = finalPrice + shipping + tax + codFee;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Späť do obchodu
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl md:text-4xl mb-8">Objednávka</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-display text-xl mb-4">Kontaktné údaje</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Meno</Label>
                    <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Priezvisko</Label>
                    <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefónne číslo</Label>
                    <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="+421" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="vas@email.com" className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl">Spôsob doručenia</h2>
                </div>
                <DeliveryMethodSelector
                  value={deliveryMethod}
                  onChange={setDeliveryMethod}
                  selectedPoint={selectedPoint}
                  onPointSelected={setSelectedPoint}
                  currentTotal={finalPrice}
                />

                {deliveryMethod === "home" && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    <div>
                      <Label htmlFor="address">Ulica a číslo domu</Label>
                      <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Mesto</Label>
                        <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">PSČ</Label>
                        <Input id="zipCode" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl">Spôsob platby</h2>
                </div>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "cod" | "bank")} className="space-y-3">
                  <label htmlFor="pm-card" className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="card" id="pm-card" />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Kreditná / debetná karta</p>
                      <p className="text-xs text-muted-foreground">Bezpečná platba kartou</p>
                    </div>
                  </label>
                  <label htmlFor="pm-cod" className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="cod" id="pm-cod" />
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dobierka</p>
                      <p className="text-xs text-muted-foreground">Platba pri prevzatí objednávky (+€1,00 poplatok)</p>
                    </div>
                  </label>
                  <label htmlFor="pm-bank" className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${paymentMethod === "bank" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <RadioGroupItem value="bank" id="pm-bank" />
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bankový prevod</p>
                      <p className="text-xs text-muted-foreground">Platba na bankový účet po vytvorení objednávky</p>
                    </div>
                  </label>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <Label htmlFor="cardNumber">Číslo karty</Label>
                      <Input id="cardNumber" name="cardNumber" required value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Platnosť do</Label>
                        <Input id="expiryDate" name="expiryDate" required value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/RR" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" name="cvv" required value={formData.cvv} onChange={handleInputChange} placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="mt-4 pt-4 border-t border-border rounded-lg bg-muted/50 p-4 space-y-1 text-sm">
                    <p className="font-medium">Bankové údaje vám budú zaslané e-mailom po vytvorení objednávky.</p>
                    <p className="text-muted-foreground">Platbu prosím vykonajte do 3 pracovných dní.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-8">
                <h2 className="font-display text-xl mb-4">Zhrnutie objednávky</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-muted-foreground text-sm">Ks: {item.quantity}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {item.addons && item.addons.length > 0 && (
                        <div className="ml-8 space-y-1">
                          {item.addons.map((addon) => (
                            <div key={addon.id} className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>↳ {addon.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-foreground">€{(addon.price * item.quantity).toFixed(2)}</span>
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

                <div className="border-t border-border pt-4 mb-4">
                  <FreeShippingProgress currentTotal={finalPrice} deliveryMethod={deliveryMethod} />
                </div>

                <div className="border-t border-border pt-4 mb-4">
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
                        placeholder="Zľavový kód"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={!promoInput.trim()}>
                        Použiť
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Medzisúčet</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  {promoCode && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Zľava ({promoCode.label})</span>
                      <span>-€{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Doprava ({deliveryMethod === "pickup" ? "Odberné miesto" : "Doručenie domov"})
                    </span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Zadarmo" : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  {codFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Poplatok za dobierku</span>
                      <span>€{codFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DPH</span>
                    <span>€{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Celkom</span>
                    <span className="text-primary">€{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" variant="electric" size="lg" className="w-full mt-6" disabled={isProcessing}>
                  {isProcessing ? "Spracovávam..." : (<><Lock className="h-4 w-4" /> Objednať</>)}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Vaše platobné údaje sú bezpečné a šifrované
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;

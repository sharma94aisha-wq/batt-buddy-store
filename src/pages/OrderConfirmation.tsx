import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `VC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl">Objednávka potvrdená!</h1>
          <p className="text-muted-foreground">
            Ďakujeme za váš nákup. Vaša objednávka bola prijatá a spracováva sa.
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Číslo objednávky</p>
            <p className="font-display text-xl text-primary">{orderNumber}</p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <div className="flex-1 text-center">
              <Package className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Spracovanie</p>
            </div>
            <div className="flex-1 text-center opacity-50">
              <Truck className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Odoslanie</p>
            </div>
            <div className="flex-1 text-center opacity-50">
              <CheckCircle className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Doručené</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Potvrdzujúci e-mail s informáciami o sledovaní bude odoslaný na vašu e-mailovú adresu.
        </p>

        <Button variant="electric" size="lg" onClick={() => navigate("/")}>
          Pokračovať v nákupe
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

import { useState, useEffect, useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Package } from "lucide-react";

// Packeta widget types
declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (apiKey: string, callback: (point: PacketaPoint | null) => void, options?: Record<string, unknown>) => void;
      };
    };
  }
}

export interface PacketaPoint {
  id: number;
  name: string;
  city: string;
  street: string;
  zip: string;
  place: string;
}

export type DeliveryMethod = "pickup" | "home";

interface DeliveryMethodSelectorProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
  selectedPoint: PacketaPoint | null;
  onPointSelected: (point: PacketaPoint | null) => void;
  currentTotal?: number;
}

const PACKETA_API_KEY = "REPLACE_WITH_YOUR_PACKETA_API_KEY";

const DeliveryMethodSelector = ({
  value,
  onChange,
  selectedPoint,
  onPointSelected,
  currentTotal = 0,
}: DeliveryMethodSelectorProps) => {
  const freeShipping = currentTotal >= 40;
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById("packeta-widget-script")) {
      setWidgetLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "packeta-widget-script";
    script.src = "https://widget.packeta.com/v6/www/js/library.js";
    script.async = true;
    script.onload = () => setWidgetLoaded(true);
    document.head.appendChild(script);
  }, []);

  const openPacketaWidget = useCallback(() => {
    if (!window.Packeta) return;
    window.Packeta.Widget.pick(
      PACKETA_API_KEY,
      (point) => {
        if (point) onPointSelected(point);
      },
      { country: "sk", language: "sk" }
    );
  }, [onPointSelected]);

  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={(v) => {
          onChange(v as DeliveryMethod);
          if (v === "home") onPointSelected(null);
        }}
        className="space-y-3"
      >
        <label
          htmlFor="dm-pickup"
          className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
            value === "pickup" ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <RadioGroupItem value="pickup" id="dm-pickup" />
          <Package className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Packeta Z-BOX / Z-POINT</p>
            <p className="text-xs text-muted-foreground">
              Pick up at a Packeta point near you
            </p>
          </div>
          <span className={`text-sm font-semibold ${freeShipping ? "text-green-600" : ""}`}>{freeShipping ? "Free" : "€2.00"}</span>
        </label>

        {value === "pickup" && (
          <div className="ml-8 space-y-2">
            {selectedPoint ? (
              <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{selectedPoint.name}</p>
                  <p className="text-muted-foreground">
                    {selectedPoint.street}, {selectedPoint.city} {selectedPoint.zip}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openPacketaWidget}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={openPacketaWidget}
                disabled={!widgetLoaded}
              >
                <MapPin className="h-4 w-4" />
                {widgetLoaded ? "Select Pickup Point" : "Loading map…"}
              </Button>
            )}
          </div>
        )}

        <label
          htmlFor="dm-home"
          className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
            value === "home" ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <RadioGroupItem value="home" id="dm-home" />
          <Home className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Packeta – Home Delivery</p>
            <p className="text-xs text-muted-foreground">
              Delivered to your address in Slovakia
            </p>
          </div>
          <span className={`text-sm font-semibold ${freeShipping ? "text-green-600" : ""}`}>{freeShipping ? "Free" : "€6.00"}</span>
        </label>
      </RadioGroup>
    </div>
  );
};

export default DeliveryMethodSelector;

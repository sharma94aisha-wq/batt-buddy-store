import { Progress } from "@/components/ui/progress";
import { Package, Home } from "lucide-react";
import type { DeliveryMethod } from "@/components/DeliveryMethodSelector";

const FREE_PICKUP_THRESHOLD = 40;
const FREE_HOME_THRESHOLD = 80;

interface FreeShippingProgressProps {
  currentTotal: number;
  deliveryMethod?: DeliveryMethod;
}

const FreeShippingProgress = ({ currentTotal, deliveryMethod = "pickup" }: FreeShippingProgressProps) => {
  const pickupRemaining = Math.max(0, FREE_PICKUP_THRESHOLD - currentTotal);
  const homeRemaining = Math.max(0, FREE_HOME_THRESHOLD - currentTotal);
  const pickupQualified = pickupRemaining === 0;
  const homeQualified = homeRemaining === 0;

  const activeThreshold = deliveryMethod === "home" ? FREE_HOME_THRESHOLD : FREE_PICKUP_THRESHOLD;
  const remaining = deliveryMethod === "home" ? homeRemaining : pickupRemaining;
  const qualified = deliveryMethod === "home" ? homeQualified : pickupQualified;
  const progress = Math.min(100, (currentTotal / activeThreshold) * 100);

  // For pickup: also show home delivery milestone if not yet reached
  const showHomeMilestone = deliveryMethod === "pickup" && pickupQualified && !homeQualified;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className={`h-4 w-4 ${qualified ? "text-green-500" : "text-primary"}`} />
          {qualified ? (
            <span className="text-sm font-medium text-green-500">
              {deliveryMethod === "home" ? "Free home delivery unlocked! 🎉" : "Free pickup delivery unlocked! 🎉"}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Add <span className="font-semibold text-foreground">€{remaining.toFixed(2)}</span> more for free{" "}
              {deliveryMethod === "home" ? "home delivery" : "pickup delivery"}
            </span>
          )}
        </div>
        <div className="relative">
          <Progress value={progress} className="h-2" />
          {deliveryMethod === "pickup" && !homeQualified && (
            <div
              className="absolute top-0 h-2 w-0.5 bg-muted-foreground/40"
              style={{ left: `${Math.min(100, (FREE_PICKUP_THRESHOLD / FREE_HOME_THRESHOLD) * 100)}%` }}
              title="Free pickup"
            />
          )}
        </div>
      </div>

      {showHomeMilestone && (
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Add <span className="font-semibold text-foreground">€{homeRemaining.toFixed(2)}</span> more for free home delivery
          </span>
        </div>
      )}
    </div>
  );
};

export { FREE_PICKUP_THRESHOLD, FREE_HOME_THRESHOLD };
export default FreeShippingProgress;

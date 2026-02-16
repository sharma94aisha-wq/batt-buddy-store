import { Progress } from "@/components/ui/progress";
import { Truck } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 40;

const FreeShippingProgress = ({ currentTotal }: { currentTotal: number }) => {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - currentTotal);
  const progress = Math.min(100, (currentTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualified = remaining === 0;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Truck className={`h-4 w-4 ${qualified ? "text-green-500" : "text-primary"}`} />
        {qualified ? (
          <span className="text-sm font-medium text-green-500">You've unlocked free shipping! 🎉</span>
        ) : (
          <span className="text-sm text-muted-foreground">
            Add <span className="font-semibold text-foreground">€{remaining.toFixed(2)}</span> more for free shipping
          </span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export { FREE_SHIPPING_THRESHOLD };
export default FreeShippingProgress;

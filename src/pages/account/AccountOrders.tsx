import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  delivery_method: string;
  payment_method: string;
  items: {
    id: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    price: number;
  }[];
}

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-500" },
  processing: { label: "Processing", icon: Package, color: "text-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "text-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-500" },
};

const AccountOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user!.id)
      .in("status", ["pending", "processing", "shipped"])
      .order("created_at", { ascending: false });

    if (ordersData && ordersData.length > 0) {
      const orderIds = ordersData.map((o: any) => o.id);
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      const ordersWithItems = ordersData.map((order: any) => ({
        ...order,
        items: (itemsData || []).filter((item: any) => item.order_id === order.id),
      }));
      setOrders(ordersWithItems);
    }
    setLoading(false);
  };

  const currentStepIndex = (status: string) => STATUS_STEPS.indexOf(status);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        {[1, 2].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Current Orders</h1>
        <p className="text-sm text-muted-foreground">Track your active orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-lg font-semibold">No active orders</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any active orders right now.
          </p>
          <Link to="/">
            <Button variant="electric" className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const stepIdx = currentStepIndex(order.status);
            const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

            return (
              <div key={order.id} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusInfo.color} bg-muted`}>
                    <statusInfo.icon className="h-4 w-4" />
                    {statusInfo.label}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const config = STATUS_CONFIG[step];
                      const isActive = i <= stepIdx;
                      return (
                        <div key={step} className="flex flex-1 flex-col items-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background text-muted-foreground"
                          }`}>
                            <config.icon className="h-4 w-4" />
                          </div>
                          <span className={`mt-1 text-xs ${isActive ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="relative mx-4 mt-[-28px] mb-6">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-muted" />
                    <div
                      className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-primary transition-all"
                      style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-3 border-t border-border pt-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end border-t border-border pt-4">
                  <p className="font-display text-lg font-bold">
                    Total: <span className="text-primary">€{Number(order.total).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountOrders;

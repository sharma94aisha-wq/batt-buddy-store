import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Archive, ChevronDown, ChevronUp } from "lucide-react";
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

const AccountOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user!.id)
      .eq("status", "delivered")
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        {[1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Order Archive</h1>
        <p className="text-sm text-muted-foreground">Your past delivered orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Archive className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="font-display text-lg font-semibold">No past orders</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Completed orders will appear here.
          </p>
          <Link to="/">
            <Button variant="electric" className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-card">
              <button
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div>
                  <p className="font-display font-bold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-primary">€{Number(order.total).toFixed(2)}</span>
                  {expandedId === order.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-border px-4 py-4">
                  <div className="space-y-3">
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
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground">
                    <span>Delivery: {order.delivery_method === "pickup" ? "Pickup" : "Home"}</span>
                    <span>Payment: {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method === "bank" ? "Bank Transfer" : "Card"}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountOrderHistory;

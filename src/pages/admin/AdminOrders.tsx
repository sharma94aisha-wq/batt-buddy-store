import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Package, Truck, CreditCard, Banknote, Building2 } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  addons: any[];
}

interface Order {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  delivery_method: string;
  pickup_point_name: string | null;
  pickup_point_address: string | null;
  address: string | null;
  city: string | null;
  zip_code: string | null;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  promo_code: string | null;
  shipping_cost: number;
  cod_fee: number;
  tax: number;
  total: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  delivered: "bg-green-500/10 text-green-500 border-green-500/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const paymentIcons: Record<string, typeof CreditCard> = {
  card: CreditCard,
  cod: Banknote,
  bank: Building2,
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const openOrder = async (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
    const { data } = await supabase
      .from("order_items" as any)
      .select("*")
      .eq("order_id", order.id);
    setOrderItems((data as any) || []);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders" as any)
      .update({ status } as any)
      .eq("id", orderId);
    if (error) toast.error(error.message);
    else {
      toast.success(`Status updated to ${status}`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((prev) => prev ? { ...prev, status } : prev);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("sk-SK", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-1">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-16">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const PayIcon = paymentIcons[order.payment_method] || CreditCard;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{order.first_name} {order.last_name}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </TableCell>
                    <TableCell className="font-semibold">€{Number(order.total).toFixed(2)}</TableCell>
                    <TableCell><PayIcon className="h-4 w-4 text-muted-foreground" /></TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {order.delivery_method === "pickup" ? "📦 Pickup" : "🏠 Home"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[order.status] || ""}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Order {selectedOrder?.order_number}
              {selectedOrder && (
                <Badge variant="outline" className={statusColors[selectedOrder.status] || ""}>
                  {selectedOrder.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status Update */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Update Status:</span>
                <Select value={selectedOrder.status} onValueChange={(v) => updateStatus(selectedOrder.id, v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {selectedOrder.first_name} {selectedOrder.last_name}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selectedOrder.email}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selectedOrder.phone}</div>
                  <div><span className="text-muted-foreground">Date:</span> {formatDate(selectedOrder.created_at)}</div>
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Delivery</h3>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedOrder.delivery_method === "pickup" ? "Packeta Pickup" : "Home Delivery"}</span>
                  </div>
                  {selectedOrder.pickup_point_name && (
                    <div className="ml-6 text-muted-foreground">
                      {selectedOrder.pickup_point_name} — {selectedOrder.pickup_point_address}
                    </div>
                  )}
                  {selectedOrder.address && (
                    <div className="ml-6 text-muted-foreground">
                      {selectedOrder.address}, {selectedOrder.city} {selectedOrder.zip_code}
                    </div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      {item.product_image && (
                        <img src={item.product_image} alt="" className="h-10 w-10 rounded object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">€{(Number(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>€{Number(selectedOrder.subtotal).toFixed(2)}</span></div>
                  {Number(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between text-green-500"><span>Discount ({selectedOrder.promo_code})</span><span>-€{Number(selectedOrder.discount_amount).toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{Number(selectedOrder.shipping_cost) === 0 ? "Free" : `€${Number(selectedOrder.shipping_cost).toFixed(2)}`}</span></div>
                  {Number(selectedOrder.cod_fee) > 0 && (
                    <div className="flex justify-between"><span className="text-muted-foreground">COD Fee</span><span>€{Number(selectedOrder.cod_fee).toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>€{Number(selectedOrder.tax).toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span className="text-primary">€{Number(selectedOrder.total).toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;

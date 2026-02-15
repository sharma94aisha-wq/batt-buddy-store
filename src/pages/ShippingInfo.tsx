import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Clock, Globe, Package } from "lucide-react";

const cards = [
  { icon: Truck, title: "Standard Shipping", desc: "3–5 business days. Free on orders over $50." },
  { icon: Clock, title: "Express Shipping", desc: "1–2 business days. Flat rate $12.99." },
  { icon: Globe, title: "Coverage", desc: "We ship to all 50 US states and Canada." },
  { icon: Package, title: "Order Tracking", desc: "Tracking number emailed once your order ships." },
];

const ShippingInfo = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Shipping Information</h1>
        <p className="mt-2 text-muted-foreground">Everything you need to know about our shipping options and policies.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground space-y-3">
          <h2 className="font-display text-lg font-semibold text-foreground">Shipping Policy Details</h2>
          <p>Orders placed before 2 PM EST on business days are processed the same day. Orders placed after 2 PM EST or on weekends will be processed the next business day.</p>
          <p>Shipping times are estimates and may vary due to carrier delays, weather, or high-demand periods. VoltCharge is not responsible for delays once the package is handed to the carrier.</p>
          <p>If your order arrives damaged, please contact us within 48 hours with photos so we can arrange a replacement.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ShippingInfo;

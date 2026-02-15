import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const Warranty = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Warranty</h1>
        </div>
        <p className="mt-2 text-muted-foreground">All VoltCharge products are built to last and backed by our warranty.</p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">2-Year Limited Warranty</h2>
            <p>Every product purchased from VoltCharge is covered by a 2-year limited warranty from the date of purchase. This warranty covers defects in materials and workmanship under normal use.</p>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">What's Covered</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Manufacturing defects</li>
              <li>Faulty components or electronics</li>
              <li>Premature failure under normal use conditions</li>
            </ul>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">What's Not Covered</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Damage from misuse, accidents, or unauthorized modifications</li>
              <li>Normal wear and tear</li>
              <li>Products purchased from unauthorized retailers</li>
            </ul>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">How to Make a Claim</h2>
            <p>Email support@voltcharge.com with your order number, a description of the issue, and photos if applicable. Our team will respond within 48 hours.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Warranty;

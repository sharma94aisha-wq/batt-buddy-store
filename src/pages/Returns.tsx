import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Returns = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Returns & Refunds</h1>
        <p className="mt-2 text-muted-foreground">Our hassle-free return policy is designed to keep you satisfied.</p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">30-Day Return Policy</h2>
            <p>You may return most items within 30 days of delivery for a full refund. Items must be unused, in original packaging, and accompanied by proof of purchase.</p>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">How to Initiate a Return</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Contact our support team at support@voltcharge.com or call 1-800-VOLTCHARGE.</li>
              <li>Provide your order number and reason for return.</li>
              <li>Receive a prepaid return shipping label via email.</li>
              <li>Ship the item back using the provided label.</li>
              <li>Refund is processed within 5–7 business days after we receive the item.</li>
            </ol>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Non-Returnable Items</h2>
            <p>Items that have been used, damaged by the customer, or are missing original packaging may not be eligible for a full refund. Clearance items are final sale.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Returns;

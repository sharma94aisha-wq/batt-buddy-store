import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 15, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {[
            { t: "Acceptance of Terms", p: "By accessing and using the VoltCharge website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
            { t: "Products & Pricing", p: "All prices are listed in USD and are subject to change without notice. We reserve the right to limit quantities and to discontinue any product at any time. Errors in pricing will be corrected and orders may be cancelled if necessary." },
            { t: "Orders & Payment", p: "By placing an order, you represent that all information provided is accurate. We accept major credit cards and other payment methods displayed at checkout. Orders are subject to acceptance and availability." },
            { t: "Intellectual Property", p: "All content on this website including text, graphics, logos, and images is the property of VoltCharge and is protected by copyright and trademark laws." },
            { t: "Limitation of Liability", p: "VoltCharge shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability is limited to the purchase price of the product." },
            { t: "Governing Law", p: "These terms are governed by the laws of the State of New York. Any disputes shall be resolved in the courts of New York County." },
          ].map(({ t, p }) => (
            <section key={t} className="rounded-xl border border-border bg-card p-6 space-y-2">
              <h2 className="font-display text-lg font-semibold text-foreground">{t}</h2>
              <p>{p}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;

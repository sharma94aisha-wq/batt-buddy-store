import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { usePageSEO } from "@/hooks/usePageSEO";

const Returns = () => {
  usePageSEO("returns", "Vrátenie tovaru | AutoProfi");
  return (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Vrátenie tovaru a refundácie" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Vrátenie tovaru a refundácie</h1>
        <p className="mt-2 text-muted-foreground">Naša bezproblémová politika vrátenia je navrhnutá pre vašu spokojnosť.</p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">30-dňová politika vrátenia</h2>
            <p>Väčšinu položiek môžete vrátiť do 30 dní od doručenia za plnú refundáciu. Položky musia byť nepoužité, v pôvodnom balení a s dokladom o kúpe.</p>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Ako iniciovať vrátenie</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Kontaktujte náš tím podpory na podpora@autoprofi.sk alebo zavolajte na +421 900 123 456.</li>
              <li>Uveďte číslo objednávky a dôvod vrátenia.</li>
              <li>Dostanete predplatený štítok na vrátenie e-mailom.</li>
              <li>Odošlite tovar späť pomocou poskytnutého štítku.</li>
              <li>Refundácia bude spracovaná do 5–7 pracovných dní po prijatí tovaru.</li>
            </ol>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Nevratné položky</h2>
            <p>Položky, ktoré boli použité, poškodené zákazníkom alebo nemajú pôvodné balenie, nemusia mať nárok na plnú refundáciu. Výpredajové položky sú konečný predaj.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);
};

export default Returns;

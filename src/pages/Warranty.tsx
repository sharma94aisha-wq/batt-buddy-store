import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Shield } from "lucide-react";

const Warranty = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Záruka" }]} />
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Záruka</h1>
        </div>
        <p className="mt-2 text-muted-foreground">Všetky produkty VoltCharge sú vyrobené tak, aby vydržali, a sú kryté našou zárukou.</p>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">2-ročná obmedzená záruka</h2>
            <p>Každý produkt zakúpený od VoltCharge je krytý 2-ročnou obmedzenou zárukou od dátumu nákupu. Táto záruka pokrýva chyby materiálu a spracovania pri bežnom používaní.</p>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Čo je kryté</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Výrobné chyby</li>
              <li>Chybné komponenty alebo elektronika</li>
              <li>Predčasné zlyhanie pri bežnom používaní</li>
            </ul>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Čo nie je kryté</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Poškodenie nesprávnym používaním, nehodami alebo neoprávnenými úpravami</li>
              <li>Bežné opotrebenie</li>
              <li>Produkty zakúpené od neautorizovaných predajcov</li>
            </ul>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Ako podať reklamáciu</h2>
            <p>Napíšte na podpora@voltcharge.sk s číslom objednávky, popisom problému a prípadnými fotografiami. Náš tím odpovie do 48 hodín.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Warranty;

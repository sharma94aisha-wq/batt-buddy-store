import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Truck, Clock, Globe, Package } from "lucide-react";

const cards = [
  { icon: Truck, title: "Štandardné doručenie", desc: "3–5 pracovných dní. Zadarmo pri objednávke nad 40 €." },
  { icon: Clock, title: "Expresné doručenie", desc: "1–2 pracovné dni. Paušálna sadzba 12,99 €." },
  { icon: Globe, title: "Pokrytie", desc: "Doručujeme na celé Slovensko a do Českej republiky." },
  { icon: Package, title: "Sledovanie objednávky", desc: "Sledovacie číslo vám zašleme e-mailom po odoslaní objednávky." },
];

const ShippingInfo = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Informácie o doručení" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Informácie o doručení</h1>
        <p className="mt-2 text-muted-foreground">Všetko, čo potrebujete vedieť o našich možnostiach a podmienkach doručenia.</p>
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
          <h2 className="font-display text-lg font-semibold text-foreground">Podrobnosti o doručení</h2>
          <p>Objednávky zadané pred 14:00 v pracovné dni sú spracované v ten istý deň. Objednávky zadané po 14:00 alebo cez víkend budú spracované nasledujúci pracovný deň.</p>
          <p>Doby doručenia sú odhady a môžu sa líšiť v dôsledku oneskorení prepravcu, počasia alebo obdobia vysokého dopytu. VoltCharge nezodpovedá za oneskorenia po odovzdaní balíka prepravcovi.</p>
          <p>Ak vaša objednávka dorazí poškodená, kontaktujte nás do 48 hodín s fotografiami, aby sme mohli zabezpečiť výmenu.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ShippingInfo;

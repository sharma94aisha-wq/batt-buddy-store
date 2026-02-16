import { Shield, Truck, Zap, Award, Users, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Doprava zadarmo",
    description: "Bezplatné doručenie do Z-BOXu / Z-POINTu pri objednávke nad 40 €.",
  },
  {
    icon: Shield,
    title: "Záruka 365 dní",
    description: "Všetky produkty sú kryté komplexnou zárukou 365 dní.",
  },
  {
    icon: Zap,
    title: "Odoslanie v ten istý deň",
    description: "Objednajte do 14:00 a odošleme v ten istý deň.",
  },
  {
    icon: Award,
    title: "Zaručená kvalita",
    description: "Každý produkt je testovaný a certifikovaný pre vysoký výkon.",
  },
  {
    icon: Users,
    title: "Overené zákazníkmi",
    description: "Tisíce spokojných zákazníkov a pozitívnych recenzií.",
  },
  {
    icon: CreditCard,
    title: "Bezpečná platba",
    description: "Viacero bezpečných platobných možností pre vaše pohodlie.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Prečo si vybrať <span className="text-primary">VoltCharge</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Sme odhodlaní poskytovať najlepšie produkty a služby v odvetví.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/30"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Obchodné podmienky" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Obchodné podmienky</h1>
        <p className="mt-2 text-sm text-muted-foreground">Posledná aktualizácia: 15. februára 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {[
            { t: "Prijatie podmienok", p: "Prístupom a používaním webovej stránky AutoProfi súhlasíte s týmito Obchodnými podmienkami. Ak nesúhlasíte, prosím nepoužívajte naše služby." },
            { t: "Produkty a ceny", p: "Všetky ceny sú uvedené v EUR a môžu sa zmeniť bez predchádzajúceho upozornenia. Vyhradzujeme si právo obmedziť množstvá a kedykoľvek stiahnuť akýkoľvek produkt. Chyby v cenách budú opravené a objednávky môžu byť v prípade potreby zrušené." },
            { t: "Objednávky a platby", p: "Zadaním objednávky potvrdzujete, že všetky poskytnuté informácie sú správne. Akceptujeme hlavné kreditné karty a ďalšie platobné metódy zobrazené pri pokladni. Objednávky podliehajú akceptácii a dostupnosti." },
            { t: "Duševné vlastníctvo", p: "Všetok obsah na tejto webovej stránke vrátane textov, grafiky, log a obrázkov je majetkom VoltCharge a je chránený autorským právom a zákonmi o ochranných známkach." },
            { t: "Obmedzenie zodpovednosti", p: "VoltCharge nenesie zodpovednosť za žiadne nepriame, náhodné alebo následné škody vyplývajúce z používania našich produktov alebo služieb. Naša celková zodpovednosť je obmedzená na kúpnu cenu produktu." },
            { t: "Rozhodné právo", p: "Tieto podmienky sa riadia právnymi predpismi Slovenskej republiky. Akékoľvek spory budú riešené príslušnými súdmi Slovenskej republiky." },
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

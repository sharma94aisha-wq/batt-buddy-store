import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { usePageSEO } from "@/hooks/usePageSEO";

const CookiePolicy = () => {
  usePageSEO("cookies", "Zásady cookies | AutoProfi");
  return (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Zásady cookies" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Zásady cookies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Posledná aktualizácia: 15. februára 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {[
            { t: "Čo sú cookies?", p: "Cookies sú malé textové súbory uložené na vašom zariadení pri návšteve webovej stránky. Pomáhajú nám zapamätať si vaše preferencie a zlepšiť váš zážitok." },
            { t: "Aké cookies používame", p: "Používame nevyhnutné cookies (potrebné pre fungovanie stránky), analytické cookies (na pochopenie správania návštevníkov) a marketingové cookies (na doručovanie relevantných reklám). Nevyhnutné cookies nie je možné vypnúť." },
            { t: "Cookies tretích strán", p: "Niektoré cookies sú umiestnené službami tretích strán, ako sú poskytovatelia analytických nástrojov a platobné brány. Tieto cookies sa riadia zásadami ochrany osobných údajov príslušnej tretej strany." },
            { t: "Správa cookies", p: "Cookies môžete spravovať alebo vymazať prostredníctvom nastavení prehliadača. Vypnutie určitých cookies môže ovplyvniť funkčnosť stránky. Pokyny nájdete v sekcii nápovedy vášho prehliadača." },
            { t: "Kontakt", p: "Pre otázky o našich zásadách cookies nás kontaktujte na podpora@autoprofi.sk." },
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
};

export default CookiePolicy;

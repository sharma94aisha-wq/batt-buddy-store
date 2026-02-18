import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Ochrana osobných údajov" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Ochrana osobných údajov</h1>
        <p className="mt-2 text-sm text-muted-foreground">Posledná aktualizácia: 15. februára 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {[
            { t: "Aké údaje zhromažďujeme", p: "Zhromažďujeme údaje, ktoré nám priamo poskytnete, ako vaše meno, e-mailovú adresu, adresu doručenia a platobné údaje pri nákupe. Automaticky tiež zhromažďujeme určité informácie o vašom zariadení a aktivite prehliadania." },
            { t: "Ako používame vaše údaje", p: "Zhromaždené údaje používame na spracovanie objednávok, komunikáciu s vami, zlepšovanie našich služieb a zasielanie propagačného obsahu (s vaším súhlasom). Vaše osobné údaje nikdy nepredávame tretím stranám." },
            { t: "Bezpečnosť údajov", p: "Implementujeme bezpečnostné opatrenia podľa priemyselných štandardov vrátane SSL šifrovania, bezpečného spracovania platieb a pravidelných bezpečnostných auditov na ochranu vašich osobných údajov." },
            { t: "Cookies", p: "Používame cookies a podobné technológie na zlepšenie vášho zážitku z prehliadania, analýzu návštevnosti stránok a personalizáciu obsahu. Nastavenia cookies môžete ovládať cez preferencie prehliadača." },
            { t: "Vaše práva", p: "Máte právo na prístup, opravu alebo vymazanie vašich osobných údajov. Môžete sa tiež kedykoľvek odhlásiť z marketingovej komunikácie kliknutím na odkaz na odhlásenie v našich e-mailoch." },
            { t: "Kontaktujte nás", p: "Ak máte otázky k týmto zásadám, kontaktujte nás na podpora@autoprofi.sk alebo zavolajte na +421 900 123 456." },
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

export default PrivacyPolicy;

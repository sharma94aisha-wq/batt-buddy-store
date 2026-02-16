import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Aké typy batérií môžem nabíjať vašimi nabíjačkami?", a: "Naše nabíjačky podporujú olovené, AGM, gélové, lítiovo-iónové a LiFePO4 batérie. Presné informácie o kompatibilite nájdete v špecifikáciách produktu." },
  { q: "Ako dlho trvá doručenie?", a: "Štandardné doručenie trvá 3–5 pracovných dní. Expresné doručenie (1–2 pracovné dni) je k dispozícii pri objednávke." },
  { q: "Majú vaše produkty záruku?", a: "Áno, všetky produkty majú 2-ročnú záruku výrobcu pokrývajúcu chyby materiálu a spracovania." },
  { q: "Môžem použiť 12V nabíjačku na 24V systém?", a: "Nie. Potrebujete nabíjačku zodpovedajúcu napätiu vašej batérie. Ponúkame 12V aj 24V varianty." },
  { q: "Čo je udržiavacia nabíjačka?", a: "Udržiavacia nabíjačka udržuje batériu plne nabitú bez prebitia, ideálna pre vozidlá dlhodobo odstavené." },
  { q: "Ako môžem vrátiť produkt?", a: "Kontaktujte náš tím podpory do 30 dní od doručenia. Poskytneme vám predplatený štítok na vrátenie a refundáciu spracujeme po prijatí tovaru." },
  { q: "Sú štartovacie boxy bezpečné pre moderné vozidlá?", a: "Áno. Naše štartovacie boxy zahŕňajú ochranu proti prepólovaniu, nadmernému prúdu a beziskrovú technológiu na ochranu elektroniky vozidla." },
  { q: "Doručujete aj do zahraničia?", a: "Momentálne doručujeme na Slovensko a do Českej republiky. Medzinárodné doručenie pripravujeme." },
];

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Časté otázky" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Často kladené otázky</h1>
        <p className="mt-2 text-muted-foreground">Nájdite odpovede na bežné otázky o našich produktoch a službách.</p>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
    <Footer />
  </div>
);

export default FAQ;

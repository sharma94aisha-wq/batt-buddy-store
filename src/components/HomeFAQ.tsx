import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

const faqItems = [
  {
    question: "Prečo si vybrať AutoProfi?",
    answer:
      "AutoProfi ponúka prémiové nabíjačky a príslušenstvo s 365-dňovou zárukou, expresným doručením v ten istý deň pri objednávke do 14:00 a bezplatným doručením do Z-BOXu alebo Z-POINTu pri objednávke nad 40 €. Kvalita, rýchlosť a spokojnosť zákazníkov sú naše priority.",
  },
  {
    question: "Aké platobné metódy akceptujete?",
    answer:
      "Akceptujeme platbu kartou online, dobierku a bankový prevod. Všetky platby sú bezpečne spracované.",
  },
  {
    question: "Ako dlho trvá doručenie?",
    answer:
      "Objednávky prijaté do 14:00 odosielame v ten istý deň. Štandardné doručenie trvá 1–3 pracovné dni v rámci Slovenska.",
  },
  {
    question: "Môžem vrátiť alebo vymeniť produkt?",
    answer:
      "Áno, ponúkame 14-dňovú záruku vrátenia peňazí. Ak nie ste spokojní, jednoducho nás kontaktujte a vrátime vám peniaze alebo vymeníme produkt.",
  },
  {
    question: "Poskytujete záruku na produkty?",
    answer:
      "Áno, na všetky naše produkty poskytujeme 365-dňovú záruku. V prípade akéhokoľvek problému nás kontaktujte a postaráme sa o riešenie.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const HomeFAQ = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.textContent = JSON.stringify(faqJsonLd);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById("faq-schema");
      if (el) el.remove();
    };
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl text-center">
          Často kladené otázky
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Všetko, čo potrebujete vedieť o AutoProfi
        </p>
        <div className="mx-auto mt-10 max-w-2xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;

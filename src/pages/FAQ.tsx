import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What types of batteries can I charge with your chargers?", a: "Our chargers support lead-acid, AGM, gel, lithium-ion, and LiFePO4 batteries. Check each product's specifications for exact compatibility." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days. Express shipping (1–2 business days) is available at checkout." },
  { q: "Do your products come with a warranty?", a: "Yes, all products include a 2-year manufacturer warranty covering defects in materials and workmanship." },
  { q: "Can I use a 12V charger on a 24V system?", a: "No. You need a charger that matches your battery's voltage. We offer both 12V and 24V options." },
  { q: "What is a battery maintainer?", a: "A maintainer (also called a float charger) keeps a battery at full charge without overcharging, ideal for vehicles stored for long periods." },
  { q: "How do I return a product?", a: "Contact our support team within 30 days of delivery. We'll provide a prepaid return label and process your refund once we receive the item." },
  { q: "Are jump starters safe for modern vehicles?", a: "Yes. Our jump starters include reverse-polarity protection, over-current protection, and spark-proof technology to safeguard your vehicle's electronics." },
  { q: "Do you ship internationally?", a: "Currently we ship within the United States and Canada. International shipping is coming soon." },
];

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-2 text-muted-foreground">Find answers to common questions about our products and services.</p>
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

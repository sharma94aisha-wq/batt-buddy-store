import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactUs = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <PageBreadcrumb items={[{ label: "Kontakt" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Kontaktujte nás</h1>
        
        <p className="mt-2 text-muted-foreground">Radi vás vypočujeme. Pošlite nám správu a odpovieme čo najskôr.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><Label htmlFor="name">Meno</Label><Input id="name" placeholder="Vaše meno" className="mt-1.5" /></div>
                <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" placeholder="vas@email.com" className="mt-1.5" /></div>
              </div>
              <div><Label htmlFor="subject">Predmet</Label><Input id="subject" placeholder="Ako vám môžeme pomôcť?" className="mt-1.5" /></div>
              <div><Label htmlFor="message">Správa</Label><Textarea id="message" placeholder="Povedzte nám viac…" rows={5} className="mt-1.5" /></div>
              <Button variant="electric" className="w-full">Odoslať správu</Button>
            </form>
          </div>

          <div className="space-y-6">
            {[
              { icon: Phone, title: "Telefón", lines: ["+421 900 123 456", "Po–Pi 8:00 – 20:00"] },
              { icon: Mail, title: "E-mail", lines: ["podpora@voltcharge.sk", "Odpovieme do 24 hodín"] },
              { icon: MapPin, title: "Adresa", lines: ["Hlavná 123", "811 01 Bratislava"] },
              { icon: Clock, title: "Otváracie hodiny", lines: ["Po–Pi: 8:00 – 20:00", "So–Ne: 9:00 – 17:00"] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
                  {lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ContactUs;

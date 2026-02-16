import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


const ContactUs = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <PageBreadcrumb items={[{ label: "Kontakt" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Kontaktujte nás</h1>
        
        <p className="mt-2 text-muted-foreground">Radi vás vypočujeme. Pošlite nám správu a odpovieme čo najskôr.</p>

        <div className="mt-10 max-w-xl">
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
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ContactUs;

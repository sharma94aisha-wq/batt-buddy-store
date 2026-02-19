import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePageSEO } from "@/hooks/usePageSEO";

const ContactUs = () => {
  usePageSEO("contact", "Kontakt | AutoProfi");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Vyplňte prosím všetky polia.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Nepodarilo sa odoslať správu. Skúste to znova.");
    } else {
      toast.success("Správa bola úspešne odoslaná!");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="w-full max-w-xl">
            <PageBreadcrumb items={[{ label: "Kontakt" }]} />
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Kontaktujte nás</h1>
            <p className="mt-2 text-muted-foreground">Radi vás vypočujeme. Pošlite nám správu a odpovieme čo najskôr.</p>

            <div className="mt-10 rounded-xl border border-border bg-card p-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><Label htmlFor="name">Meno</Label><Input id="name" placeholder="Vaše meno" className="mt-1.5" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                  <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" placeholder="vas@email.com" className="mt-1.5" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                </div>
                <div><Label htmlFor="subject">Predmet</Label><Input id="subject" placeholder="Ako vám môžeme pomôcť?" className="mt-1.5" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
                <div><Label htmlFor="message">Správa</Label><Textarea id="message" placeholder="Povedzte nám viac…" rows={5} className="mt-1.5" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} /></div>
                <Button variant="electric" className="w-full" disabled={loading}>
                  {loading ? "Odosielam…" : "Odoslať správu"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;

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
    <main className="py-12">
      <div className="container mx-auto px-4">
        <PageBreadcrumb items={[{ label: "Contact Us" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Contact Us</h1>
        
        <p className="mt-2 text-muted-foreground">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-6">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your name" className="mt-1.5" /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" /></div>
              </div>
              <div><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="How can we help?" className="mt-1.5" /></div>
              <div><Label htmlFor="message">Message</Label><Textarea id="message" placeholder="Tell us more…" rows={5} className="mt-1.5" /></div>
              <Button variant="electric" className="w-full">Send Message</Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Phone, title: "Phone", lines: ["1-800-VOLTCHARGE", "Mon–Fri 8 am – 8 pm EST"] },
              { icon: Mail, title: "Email", lines: ["support@voltcharge.com", "We reply within 24 hours"] },
              { icon: MapPin, title: "Address", lines: ["123 Power Lane", "Battery City, NY 10001"] },
              { icon: Clock, title: "Business Hours", lines: ["Mon–Fri: 8 am – 8 pm EST", "Sat–Sun: 9 am – 5 pm EST"] },
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

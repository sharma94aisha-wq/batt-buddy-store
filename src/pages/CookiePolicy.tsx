import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Cookie Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 15, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {[
            { t: "What Are Cookies?", p: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience." },
            { t: "Cookies We Use", p: "We use essential cookies (required for site functionality), analytics cookies (to understand how visitors use our site), and marketing cookies (to deliver relevant advertisements). Essential cookies cannot be disabled." },
            { t: "Third-Party Cookies", p: "Some cookies are placed by third-party services such as analytics providers and payment processors. These cookies are governed by the respective third party's privacy policy." },
            { t: "Managing Cookies", p: "You can manage or delete cookies through your browser settings. Disabling certain cookies may affect site functionality. Visit your browser's help section for instructions." },
            { t: "Contact", p: "For questions about our cookie practices, email privacy@voltcharge.com." },
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

export default CookiePolicy;

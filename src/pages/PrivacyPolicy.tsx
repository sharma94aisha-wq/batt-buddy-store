import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-12">
      <div className="container mx-auto max-w-3xl px-4">
        <PageBreadcrumb items={[{ label: "Privacy Policy" }]} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 15, 2026</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {[
            { t: "Information We Collect", p: "We collect information you provide directly, such as your name, email address, shipping address, and payment information when you make a purchase. We also automatically collect certain information about your device and browsing activity." },
            { t: "How We Use Your Information", p: "We use the information we collect to process orders, communicate with you, improve our services, and send promotional content (with your consent). We never sell your personal information to third parties." },
            { t: "Data Security", p: "We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information." },
            { t: "Cookies", p: "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences." },
            { t: "Your Rights", p: "You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails." },
            { t: "Contact Us", p: "If you have questions about this policy, contact us at privacy@voltcharge.com or call 1-800-VOLTCHARGE." },
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

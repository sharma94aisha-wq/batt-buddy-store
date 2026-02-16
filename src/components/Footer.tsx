import { Zap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-wide text-foreground">
                VOLT<span className="text-primary">CHARGE</span>
              </span>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Váš dôveryhodný zdroj prémiových 12V nabíjačiek batérií a automobilových napájacích riešení.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Produkty</h3>
            <ul className="space-y-2">
              <li><Link to="/category/charger" className="text-sm text-muted-foreground transition-colors hover:text-primary">Inteligentné nabíjačky</Link></li>
              <li><Link to="/category/jump-starter" className="text-sm text-muted-foreground transition-colors hover:text-primary">Štartovacie boxy</Link></li>
              <li><Link to="/category/compressor" className="text-sm text-muted-foreground transition-colors hover:text-primary">Kompresory</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Podpora</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Kontaktujte nás</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">Časté otázky</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted-foreground transition-colors hover:text-primary">Informácie o doručení</Link></li>
              <li><Link to="/returns" className="text-sm text-muted-foreground transition-colors hover:text-primary">Vrátenie tovaru</Link></li>
              <li><Link to="/warranty" className="text-sm text-muted-foreground transition-colors hover:text-primary">Záruka</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Kontakt</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">+421 900 123 456</li>
              <li className="text-sm text-muted-foreground">podpora@voltcharge.sk</li>
              <li className="text-sm text-muted-foreground">Po–Pi: 8:00 – 20:00</li>
              <li className="text-sm text-muted-foreground">So–Ne: 9:00 – 17:00</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 VoltCharge. Všetky práva vyhradené.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-primary">Ochrana osobných údajov</Link>
            <Link to="/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary">Obchodné podmienky</Link>
            <Link to="/cookies" className="text-xs text-muted-foreground transition-colors hover:text-primary">Zásady cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

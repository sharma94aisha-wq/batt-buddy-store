import { Zap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
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
              Your trusted source for premium 12V battery chargers and automotive power solutions.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/category/charger" className="text-sm text-muted-foreground transition-colors hover:text-primary">Smart Chargers</Link></li>
              <li><Link to="/category/jump-starter" className="text-sm text-muted-foreground transition-colors hover:text-primary">Jump Starters</Link></li>
              <li><Link to="/category/compressor" className="text-sm text-muted-foreground transition-colors hover:text-primary">Compressors</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">FAQs</Link></li>
              <li><Link to="/shipping" className="text-sm text-muted-foreground transition-colors hover:text-primary">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-sm text-muted-foreground transition-colors hover:text-primary">Returns</Link></li>
              <li><Link to="/warranty" className="text-sm text-muted-foreground transition-colors hover:text-primary">Warranty</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">1-800-VOLTCHARGE</li>
              <li className="text-sm text-muted-foreground">support@voltcharge.com</li>
              <li className="text-sm text-muted-foreground">Mon-Fri: 8am - 8pm EST</li>
              <li className="text-sm text-muted-foreground">Sat-Sun: 9am - 5pm EST</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 VoltCharge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground transition-colors hover:text-primary">Terms of Service</Link>
            <Link to="/cookies" className="text-xs text-muted-foreground transition-colors hover:text-primary">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

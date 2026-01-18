import { Zap, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-wide text-foreground">
                VOLT<span className="text-primary">CHARGE</span>
              </span>
            </a>
            <p className="mb-4 text-sm text-muted-foreground">
              Your trusted source for premium 12V battery chargers and automotive power solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Products
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Smart Chargers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Jump Starters</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Solar Chargers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Maintainers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Accessories</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">FAQs</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Shipping Info</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Returns</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Warranty</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">1-800-VOLTCHARGE</li>
              <li className="text-sm text-muted-foreground">support@voltcharge.com</li>
              <li className="text-sm text-muted-foreground">Mon-Fri: 8am - 8pm EST</li>
              <li className="text-sm text-muted-foreground">Sat-Sun: 9am - 5pm EST</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 VoltCharge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">Terms of Service</a>
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

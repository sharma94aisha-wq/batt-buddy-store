import { ShoppingCart, Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      <CartDrawer />
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold tracking-wide text-foreground">
                VOLT<span className="text-primary">CHARGE</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              <a href="#products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Products
              </a>
              <a href="#categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Categories
              </a>
              <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Why Us
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Contact
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button variant="electric" size="sm" className="hidden md:flex">
                Shop Now
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="border-t border-border py-4 md:hidden">
              <div className="flex flex-col gap-4">
                <a href="#products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Products
                </a>
                <a href="#categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Categories
                </a>
                <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Why Us
                </a>
                <a href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Contact
                </a>
                <Button variant="electric" size="sm">
                  Shop Now
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;

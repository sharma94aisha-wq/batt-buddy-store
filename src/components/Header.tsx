import { ShoppingCart, Zap, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashNav = (hash: string) => {
    setIsMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#" + hash);
    }
  };

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
              <button onClick={() => handleHashNav("products")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Produkty
              </button>
              <button onClick={() => handleHashNav("categories")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Kategórie
              </button>
              <button onClick={() => handleHashNav("features")} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Prečo my
              </button>
              <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Kontakt
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to={user ? "/account" : "/auth"}>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button variant="electric" size="sm" className="hidden md:flex">
                Nakupovať
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
                <button onClick={() => handleHashNav("products")} className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Produkty
                </button>
                <button onClick={() => handleHashNav("categories")} className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Kategórie
                </button>
                <button onClick={() => handleHashNav("features")} className="text-left text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Prečo my
                </button>
                <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Kontakt
                </Link>
                <Link to={user ? "/account" : "/auth"} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {user ? "Môj účet" : "Prihlásiť sa"}
                </Link>
                <Button variant="electric" size="sm">
                  Nakupovať
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

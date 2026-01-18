import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import heroImage from "@/assets/hero-charger.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      {/* Glowing orb effect */}
      <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px]" />
      
      <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Car Battery Chargers</span>
            </div>
            
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Power Up Your
              <span className="block text-glow text-primary"> Vehicle</span>
            </h1>
            
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Professional-grade 12V battery chargers built for reliability. 
              Fast charging, smart diagnostics, and built to last a lifetime.
            </p>
            
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <Button variant="electric" size="xl">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="electricOutline" size="xl">
                View Catalog
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">2 Year</p>
                  <p className="text-xs text-muted-foreground">Warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Fast</p>
                  <p className="text-xs text-muted-foreground">Charging</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">24/7</p>
                  <p className="text-xs text-muted-foreground">Support</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="animate-float relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-3xl" />
              <img
                src={heroImage}
                alt="Professional 12V Car Battery Charger"
                className="relative z-10 w-full rounded-2xl shadow-product"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 z-20 rounded-xl border border-border bg-card p-4 shadow-card">
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="font-display text-2xl font-bold text-primary">$49.99</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

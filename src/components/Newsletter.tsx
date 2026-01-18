import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Newsletter</span>
          </div>
          
          <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Stay Charged with Updates
          </h2>
          <p className="mb-8 text-muted-foreground">
            Subscribe to get exclusive deals, new product alerts, and expert tips delivered to your inbox.
          </p>
          
          <form className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 flex-1 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
            <Button variant="electric" size="lg" className="h-12">
              Subscribe
            </Button>
          </form>
          
          <p className="mt-4 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

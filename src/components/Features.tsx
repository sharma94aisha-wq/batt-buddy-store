import { Shield, Truck, Zap, Award, RefreshCw, CreditCard } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery to Z-BOX / Z-POINT on orders over €40.",
  },
  {
    icon: Shield,
    title: "365-Day Warranty",
    description: "All products come with a comprehensive 365-day warranty.",
  },
  {
    icon: Zap,
    title: "Same-Day Shipping",
    description: "Order before 2 PM and we ship the same day.",
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Every product tested and certified for performance.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy on all items.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Multiple secure payment options for your convenience.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why Choose <span className="text-primary">VoltCharge</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We're committed to providing the best products and service in the industry.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/30"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

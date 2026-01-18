import { Battery, Zap, Sun, Gauge, Wrench, Car } from "lucide-react";

const categories = [
  {
    icon: Battery,
    name: "Smart Chargers",
    count: 24,
    description: "Intelligent charging with auto-detection",
  },
  {
    icon: Zap,
    name: "Jump Starters",
    count: 18,
    description: "Emergency power when you need it",
  },
  {
    icon: Sun,
    name: "Solar Chargers",
    count: 12,
    description: "Eco-friendly portable power",
  },
  {
    icon: Gauge,
    name: "Maintainers",
    count: 15,
    description: "Keep batteries in peak condition",
  },
  {
    icon: Wrench,
    name: "Professional",
    count: 20,
    description: "Heavy-duty workshop equipment",
  },
  {
    icon: Car,
    name: "Accessories",
    count: 35,
    description: "Cables, clamps, and adapters",
  },
];

const Categories = () => {
  return (
    <section id="categories" className="bg-secondary/30 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Shop by <span className="text-primary">Category</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Find the perfect charger for your needs from our comprehensive collection.
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <a
                key={category.name}
                href={`#${category.name.toLowerCase().replace(" ", "-")}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-glow"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                  <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="mt-1 text-xs text-primary">{category.count} products</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;

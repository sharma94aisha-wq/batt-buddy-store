import { Battery, Zap, Wind } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    icon: Battery,
    name: "12/24V Car Battery Charger",
    slug: "charger",
    description: "Intelligent charging with auto-detection for 12V and 24V batteries",
  },
  {
    icon: Zap,
    name: "Jump Starter (Booster)",
    slug: "jump-starter",
    description: "Emergency power when you need it most",
  },
  {
    icon: Wind,
    name: "Compressor",
    slug: "compressor",
    description: "Portable air compressors and tire inflators",
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
            Find the perfect product for your needs from our comprehensive collection.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-glow"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                  <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;

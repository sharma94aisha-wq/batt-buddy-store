import ProductCard from "@/components/ProductCard";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  {
    id: 1,
    image: product1,
    name: "Smart 12V Battery Charger with LCD Display",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 234,
    badge: "Best Seller",
  },
  {
    id: 2,
    image: product2,
    name: "Heavy Duty Jump Starter & Battery Charger",
    price: 129.99,
    rating: 4.9,
    reviews: 189,
    badge: "Pro",
  },
  {
    id: 3,
    image: product3,
    name: "Solar Powered Portable Battery Charger",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 156,
    badge: "Eco",
  },
  {
    id: 4,
    image: product4,
    name: "Multi-Stage Battery Charger Maintainer",
    price: 189.99,
    rating: 5.0,
    reviews: 98,
  },
];

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Featured <span className="text-primary">Products</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our top-rated 12V battery chargers trusted by professionals and enthusiasts worldwide.
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviews={product.reviews}
              badge={product.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

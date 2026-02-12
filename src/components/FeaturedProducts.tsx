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
  {
    id: 5,
    image: product1,
    name: "Compact 6V/12V Automatic Battery Charger",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.5,
    reviews: 312,
    badge: "Sale",
  },
  {
    id: 6,
    image: product2,
    name: "Professional Bench Battery Charger 40A",
    price: 249.99,
    rating: 4.9,
    reviews: 67,
    badge: "Pro",
  },
  {
    id: 7,
    image: product3,
    name: "Waterproof Marine Battery Charger",
    price: 89.99,
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 8,
    image: product4,
    name: "Lithium-Ion Battery Smart Charger",
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviews: 203,
    badge: "New",
  },
  {
    id: 9,
    image: product1,
    name: "Motorcycle & Powersport Battery Tender",
    price: 29.99,
    rating: 4.6,
    reviews: 421,
    badge: "Best Seller",
  },
  {
    id: 10,
    image: product2,
    name: "Dual Bank Onboard Battery Charger",
    price: 169.99,
    rating: 4.7,
    reviews: 88,
  },
  {
    id: 11,
    image: product3,
    name: "AGM Deep Cycle Battery Charger",
    price: 109.99,
    originalPrice: 139.99,
    rating: 4.8,
    reviews: 176,
    badge: "Sale",
  },
  {
    id: 12,
    image: product4,
    name: "Ultra-Fast 50A Battery Charger Station",
    price: 349.99,
    rating: 4.9,
    reviews: 42,
    badge: "Pro",
  },
  {
    id: 13,
    image: product1,
    name: "Trickle Charger with Float Mode",
    price: 19.99,
    rating: 4.4,
    reviews: 567,
  },
  {
    id: 14,
    image: product2,
    name: "RV & Camper Battery Charging System",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 134,
  },
  {
    id: 15,
    image: product3,
    name: "Gel Cell Battery Charger & Conditioner",
    price: 69.99,
    rating: 4.5,
    reviews: 198,
    badge: "Eco",
  },
  {
    id: 16,
    image: product4,
    name: "Workshop Multi-Battery Charging Station",
    price: 449.99,
    rating: 5.0,
    reviews: 31,
    badge: "Pro",
  },
  {
    id: 17,
    image: product1,
    name: "Cold Weather Battery Charger & Heater",
    price: 94.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 89,
    badge: "New",
  },
  {
    id: 18,
    image: product2,
    name: "Portable Emergency Battery Pack 2000A",
    price: 159.99,
    rating: 4.8,
    reviews: 256,
    badge: "Best Seller",
  },
  {
    id: 19,
    image: product3,
    name: "Universal Battery Analyzer & Charger",
    price: 74.99,
    rating: 4.3,
    reviews: 112,
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

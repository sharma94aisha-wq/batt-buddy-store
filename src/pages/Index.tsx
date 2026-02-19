import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Features from "@/components/Features";
import HomeFAQ from "@/components/HomeFAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";

const Index = () => {
  usePageSEO("home", "AutoProfi | Premium nabíjačky autobatérií");
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <Categories />
        <Features />
        <HomeFAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Resources } from "@/components/Resources";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CrawlForm } from "@/components/CrawlForm";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/20 via-brand-blue/20 to-purple-300/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/10 via-brand-purple/10 to-brand-blue/10"></div>
      </div>
      
      <Header />
      <main className="pt-20">
        <Hero />
        <Categories />
        <Resources />
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Crawl a Website</h2>
            <CrawlForm />
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Index;
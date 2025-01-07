import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Resources } from "@/components/Resources";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/20 via-brand-blue/20 to-purple-300/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/10 via-brand-purple/10 to-brand-blue/10"></div>
      </div>
      
      <Header />
      <main className="pt-20"> {/* Add padding top to account for fixed header */}
        <Hero />
        <Categories />
        <Resources />
      </main>
    </div>
  );
};

export default Index;
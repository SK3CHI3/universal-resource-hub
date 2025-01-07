import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Resources } from "@/components/Resources";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <Resources />
    </div>
  );
};

export default Index;
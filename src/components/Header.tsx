import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Header = () => {
  const { toast } = useToast();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      toast({
        title: "Section not found",
        description: "The requested section could not be found.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => scrollToSection('hero')}
          className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent cursor-pointer"
        >
          Universal Resource Hub
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection('hero')}
            className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('categories')}
            className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
          >
            Categories
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
          >
            About
          </button>
        </nav>
      </div>
    </header>
  );
};
import { Search, Menu, X, Github, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Section not found",
        description: "The requested section could not be found.",
        variant: "destructive",
      });
    }
  };

  const NavLinks = () => (
    <>
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
        onClick={() => scrollToSection('resources')}
        className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
      >
        Resources
      </button>
      <div className="flex items-center gap-4">
        <a
          href="https://t.me/techtinker0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </>
  );

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          onClick={() => scrollToSection('hero')}
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent cursor-pointer"
        >
          Universal Resource Hub
        </div>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-6 mt-6">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
};
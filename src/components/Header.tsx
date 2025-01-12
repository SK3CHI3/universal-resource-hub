import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavLinks } from "./navigation/NavLinks";
import { MobileMenu } from "./navigation/MobileMenu";
import { Logo } from "./Logo";

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

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          onClick={() => scrollToSection('hero')}
          className="cursor-pointer"
        >
          <Logo />
        </div>

        {isMobile ? (
          <MobileMenu 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            onScrollToSection={scrollToSection} 
          />
        ) : (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks onScrollToSection={scrollToSection} />
          </nav>
        )}
      </div>
    </header>
  );
};
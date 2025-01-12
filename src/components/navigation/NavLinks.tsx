import { MessageCircle, Github } from "lucide-react";

interface NavLinksProps {
  onScrollToSection: (sectionId: string) => void;
  setIsOpen?: (isOpen: boolean) => void;
}

export const NavLinks = ({ onScrollToSection, setIsOpen }: NavLinksProps) => {
  return (
    <>
      <button 
        onClick={() => onScrollToSection('hero')}
        className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
      >
        Home
      </button>
      <button 
        onClick={() => onScrollToSection('categories')}
        className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors"
      >
        Categories
      </button>
      <button 
        onClick={() => onScrollToSection('resources')}
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
};
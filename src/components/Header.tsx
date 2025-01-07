import { Search } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl backdrop-blur-md bg-white/30 dark:bg-gray-900/30 z-50 rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
          Universal Resource Hub
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors">
            Categories
          </a>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-brand-purple dark:hover:text-brand-blue transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};
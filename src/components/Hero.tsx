
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useResourceStore } from "@/store/resources";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/components/ui/use-toast";

export const Hero = () => {
  const [searchInput, setSearchInput] = useState("");
  const { setSearchQuery } = useResourceStore();
  const debouncedSearch = useDebounce(searchInput, 300);
  const { toast } = useToast();

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      toast({
        title: "Searching...",
        description: `Finding resources matching "${searchInput}"`,
      });
      const element = document.getElementById('resources');
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div id="hero" className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Animated background elements - Enhanced visibility */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient background with increased opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/30 via-brand-blue/20 to-purple-300/30 animate-gradient" />
        
        {/* Floating orbs with increased size and opacity */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-brand-blue/30 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Additional orbs for more visual interest */}
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-2xl animate-float-delayed" />
        
        {/* Enhanced mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-blue/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-blue-500 dark:text-transparent">
          Find Free Resources to Learn, Create, and Innovate
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
          Discover thousands of free resources for technology, design, education, and more.
        </p>
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="What are you looking for? (e.g., Free Python Course, Design Templates)"
            className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-brand-purple backdrop-blur-sm bg-white/70 dark:bg-gray-900/70"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        </form>
      </div>
    </div>
  );
};

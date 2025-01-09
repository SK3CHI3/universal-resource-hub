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
    if (debouncedSearch.length > 0) {
      const element = document.getElementById('resources');
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
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
    <div id="hero" className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-brand-blue/10 to-purple-300/10 animate-gradient" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
          Find Free Resources to Learn, Create, and Innovate
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Discover thousands of free resources for technology, design, education, and more.
        </p>
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="What are you looking for? (e.g., Free Python Course, Design Templates)"
            className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-gray-200 focus:border-brand-purple backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </form>
      </div>
    </div>
  );
};

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Hero = () => {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5 -z-10" />
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent animate-float">
        Find Free Resources to Learn, Create, and Innovate
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Discover thousands of free resources for technology, design, education, and more.
      </p>
      <div className="relative w-full max-w-2xl">
        <Input
          type="text"
          placeholder="What are you looking for? (e.g., Free Python Course, Design Templates)"
          className="w-full h-12 pl-12 pr-4 rounded-lg border-2 border-gray-200 focus:border-brand-purple backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

import { Book, Code, Palette, Briefcase, GraduationCap, Music, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useResourceStore } from "@/store/resources";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

const categories: Category[] = [
  { 
    name: "Technology", 
    icon: Code, 
    color: "from-blue-500/20 to-blue-600/20 dark:from-blue-500/10 dark:to-blue-600/10",
    description: "Programming tutorials, coding resources, and tech documentation"
  },
  { 
    name: "Design", 
    icon: Palette, 
    color: "from-purple-500/20 to-purple-600/20 dark:from-purple-500/10 dark:to-purple-600/10",
    description: "UI kits, design templates, and creative assets"
  },
  { 
    name: "Business", 
    icon: Briefcase, 
    color: "from-green-500/20 to-green-600/20 dark:from-green-500/10 dark:to-green-600/10",
    description: "Business templates, guides, and entrepreneurship resources"
  },
  { 
    name: "Education", 
    icon: GraduationCap, 
    color: "from-yellow-500/20 to-yellow-600/20 dark:from-yellow-500/10 dark:to-yellow-600/10",
    description: "Online courses, tutorials, and learning materials"
  },
  { 
    name: "Books", 
    icon: Book, 
    color: "from-red-500/20 to-red-600/20 dark:from-red-500/10 dark:to-red-600/10",
    description: "Free ebooks, digital publications, and reading materials"
  },
  { 
    name: "Music", 
    icon: Music, 
    color: "from-pink-500/20 to-pink-600/20 dark:from-pink-500/10 dark:to-pink-600/10",
    description: "Music theory, instruments, and audio resources"
  },
  { 
    name: "Sponsored", 
    icon: Award, 
    color: "from-amber-500/20 to-amber-600/20 dark:from-amber-500/10 dark:to-amber-600/10",
    description: "Free resources provided by our sponsors and partners"
  },
];

export const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useResourceStore();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  return (
    <div id="categories" className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
        Popular Categories
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Browse through our curated collection of free resources across various categories
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Card
            key={category.name}
            className={cn(
              "p-6 transition-all cursor-pointer group relative overflow-hidden",
              "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
              "border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              selectedCategory === category.name && "ring-2 ring-brand-purple dark:ring-brand-blue"
            )}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} transition-opacity`} />
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform">
                  <category.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
                {category.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

import { Book, Code, Palette, Briefcase, GraduationCap, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useResourceStore } from "@/store/resources";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

const categories: Category[] = [
  { 
    name: "Technology", 
    icon: Code, 
    color: "from-blue-500 to-blue-600",
    description: "Programming tutorials, coding resources, and tech documentation"
  },
  { 
    name: "Design", 
    icon: Palette, 
    color: "from-purple-500 to-purple-600",
    description: "UI kits, design templates, and creative assets"
  },
  { 
    name: "Business", 
    icon: Briefcase, 
    color: "from-green-500 to-green-600",
    description: "Business templates, guides, and entrepreneurship resources"
  },
  { 
    name: "Education", 
    icon: GraduationCap, 
    color: "from-yellow-500 to-yellow-600",
    description: "Online courses, tutorials, and learning materials"
  },
  { 
    name: "Books", 
    icon: Book, 
    color: "from-red-500 to-red-600",
    description: "Free ebooks, digital publications, and reading materials"
  },
  { 
    name: "Music", 
    icon: Music, 
    color: "from-pink-500 to-pink-600",
    description: "Music theory, instruments, and audio resources"
  },
];

export const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useResourceStore();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  return (
    <div id="categories" className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-4">Popular Categories</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Browse through our curated collection of free resources across various categories
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Card
            key={category.name}
            className={cn(
              "p-6 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden",
              selectedCategory === category.name && "ring-2 ring-brand-purple"
            )}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform">
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {category.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
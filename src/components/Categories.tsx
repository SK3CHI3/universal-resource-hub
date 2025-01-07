import { Book, Code, Palette, Briefcase, Graduation, Music } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "Technology", icon: Code, color: "from-blue-500 to-blue-600" },
  { name: "Design", icon: Palette, color: "from-purple-500 to-purple-600" },
  { name: "Business", icon: Briefcase, color: "from-green-500 to-green-600" },
  { name: "Education", icon: Graduation, color: "from-yellow-500 to-yellow-600" },
  { name: "Books", icon: Book, color: "from-red-500 to-red-600" },
  { name: "Music", icon: Music, color: "from-pink-500 to-pink-600" },
];

export const Categories = () => {
  return (
    <div className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gray-100 group-hover:scale-110 transition-transform">
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
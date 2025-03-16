
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResourceStore } from "@/store/resources";
import { Filter, Award } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export const ResourceFilters = () => {
  const resources = useResourceStore((state) => state.resources);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const setSelectedCategory = useResourceStore((state) => state.setSelectedCategory);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(resources.map(resource => resource.category));
    return Array.from(uniqueCategories);
  }, [resources]);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Filter className="h-4 w-4 text-gray-500" />
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedCategory(null)}
      >
        All
      </Button>
      {categories.map((category) => {
        const isSponsored = category === "Sponsored";
        
        return (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={cn(
              "cursor-pointer hover:bg-primary/90",
              isSponsored && selectedCategory !== category && "border-amber-500 dark:border-amber-400",
              isSponsored && selectedCategory === category && "bg-gradient-to-r from-amber-500 to-orange-500",
              isSponsored && "flex items-center gap-1"
            )}
            onClick={() => setSelectedCategory(category)}
          >
            {isSponsored && <Award className="w-3 h-3" />}
            {category}
          </Badge>
        );
      })}
    </div>
  );
};

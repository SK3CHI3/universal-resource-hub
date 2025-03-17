
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResourceStore } from "@/store/resources";
import { Filter } from "lucide-react";
import { useMemo } from "react";

export const ResourceFilters = () => {
  const resources = useResourceStore((state) => state.resources);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const setSelectedCategory = useResourceStore((state) => state.setSelectedCategory);

  const categories = useMemo(() => {
    // Get unique categories from resources
    const uniqueCategories = new Set(resources.map(resource => resource.category));
    return Array.from(uniqueCategories).sort();
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
      {categories.length > 0 ? (
        categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/90"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))
      ) : (
        <span className="text-sm text-gray-500">No categories available</span>
      )}
    </div>
  );
};

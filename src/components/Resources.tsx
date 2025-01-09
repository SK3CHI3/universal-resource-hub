import { ResourceCard } from "./ResourceCard";
import { useResourceStore } from "@/store/resources";
import { Search } from "lucide-react";
import { useMemo } from "react";

export const Resources = () => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  
  const filteredResources = useMemo(() => getFilteredResources(), [getFilteredResources]);

  return (
    <div className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {filteredResources.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-4">
              Available Resources
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              {selectedCategory 
                ? `Showing resources in ${selectedCategory}`
                : 'Showing all available resources'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} {...resource} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">No resources found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchQuery
                ? `No resources found matching "${searchQuery}"`
                : selectedCategory
                ? `No resources found in ${selectedCategory}`
                : 'No resources available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
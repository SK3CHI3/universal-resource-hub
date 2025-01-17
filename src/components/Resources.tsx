import { memo, useEffect, useState } from "react";
import { ResourceList } from "./ResourceList";
import { ResourceControls } from "./ResourceControls";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceSkeleton } from "./ResourceSkeleton";
import { useResourceStore } from "@/store/resources";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export const Resources = memo(() => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const viewMode = useResourceStore((state) => state.viewMode);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Handle initial load and filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, searchQuery || selectedCategory ? 300 : 1000);
    return () => clearTimeout(timer);
  }, [selectedCategory, debouncedSearchQuery]);

  // Get filtered resources
  const filteredResources = getFilteredResources();

  // Generate skeleton items
  const skeletons = Array(6).fill(0).map((_, i) => (
    <ResourceSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
  ));

  return (
    <section 
      id="resources" 
      className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-background"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Available Resources
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {selectedCategory 
            ? `Showing resources in ${selectedCategory}`
            : 'Showing all available resources'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <ResourceFilters />
          </div>
          <ResourceControls />
        </div>

        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skeletons}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {skeletons}
            </div>
          )
        ) : filteredResources.length > 0 ? (
          <ResourceList resources={filteredResources} viewMode={viewMode} />
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
    </section>
  );
});

Resources.displayName = "Resources";
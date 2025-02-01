import { memo, useEffect, useState, useMemo } from "react";
import { ResourceList } from "./ResourceList";
import { ResourceControls } from "./ResourceControls";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceSkeleton } from "./ResourceSkeleton";
import { useResourceStore } from "@/store/resources";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useVirtualizer } from "@tanstack/react-virtual";

export const Resources = memo(() => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const viewMode = useResourceStore((state) => state.viewMode);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Increased debounce time
  
  // Handle initial load with a longer delay to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Memoize filtered resources to prevent unnecessary recalculations
  const resources = useMemo(() => {
    return getFilteredResources();
  }, [getFilteredResources, debouncedSearchQuery, selectedCategory]);

  // Handle search and filter changes with optimized loading states
  useEffect(() => {
    if (!isInitialLoading && (searchQuery || selectedCategory)) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, debouncedSearchQuery, isInitialLoading]);

  const isLoading = isInitialLoading || isSearching;

  // Generate skeleton items with proper key
  const skeletons = useMemo(() => 
    Array(6).fill(0).map((_, i) => (
      <ResourceSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
    )), [viewMode]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-background">
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
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"}>
            {skeletons}
          </div>
        ) : resources.length > 0 ? (
          <ResourceList resources={resources} viewMode={viewMode} />
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
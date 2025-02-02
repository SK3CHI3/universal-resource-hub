import { memo, useEffect } from "react";
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
  const isLoading = useResourceStore((state) => state.isLoading);
  const fetchResources = useResourceStore((state) => state.fetchResources);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const resources = getFilteredResources();

  const loadingSkeletons = Array(6).fill(null).map((_, index) => (
    <ResourceSkeleton key={`skeleton-${index}`} viewMode={viewMode} />
  ));

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
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
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }>
            {loadingSkeletons}
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
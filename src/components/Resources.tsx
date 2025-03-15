
import { memo, useRef, useState, useCallback } from "react";
import { ResourceList } from "./ResourceList";
import { ResourceControls } from "./ResourceControls";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceSkeleton } from "./ResourceSkeleton";
import { useResourceStore } from "@/store/resources";
import { Search } from "lucide-react";
import { useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import throttle from "lodash.throttle";

const ITEMS_PER_BATCH = 9;

export const Resources = memo(() => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const setSelectedCategory = useResourceStore((state) => state.setSelectedCategory);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const viewMode = useResourceStore((state) => state.viewMode);
  const resources = useResourceStore((state) => state.resources);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_BATCH);
  
  const resourcesRef = useRef(null);
  const isInView = useInView(resourcesRef, { amount: 0.1, once: false });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  // Memoize filtered resources
  const filteredResources = useMemo(() => {
    console.log("Filtering resources with query:", debouncedSearchQuery);
    return getFilteredResources();
  }, [getFilteredResources, selectedCategory, debouncedSearchQuery]);

  // Calculate visible resources with infinite scroll
  const visibleResources = useMemo(() => {
    return filteredResources.slice(0, displayCount);
  }, [filteredResources, displayCount]);

  // Reset to initial count when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_BATCH);
  }, [selectedCategory, debouncedSearchQuery]);

  // When search begins, set searching state
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
    }
  }, [searchQuery]);

  // Handle initial load and subsequent filter changes
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, debouncedSearchQuery, isInitialLoad]);

  // Throttled load more handler
  const handleLoadMore = useCallback(
    throttle(() => {
      console.log("Loading more resources...");
      setDisplayCount(prev => prev + ITEMS_PER_BATCH);
    }, 500),
    []
  );

  // Check if there are more items to load
  const hasMore = visibleResources.length < filteredResources.length;

  // Generate related categories for "no results" state
  const relatedCategories = useMemo(() => {
    if (filteredResources.length > 0 || !searchQuery) return [];
    
    // Get all unique categories from resources except the current one
    const allCategories = [...new Set(resources.map(r => r.category))];
    const otherCategories = allCategories.filter(c => c !== selectedCategory);
    
    // Return up to 4 random categories
    return otherCategories
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [filteredResources.length, searchQuery, resources, selectedCategory]);

  // Generate skeleton items based on view mode
  const skeletons = useMemo(() => (
    Array(ITEMS_PER_BATCH).fill(0).map((_, i) => (
      <ResourceSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
    ))
  ), [viewMode]);

  return (
    <section 
      id="resources" 
      ref={resourcesRef}
      className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50 min-h-screen relative"
    >
      <motion.div 
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none"
      />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-4"
        >
          {isLoading ? "Loading Resources..." : "Available Resources"}
        </motion.h2>
        
        {!isInitialLoad && (
          <>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              {selectedCategory 
                ? `Showing resources in ${selectedCategory}`
                : 'Showing all available resources'}
              {searchQuery && ` matching "${searchQuery}"`}
              {filteredResources.length > 0 && 
                ` (${visibleResources.length} of ${filteredResources.length})`}
            </motion.p>

            <div className="space-y-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <ResourceFilters />
              </div>
              <ResourceControls />
            </div>
          </>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading || isSearching ? (
            <div className="space-y-6">
              {isSearching && searchQuery && (
                <p className="text-center py-6 text-lg">
                  Searching for "{searchQuery}"...
                </p>
              )}
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
                "flex flex-col gap-4"
              }>
                {skeletons}
              </div>
            </div>
          ) : (
            <>
              {visibleResources.length > 0 ? (
                <ResourceList 
                  resources={visibleResources} 
                  viewMode={viewMode} 
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                  <h2 className="text-2xl font-bold mb-2">No resources found</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchQuery
                      ? `No resources found matching "${searchQuery}"`
                      : selectedCategory
                      ? `No resources found in ${selectedCategory}`
                      : 'No resources available'}
                  </p>
                  
                  {relatedCategories.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Try these categories instead:</h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {relatedCategories.map(category => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className="px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple rounded-full transition-colors"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      if (searchQuery) {
                        useResourceStore.getState().setSearchQuery('');
                      }
                    }}
                    className="mt-6 px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md transition-colors"
                  >
                    View all resources
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
});

Resources.displayName = "Resources";

import { memo, useRef } from "react";
import { ResourceList } from "./ResourceList";
import { ResourceControls } from "./ResourceControls";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceSkeleton } from "./ResourceSkeleton";
import { useResourceStore } from "@/store/resources";
import { Search } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";

export const Resources = memo(() => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const viewMode = useResourceStore((state) => state.viewMode);
  const [isLoading, setIsLoading] = useState(true);
  const resourcesRef = useRef(null);
  const isInView = useInView(resourcesRef, { amount: 0.1, once: false });
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  
  // Preload and memoize filtered resources
  const filteredResources = useMemo(() => {
    console.log("Filtering resources with query:", searchQuery);
    return getFilteredResources();
  }, [getFilteredResources, selectedCategory, searchQuery]);

  // Simulate loading state for smoother transitions
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Log when resources section comes into view
  useEffect(() => {
    if (isInView && !isLoading) {
      console.log("Resources section in view");
    }
  }, [isInView, isLoading]);

  const skeletons = useMemo(() => (
    Array(6).fill(0).map((_, i) => (
      <ResourceSkeleton key={`skeleton-${i}`} />
    ))
  ), []);

  return (
    <div 
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
        
        {!isLoading && (
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skeletons}
            </div>
          ) : (
            filteredResources.length > 0 ? (
              <ResourceList resources={filteredResources} viewMode={viewMode} />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                <h2 className="text-2xl font-bold mb-2">No resources found</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchQuery
                    ? `No resources found matching "${searchQuery}"`
                    : selectedCategory
                    ? `No resources found in ${selectedCategory}`
                    : 'No resources available'}
                </p>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
});

Resources.displayName = "Resources";
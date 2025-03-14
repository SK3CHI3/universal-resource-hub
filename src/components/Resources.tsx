import { memo, useRef, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 9;

export const Resources = memo(() => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const viewMode = useResourceStore((state) => state.viewMode);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchQuery]);

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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, debouncedSearchQuery, isInitialLoad]);

  // Generate skeleton items based on view mode
  const skeletons = useMemo(() => (
    Array(ITEMS_PER_PAGE).fill(0).map((_, i) => (
      <ResourceSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
    ))
  ), [viewMode]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    resourcesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletons}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {skeletons}
              </div>
            )
          ) : (
            <>
              {paginatedResources.length > 0 ? (
                <>
                  <ResourceList resources={paginatedResources} viewMode={viewMode} />
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
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
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
});

Resources.displayName = "Resources";

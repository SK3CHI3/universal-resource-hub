import { memo, useRef, useState, useCallback, useEffect } from "react";
import { ResourceList } from "./ResourceList";
import { ResourceControls } from "./ResourceControls";
import { ResourceFilters } from "./ResourceFilters";
import { ResourceSkeleton } from "./ResourceSkeleton";
import { useResourceStore } from "@/store/resources";
import { Search, Lock } from "lucide-react";
import { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import throttle from "lodash.throttle";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_BATCH = 9;

export const Resources = memo(() => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const fetchResources = useResourceStore((state) => state.fetchResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const viewMode = useResourceStore((state) => state.viewMode);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_BATCH);
  
  const resourcesRef = useRef(null);
  const isInView = useInView(resourcesRef, { amount: 0.1, once: false });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    console.log("Filtering resources with query:", debouncedSearchQuery);
    let resources = getFilteredResources();
    
    if (selectedCategory === "Sponsored" && !isPremium) {
      // Keep showing the resources, they'll be locked in the UI
    }
    
    return resources;
  }, [getFilteredResources, selectedCategory, debouncedSearchQuery, isPremium]);

  const visibleResources = useMemo(() => {
    return filteredResources.slice(0, displayCount);
  }, [filteredResources, displayCount]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_BATCH);
  }, [selectedCategory, debouncedSearchQuery]);

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

  const handleLoadMore = useCallback(
    throttle(() => {
      console.log("Loading more resources...");
      setDisplayCount(prev => prev + ITEMS_PER_BATCH);
    }, 500),
    []
  );

  const hasMore = visibleResources.length < filteredResources.length;

  const skeletons = useMemo(() => (
    Array(ITEMS_PER_BATCH).fill(0).map((_, i) => (
      <ResourceSkeleton key={`skeleton-${i}`} viewMode={viewMode} />
    ))
  ), [viewMode]);

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleUpgrade = () => {
    navigate('/subscription');
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
              {selectedCategory === "Sponsored" && !isAuthenticated ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-10 text-center shadow-md border border-amber-200 dark:border-amber-800"
                >
                  <Lock className="w-16 h-16 mx-auto mb-6 text-amber-500" />
                  <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                    Please sign in to view sponsored resources. These resources include partially or fully funded courses and premium content.
                  </p>
                  <Button onClick={handleSignIn} className="bg-amber-500 hover:bg-amber-600">
                    Sign In to Continue
                  </Button>
                </motion.div>
              ) : selectedCategory === "Sponsored" && !isPremium ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-10 text-center shadow-md border border-amber-200 dark:border-amber-800"
                >
                  <Lock className="w-16 h-16 mx-auto mb-6 text-amber-500" />
                  <h2 className="text-2xl font-bold mb-2">Premium Subscription Required</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                    Upgrade to premium to access sponsored resources. These resources include partially or fully funded courses and premium content.
                  </p>
                  <Button onClick={handleUpgrade} className="bg-amber-500 hover:bg-amber-600">
                    Upgrade to Premium
                  </Button>
                </motion.div>
              ) : visibleResources.length > 0 ? (
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

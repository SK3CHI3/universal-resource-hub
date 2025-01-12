import { ResourceCard } from "./ResourceCard";
import { ResourceSkeleton } from "./ResourceSkeleton";
import { useResourceStore } from "@/store/resources";
import { Search } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Resources = () => {
  const getFilteredResources = useResourceStore((state) => state.getFilteredResources);
  const searchQuery = useResourceStore((state) => state.searchQuery);
  const selectedCategory = useResourceStore((state) => state.selectedCategory);
  const [isLoading, setIsLoading] = useState(true);
  
  const filteredResources = useMemo(() => getFilteredResources(), [getFilteredResources, selectedCategory, searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const skeletons = Array(6).fill(0).map((_, i) => (
    <ResourceSkeleton key={`skeleton-${i}`} />
  ));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div id="resources" className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-4"
        >
          {isLoading ? "Loading Resources..." : "Available Resources"}
        </motion.h2>
        {!isLoading && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            {selectedCategory 
              ? `Showing resources in ${selectedCategory}`
              : 'Showing all available resources'}
            {searchQuery && ` matching "${searchQuery}"`}
          </motion.p>
        )}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {isLoading ? skeletons : (
              filteredResources.length > 0 ? (
                filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    variants={item}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="animate-float-delayed"
                  >
                    <ResourceCard {...resource} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-16"
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
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
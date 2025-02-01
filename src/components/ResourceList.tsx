import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo, useMemo } from "react";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
}

export const ResourceList = memo(({ resources, viewMode }: ResourceListProps) => {
  // Memoize the resource items to prevent unnecessary re-renders
  const resourceItems = useMemo(() => {
    return resources.map((resource) => {
      if (viewMode === 'grid') {
        return <ResourceCard key={resource.id} {...resource} />;
      }
      return <ResourceListItem key={resource.id} {...resource} />;
    });
  }, [resources, viewMode]);

  // Render optimized list with proper container
  return (
    <div 
      className={
        viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
          : "flex flex-col gap-4"
      }
    >
      {resourceItems}
    </div>
  );
});

ResourceList.displayName = "ResourceList";
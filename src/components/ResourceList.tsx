import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo } from "react";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
}

export const ResourceList = memo(({ resources, viewMode }: ResourceListProps) => {
  return (
    <div 
      className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
      }
    >
      {resources.map((resource) => (
        viewMode === 'grid' ? (
          <ResourceCard key={resource.id} {...resource} />
        ) : (
          <ResourceListItem key={resource.id} {...resource} />
        )
      ))}
    </div>
  );
});

ResourceList.displayName = "ResourceList";
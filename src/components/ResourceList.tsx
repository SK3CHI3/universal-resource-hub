import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo } from "react";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
}

// Memoize individual resource components
const MemoizedResourceCard = memo(ResourceCard);
const MemoizedResourceListItem = memo(ResourceListItem);

export const ResourceList = memo(({ resources, viewMode }: ResourceListProps) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <MemoizedResourceCard key={resource.id} {...resource} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {resources.map((resource) => (
        <MemoizedResourceListItem key={resource.id} {...resource} />
      ))}
    </div>
  );
});

ResourceList.displayName = "ResourceList";

export default ResourceList;
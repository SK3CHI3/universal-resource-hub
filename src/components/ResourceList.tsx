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

export const ResourceList = ({ resources, viewMode }: ResourceListProps) => {
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
          <MemoizedResourceCard key={resource.id} {...resource} />
        ) : (
          <MemoizedResourceListItem key={resource.id} {...resource} />
        )
      ))}
    </div>
  );
};

// Memoize the entire ResourceList component
export default memo(ResourceList);
import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
}

// Memoize individual resource components
const MemoizedResourceCard = memo(ResourceCard);
const MemoizedResourceListItem = memo(ResourceListItem);

export const ResourceList = memo(({ resources, viewMode }: ResourceListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: resources.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'grid' ? 400 : 100, // Estimated height of each item
    overscan: 5, // Number of items to render outside the visible area
  });

  if (viewMode === 'grid') {
    return (
      <div 
        ref={parentRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
        style={{ height: '800px', overflowY: 'auto' }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
          >
            <MemoizedResourceCard {...resources[virtualRow.index]} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex flex-col gap-4 relative"
      style={{ height: '800px', overflowY: 'auto' }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <div
          key={virtualRow.key}
          data-index={virtualRow.index}
          ref={rowVirtualizer.measureElement}
        >
          <MemoizedResourceListItem {...resources[virtualRow.index]} />
        </div>
      ))}
    </div>
  );
});

ResourceList.displayName = "ResourceList";

export default ResourceList;
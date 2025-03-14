
import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo, useRef, useEffect, useState, useCallback } from "react";
import { FixedSizeList as List, areEqual } from "react-window";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useInView } from "framer-motion";
import throttle from "lodash.throttle";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
  onLoadMore: () => void;
  hasMore: boolean;
}

// Virtualized rendering of list items
const VirtualizedListItem = memo(({ data, index, style }: any) => {
  const resource = data.resources[index];
  return (
    <div style={style}>
      <ResourceListItem {...resource} />
    </div>
  );
}, areEqual);

VirtualizedListItem.displayName = "VirtualizedListItem";

export const ResourceList = memo(({ resources, viewMode, onLoadMore, hasMore }: ResourceListProps) => {
  const { width, height } = useWindowSize();
  const listRef = useRef<List>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreVisible = useInView(loadMoreRef, { amount: 0.5 });
  
  // Throttled function for resetting the list
  const throttledResetList = useCallback(
    throttle(() => {
      if (listRef.current) {
        listRef.current.resetAfterIndex(0);
      }
    }, 200),
    [listRef]
  );

  // Recalculate list when window resizes, using throttling
  useEffect(() => {
    throttledResetList();
  }, [width, throttledResetList]);

  // Throttled load more function
  const throttledLoadMore = useCallback(
    throttle(() => {
      if (hasMore) {
        onLoadMore();
      }
    }, 300),
    [hasMore, onLoadMore]
  );

  // Trigger load more when the load more sentinel is visible
  useEffect(() => {
    if (isLoadMoreVisible && hasMore) {
      throttledLoadMore();
    }
  }, [isLoadMoreVisible, hasMore, throttledLoadMore]);

  if (viewMode === 'grid') {
    const columnCount = width < 768 ? 1 : width < 1024 ? 2 : 3;
    const gridItems = [];
    
    // Create grid layout manually for better control
    for (let i = 0; i < resources.length; i += columnCount) {
      const rowItems = [];
      for (let j = 0; j < columnCount; j++) {
        const index = i + j;
        if (index < resources.length) {
          rowItems.push(
            <div key={resources[index].id} className="h-full">
              <ResourceCard {...resources[index]} />
            </div>
          );
        } else {
          rowItems.push(<div key={`empty-${index}`} />);
        }
      }
      gridItems.push(
        <div key={`row-${i}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {rowItems}
        </div>
      );
    }
    
    return (
      <>
        {gridItems}
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {hasMore && <div className="loader w-8 h-8 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>}
        </div>
      </>
    );
  }

  // For list view, use react-window for virtualization
  return (
    <>
      <List
        ref={listRef}
        height={Math.min(800, resources.length * 180)} // Limit height but make it larger
        width="100%"
        itemCount={resources.length}
        itemSize={180} // Approximate height of each item
        itemData={{ resources }}
      >
        {VirtualizedListItem}
      </List>
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {hasMore && <div className="loader w-8 h-8 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>}
      </div>
    </>
  );
});

ResourceList.displayName = "ResourceList";

export default ResourceList;

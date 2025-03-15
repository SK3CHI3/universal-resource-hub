
import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo, useRef, useEffect, useState, useCallback } from "react";
import { FixedSizeList as List, FixedSizeGrid as Grid, areEqual } from "react-window";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useInView } from "framer-motion";
import throttle from "lodash.throttle";
import AutoSizer from "react-virtualized-auto-sizer";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
  onLoadMore: () => void;
  hasMore: boolean;
}

// Memoized virtualized list item
const VirtualizedListItem = memo(({ data, index, style }: any) => {
  const resource = data.resources[index];
  return (
    <div style={style} className="p-2">
      <ResourceListItem {...resource} />
    </div>
  );
}, areEqual);

VirtualizedListItem.displayName = "VirtualizedListItem";

// Memoized virtualized grid cell
const VirtualizedGridCell = memo(({ data, columnIndex, rowIndex, style }: any) => {
  const { resources, columnCount } = data;
  const index = rowIndex * columnCount + columnIndex;
  
  if (index >= resources.length) {
    return <div style={style} />;
  }
  
  return (
    <div style={{
      ...style,
      padding: '8px',
    }}>
      <ResourceCard {...resources[index]} />
    </div>
  );
}, areEqual);

VirtualizedGridCell.displayName = "VirtualizedGridCell";

export const ResourceList = memo(({ resources, viewMode, onLoadMore, hasMore }: ResourceListProps) => {
  const { width } = useWindowSize();
  const listRef = useRef<List | Grid | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreVisible = useInView(loadMoreRef, { amount: 0.5 });
  
  // Calculate column count for grid view
  const getColumnCount = useCallback((width: number) => {
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }, []);

  // Throttled function for resetting the list
  const throttledResetList = useCallback(
    throttle(() => {
      if (listRef.current) {
        // Check for resetAfterIndex method (List) or resetAfterIndices method (Grid)
        if ('resetAfterIndex' in listRef.current) {
          (listRef.current as any).resetAfterIndex(0);
        } else if ('resetAfterIndices' in listRef.current) {
          (listRef.current as any).resetAfterIndices({ columnIndex: 0, rowIndex: 0 });
        }
      }
    }, 200),
    []
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
    }, 500),
    [hasMore, onLoadMore]
  );

  // Trigger load more when the load more sentinel is visible
  useEffect(() => {
    if (isLoadMoreVisible && hasMore) {
      throttledLoadMore();
    }
  }, [isLoadMoreVisible, hasMore, throttledLoadMore]);

  // For non-virtualized rendering (fallback to standard rendering)
  if (resources.length < 20) {
    return (
      <>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {resources.map((resource) => (
              <ResourceListItem key={resource.id} {...resource} />
            ))}
          </div>
        )}
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {hasMore && <div className="loader w-8 h-8 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>}
        </div>
      </>
    );
  }

  // For virtualized rendering (when we have more items)
  return (
    <>
      <div className="w-full h-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} {...resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {resources.map((resource) => (
              <ResourceListItem key={resource.id} {...resource} />
            ))}
          </div>
        )}
      </div>
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {hasMore && <div className="loader w-8 h-8 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>}
      </div>
    </>
  );
});

ResourceList.displayName = "ResourceList";

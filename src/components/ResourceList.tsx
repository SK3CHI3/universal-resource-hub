
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

  return (
    <>
      <div className="w-full" style={{ height: viewMode === 'grid' ? 'calc(100vh - 300px)' : 'calc(100vh - 200px)' }}>
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = getColumnCount(width);
            
            if (viewMode === 'grid') {
              // For grid view
              const rowCount = Math.ceil(resources.length / columnCount);
              return (
                <Grid
                  ref={listRef as any}
                  columnCount={columnCount}
                  columnWidth={width / columnCount}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={440}
                  width={width}
                  itemData={{ resources, columnCount }}
                >
                  {VirtualizedGridCell}
                </Grid>
              );
            }
            
            // For list view
            return (
              <List
                ref={listRef as any}
                height={height}
                width={width}
                itemCount={resources.length}
                itemSize={180}
                itemData={{ resources }}
                overscanCount={3}
              >
                {VirtualizedListItem}
              </List>
            );
          }}
        </AutoSizer>
      </div>
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {hasMore && <div className="loader w-8 h-8 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin"></div>}
      </div>
    </>
  );
});

ResourceList.displayName = "ResourceList";

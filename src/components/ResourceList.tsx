
import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo, useRef, useEffect } from "react";
import { FixedSizeList as List, areEqual } from "react-window";
import { useWindowSize } from "@/hooks/useWindowSize";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
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

export const ResourceList = memo(({ resources, viewMode }: ResourceListProps) => {
  const { width, height } = useWindowSize();
  const listRef = useRef<List>(null);

  // Recalculate list when window resizes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [width]);

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
    
    return <>{gridItems}</>;
  }

  // For list view, use react-window for virtualization
  return (
    <List
      ref={listRef}
      height={Math.min(600, resources.length * 180)} // Limit height
      width="100%"
      itemCount={resources.length}
      itemSize={180} // Approximate height of each item
      itemData={{ resources }}
    >
      {VirtualizedListItem}
    </List>
  );
});

ResourceList.displayName = "ResourceList";

export default ResourceList;

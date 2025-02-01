import { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { ResourceListItem } from "./ResourceListItem";
import { memo, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface ResourceListProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
}

export const ResourceList = memo(({ resources, viewMode }: ResourceListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Calculate item size based on view mode
  const estimateSize = viewMode === 'grid' ? 400 : 150;
  
  const virtualizer = useVirtualizer({
    count: resources.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5, // Number of items to render outside of the visible area
  });

  // Calculate container style based on view mode
  const containerStyle = useMemo(() => {
    if (viewMode === 'grid') {
      return {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        padding: '1rem',
        height: `${virtualizer.getTotalSize()}px`,
        position: 'relative' as const,
      };
    }
    return {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
      padding: '1rem',
      height: `${virtualizer.getTotalSize()}px`,
      position: 'relative' as const,
    };
  }, [viewMode, virtualizer.getTotalSize()]);

  return (
    <div ref={parentRef} className="w-full overflow-auto" style={{ height: '80vh' }}>
      <div style={containerStyle}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const resource = resources[virtualItem.index];
          return (
            <div
              key={resource.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {viewMode === 'grid' ? (
                <ResourceCard {...resource} />
              ) : (
                <ResourceListItem {...resource} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

ResourceList.displayName = "ResourceList";
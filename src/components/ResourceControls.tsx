import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid, List, SortAsc, SortDesc } from "lucide-react";
import { useResourceStore } from "@/store/resources";

export const ResourceControls = () => {
  const { 
    sortBy, 
    setSortBy, 
    viewMode, 
    setViewMode,
    sortDirection,
    setSortDirection
  } = useResourceStore();

  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
      <div className="flex gap-4 items-center">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="visits">Visits</SelectItem>
            <SelectItem value="clicks">Clicks</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
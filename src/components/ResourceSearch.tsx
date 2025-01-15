import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useResourceStore } from "@/store/resources";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export const ResourceSearch = () => {
  const setSearchQuery = useResourceStore((state) => state.setSearchQuery);
  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder="Search resources..."
        className="pl-10"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
};
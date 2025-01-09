import { ResourceCard } from "./ResourceCard";
import { useResourceStore } from "@/store/resources";

export const Resources = () => {
  const filteredResources = useResourceStore((state) => state.filteredResources());

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {filteredResources.length > 0 ? "Available Resources" : "No resources found"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>
      </div>
    </div>
  );
};
import { ResourceCard } from "./ResourceCard";

const demoResources = [
  {
    title: "Complete Python Programming Course",
    description: "Learn Python from scratch with this comprehensive course covering all the basics to advanced concepts.",
    source: "freeCodeCamp",
    tags: ["Programming", "Beginner", "Video"],
    link: "#",
  },
  {
    title: "UI Design Kit",
    description: "A complete UI kit with modern components and design patterns for web applications.",
    source: "Figma Community",
    tags: ["Design", "UI/UX", "Templates"],
    link: "#",
  },
  {
    title: "Business Plan Templates",
    description: "Collection of professional business plan templates for startups and small businesses.",
    source: "SCORE",
    tags: ["Business", "Templates", "PDF"],
    link: "#",
  },
];

export const Resources = () => {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoResources.map((resource) => (
            <ResourceCard key={resource.title} {...resource} />
          ))}
        </div>
      </div>
    </div>
  );
};
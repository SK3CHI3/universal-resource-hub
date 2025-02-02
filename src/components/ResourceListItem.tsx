import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";

export const ResourceListItem = memo(({ 
  id,
  title, 
  description, 
  source, 
  tags, 
  link, 
  rating,
  date_added 
}: Resource) => {
  const { trackResourceEvent } = useResourceTracking();

  const handleClick = () => {
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm ml-1">{rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Source: {source}</span>
            <span>Added: {new Date(date_added).toLocaleDateString()}</span>
          </div>
        </div>
        <Button onClick={handleClick} className="shrink-0">
          Access
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
});

ResourceListItem.displayName = "ResourceListItem";
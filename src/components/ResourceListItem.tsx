
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Award } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { memo, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ResourceListItem = memo(({ 
  id,
  title, 
  description, 
  source, 
  tags, 
  link, 
  rating,
  dateAdded,
  sponsored
}: Resource) => {
  const { trackResourceEvent } = useResourceTracking();

  // Memoize click handler to prevent recreating on each render
  const handleClick = useCallback(() => {
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  }, [id, link, trackResourceEvent]);

  return (
    <Card className="hover:shadow-lg transition-shadow w-full">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm ml-1">{rating}</span>
            </div>
            {sponsored && (
              <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Sponsored
              </Badge>
            )}
          </div>
          <ScrollArea className="h-12 mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </ScrollArea>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Source: {source}</span>
            <span>Added: {new Date(dateAdded).toLocaleDateString()}</span>
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

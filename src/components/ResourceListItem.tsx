
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Award } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { memo, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    <Card className={cn(
      "hover:shadow-lg transition-shadow w-full",
      sponsored && "border-amber-500 dark:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
    )}>
      <CardContent className={cn(
        "flex items-center gap-4 p-4",
        sponsored && "bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent"
      )}>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold", 
              sponsored && "text-amber-700 dark:text-amber-400"
            )}>{title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm ml-1">{rating}</span>
            </div>
            {sponsored && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 flex items-center gap-1 shadow-md">
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
              <Badge 
                key={tag} 
                variant={sponsored ? "default" : "secondary"} 
                className={cn(
                  "text-xs",
                  sponsored && "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-800"
                )}
              >
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
        <Button 
          onClick={handleClick} 
          className={cn(
            "shrink-0",
            sponsored && "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          )}
        >
          Access
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
});

ResourceListItem.displayName = "ResourceListItem";

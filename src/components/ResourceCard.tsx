import { memo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";

export const ResourceCard = memo(({ 
  id,
  title, 
  description, 
  source, 
  tags, 
  link, 
  imageUrl, 
  rating,
  dateAdded 
}: Resource) => {
  const { trackResourceEvent } = useResourceTracking();

  const handleClick = () => {
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={imageUrl} 
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm">{rating}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Source: {source}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Added: {new Date(dateAdded).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full" onClick={handleClick}>
          Access Now
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

ResourceCard.displayName = "ResourceCard";
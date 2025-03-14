
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { memo, useCallback, useMemo } from "react";

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

  // Memoize click handler
  const handleClick = useCallback(() => {
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  }, [id, link, trackResourceEvent]);

  // Convert image URL to WebP if it's not already
  const optimizedImageUrl = useMemo(() => {
    if (!imageUrl) return null;
    
    // Check if the URL is already a WebP image
    if (imageUrl.toLowerCase().endsWith('.webp')) {
      return imageUrl;
    }
    
    // For external URLs that support WebP format conversion
    if (imageUrl.includes('unsplash.com')) {
      // Add WebP format to Unsplash URLs
      return `${imageUrl}&fm=webp&q=80`;
    }
    
    if (imageUrl.includes('cloudinary.com') && !imageUrl.includes('f_webp')) {
      // Add WebP format to Cloudinary URLs
      return imageUrl.replace('upload/', 'upload/f_webp,q_auto/');
    }
    
    // For other URLs, we'll assume they don't support dynamic WebP conversion
    // In a real implementation, you might want to have a server-side conversion process
    return imageUrl;
  }, [imageUrl]);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {optimizedImageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={optimizedImageUrl} 
            alt={title}
            loading="lazy"
            decoding="async"
            fetchPriority="auto"
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
        <p className="text-sm text-gray-500 dark:text-gray-400">Added: {new Date(dateAdded).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline">+{tags.length - 3}</Badge>
          )}
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

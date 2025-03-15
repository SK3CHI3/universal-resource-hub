
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Image as ImageIcon } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { memo, useCallback, useMemo, useState } from "react";

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
  const [imageError, setImageError] = useState(false);

  // Memoize click handler
  const handleClick = useCallback(() => {
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  }, [id, link, trackResourceEvent]);

  // Handle image loading errors
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Prepare the image URL with WebP support
  const optimizedImageUrl = useMemo(() => {
    // Return a safe default if there's no image or previous errors
    if (!imageUrl || imageError) {
      return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80&fm=webp";
    }
    
    // For trusted sources that support CORS and WebP
    if (imageUrl.includes('unsplash.com')) {
      return `${imageUrl.split('?')[0]}?auto=format&fit=crop&w=600&q=80&fm=webp`;
    }
    
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.includes('f_webp') 
        ? imageUrl 
        : imageUrl.replace('upload/', 'upload/f_webp,q_auto,w_600/');
    }
    
    if (
      imageUrl.includes('githubusercontent.com') ||
      imageUrl.includes('pexels.com') ||
      imageUrl.startsWith(window.location.origin)
    ) {
      return imageUrl;
    }
    
    // For other URLs, use a proxy or return placeholder
    return "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80&fm=webp";
  }, [imageUrl, imageError]);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <img 
            src={optimizedImageUrl} 
            alt={title || "Resource image"}
            loading="lazy"
            decoding="async"
            fetchPriority="auto"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">{description}</p>
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm">{rating}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Source: {source}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Added: {new Date(dateAdded).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4 p-4 pt-0">
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
          Access
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
});

ResourceCard.displayName = "ResourceCard";


import { Resource } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";

export const ResourceCard = memo((resource: Resource) => {
  const { id, title, description, source, tags, link, imageUrl, rating, dateAdded, sponsored } = resource;
  const { trackResourceEvent } = useResourceTracking();

  const handleClick = useCallback(() => {
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  }, [id, link, trackResourceEvent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="h-full flex flex-col overflow-hidden group border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="relative">
          {imageUrl ? (
            <div className="h-48 overflow-hidden relative">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 dark:from-brand-purple/10 dark:to-brand-blue/10"></div>
          )}
          
          {sponsored && (
            <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Sponsored
            </Badge>
          )}
          
          {rating && (
            <div className="absolute top-2 left-2 flex items-center bg-black/60 text-white text-sm px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0 flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-0 flex-grow flex flex-col">
          <ScrollArea className="flex-grow h-20 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </ScrollArea>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-col items-start">
          <div className="w-full flex justify-between items-center text-xs text-gray-500 mb-3">
            <span>{source}</span>
            <span>{new Date(dateAdded).toLocaleDateString()}</span>
          </div>
          <Button onClick={handleClick} className="w-full">
            Access Resource
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ResourceCard.displayName = "ResourceCard";

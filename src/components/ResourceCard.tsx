
import { Resource } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";

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
      <Card 
        className={cn(
          "h-full flex flex-col overflow-hidden group border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow",
          sponsored && "border-amber-500 dark:border-amber-400 border-2 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        )}
      >
        {sponsored && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 opacity-20 rounded-lg blur"></div>
        )}
        
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
            <div className={cn(
              "h-48 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 dark:from-brand-purple/10 dark:to-brand-blue/10",
              sponsored && "bg-gradient-to-br from-amber-400/40 to-orange-500/40 animate-gradient"
            )}></div>
          )}
          
          {sponsored && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 flex items-center gap-1 shadow-lg">
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
        
        <CardHeader className={cn(
          "p-4 pb-0 flex-grow",
          sponsored && "bg-gradient-to-r from-amber-50 to-amber-100/30 dark:from-amber-900/20 dark:to-amber-800/10"
        )}>
          <h3 className={cn(
            "font-bold text-lg mb-2 line-clamp-2",
            sponsored && "text-amber-700 dark:text-amber-400"
          )}>{title}</h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 pb-0 flex-grow flex flex-col">
          <ScrollArea className="flex-grow h-20 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
          </ScrollArea>
          
          <div className="flex flex-wrap gap-1 mb-4">
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
          <Button 
            onClick={handleClick} 
            className={cn(
              "w-full",
              sponsored && "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            )}
          >
            Access Resource
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

ResourceCard.displayName = "ResourceCard";

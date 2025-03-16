
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Sparkles } from "lucide-react";
import { Resource } from "@/types";
import { useResourceTracking } from "@/hooks/useResourceTracking";
import { memo, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const ResourceListItem = memo(({ 
  id,
  title, 
  description, 
  source, 
  tags, 
  link, 
  rating,
  dateAdded,
  is_sponsored
}: Resource) => {
  const { trackResourceEvent } = useResourceTracking();
  const { isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Memoize click handler to prevent recreating on each render
  const handleClick = useCallback(() => {
    if (is_sponsored && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access sponsored content",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (is_sponsored && !isPremium) {
      toast({
        title: "Premium subscription required",
        description: "Upgrade to access sponsored resources",
        variant: "destructive",
      });
      navigate("/subscription");
      return;
    }
    
    trackResourceEvent(id, 'click');
    window.open(link, "_blank");
  }, [id, link, trackResourceEvent, is_sponsored, isAuthenticated, isPremium, navigate, toast]);

  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow w-full", 
      is_sponsored && "border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
    )}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm ml-1">{rating}</span>
            </div>
            {is_sponsored && (
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                <Sparkles className="h-3 w-3 mr-1" /> Sponsored
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
        <Button 
          onClick={handleClick} 
          className={cn(
            "shrink-0",
            is_sponsored && !isPremium && "bg-amber-500 hover:bg-amber-600"
          )}
        >
          {is_sponsored && !isPremium ? (
            <>
              Upgrade to Access
              <Sparkles className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Access
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

ResourceListItem.displayName = "ResourceListItem";

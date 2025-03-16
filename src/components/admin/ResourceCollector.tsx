
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";

export const ResourceCollector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCollection, setLastCollection] = useState<any>(null);
  const { toast } = useToast();

  const fetchLastCollection = async () => {
    try {
      const { data, error } = await supabase
        .from('scraping_history')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setLastCollection(data);
    } catch (error) {
      console.error('Error fetching last collection:', error);
    }
  };

  const triggerCollection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('collect-resources');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Collected ${data.resourcesAdded} resources from ${data.urlsScraped} sources.`,
      });
      
      // Fetch the updated collection history
      fetchLastCollection();
    } catch (error) {
      console.error('Error triggering resource collection:', error);
      toast({
        title: "Error",
        description: "Failed to collect resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch last collection on mount
  useState(() => {
    fetchLastCollection();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Collection</CardTitle>
        <CardDescription>
          Collect new resources from various sources automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Resources are automatically collected daily at midnight UTC. 
            You can also trigger a collection manually.
          </p>
          
          {lastCollection && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h4 className="font-medium mb-2">Last Collection</h4>
              <div className="space-y-1 text-sm">
                <p>Date: {new Date(lastCollection.completed_at).toLocaleString()}</p>
                <p>Status: {lastCollection.status}</p>
                <p>Resources Added: {lastCollection.resources_added}</p>
                <p>Sources Scraped: {lastCollection.urls_scraped}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={triggerCollection} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Collecting...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Collect Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

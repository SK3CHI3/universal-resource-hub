import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useResourceTracking = () => {
  const { toast } = useToast();

  const trackResourceEvent = useCallback(async (resourceId: string, eventType: 'visit' | 'click') => {
    if (!resourceId || !eventType) {
      console.error('Missing required tracking parameters');
      return;
    }

    try {
      // Insert analytics event
      const { error: analyticsError } = await supabase
        .from('analytics')
        .insert({
          resource_id: resourceId,
          event_type: eventType,
          user_agent: navigator.userAgent,
        });

      if (analyticsError) {
        throw analyticsError;
      }

      // Update resource counts
      const { data: resource, error: fetchError } = await supabase
        .from('resources')
        .select('visits, clicks')
        .eq('id', resourceId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (resource) {
        const updates = eventType === 'visit'
          ? { visits: (resource.visits || 0) + 1 }
          : { clicks: (resource.clicks || 0) + 1 };

        const { error: updateError } = await supabase
          .from('resources')
          .update(updates)
          .eq('id', resourceId);

        if (updateError) {
          throw updateError;
        }
      }
    } catch (error) {
      console.error('Error tracking resource event:', error);
      toast({
        variant: "destructive",
        title: "Tracking Error",
        description: "Failed to track resource interaction. Please try again later.",
      });
    }
  }, [toast]);

  return { trackResourceEvent };
};
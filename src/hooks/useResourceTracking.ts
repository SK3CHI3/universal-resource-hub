import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useResourceTracking = () => {
  const trackResourceEvent = useCallback(async (resourceId: string, eventType: 'visit' | 'click') => {
    try {
      // Insert analytics event
      await supabase
        .from('analytics')
        .insert({
          resource_id: resourceId,
          event_type: eventType,
          user_agent: navigator.userAgent,
        });

      // Update resource counts
      const { data: resource } = await supabase
        .from('resources')
        .select('visits, clicks')
        .eq('id', resourceId)
        .single();

      if (resource) {
        const updates = eventType === 'visit'
          ? { visits: (resource.visits || 0) + 1 }
          : { clicks: (resource.clicks || 0) + 1 };

        await supabase
          .from('resources')
          .update(updates)
          .eq('id', resourceId);
      }
    } catch (error) {
      console.error('Error tracking resource event:', error);
    }
  }, []);

  return { trackResourceEvent };
};
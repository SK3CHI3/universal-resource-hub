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
        });

      // Update resource counts
      if (eventType === 'visit') {
        await supabase
          .from('resources')
          .update({ visits: supabase.rpc('increment') })
          .eq('id', resourceId);
      } else if (eventType === 'click') {
        await supabase
          .from('resources')
          .update({ clicks: supabase.rpc('increment') })
          .eq('id', resourceId);
      }
    } catch (error) {
      console.error('Error tracking resource event:', error);
    }
  }, []);

  return { trackResourceEvent };
};

import { supabase } from '@/lib/supabase';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  resourcesAdded?: number;
  data?: any[];
  error?: string;
}

export class FirecrawlService {
  static async crawlWebsite(url: string): Promise<CrawlResult> {
    try {
      console.log('Making crawl request to Firecrawl API via Edge Function');
      const { data, error } = await supabase.functions.invoke('crawl-website', {
        body: { url }
      });

      if (error) {
        console.error('Crawl failed:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to crawl website' 
        };
      }

      console.log('Crawl response:', data);
      
      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Failed to crawl website'
        };
      }
      
      return { 
        success: true,
        ...data.data
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to crawl service' 
      };
    }
  }
}

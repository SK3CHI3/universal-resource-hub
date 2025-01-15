import { supabase } from '@/lib/supabase';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

export class FirecrawlService {
  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
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

      console.log('Crawl successful:', data);
      return { 
        success: true,
        data 
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
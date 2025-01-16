import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json();
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!apiKey || !supabaseUrl || !supabaseKey) {
      throw new Error('Required environment variables are missing');
    }

    if (!url) {
      throw new Error('URL is required');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create scraping history record
    const { data: historyRecord, error: historyError } = await supabase
      .from('scraping_history')
      .insert([{
        started_at: new Date().toISOString(),
        status: 'in_progress'
      }])
      .select()
      .single();

    if (historyError) {
      console.error('Error creating history record:', historyError);
      throw historyError;
    }

    console.log('Starting crawl for URL:', url);
    const firecrawl = new FirecrawlApp({ apiKey });
    
    const crawlResponse = await firecrawl.crawlUrl(url, {
      limit: 100,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    });

    if (!crawlResponse.success) {
      throw new Error(crawlResponse.error || 'Crawl failed');
    }

    console.log('Processing crawled data');
    const resources = crawlResponse.data.map(item => ({
      title: item.title || 'Untitled Resource',
      description: item.description || item.text?.slice(0, 500) || null,
      source: url,
      link: item.url,
      category: 'Technology', // Default category
      tags: item.keywords || [],
      date_added: new Date().toISOString()
    }));

    // Insert resources
    const { data: savedResources, error: resourceError } = await supabase
      .from('resources')
      .insert(resources)
      .select();

    if (resourceError) {
      console.error('Error saving resources:', resourceError);
      throw resourceError;
    }

    // Update scraping history
    const { error: updateError } = await supabase
      .from('scraping_history')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        urls_scraped: crawlResponse.data.length,
        resources_added: savedResources.length
      })
      .eq('id', historyRecord.id);

    if (updateError) {
      console.error('Error updating history:', updateError);
      throw updateError;
    }

    console.log('Crawl completed successfully');
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          status: 'completed',
          completed: crawlResponse.data.length,
          total: crawlResponse.data.length,
          creditsUsed: crawlResponse.creditsUsed,
          expiresAt: crawlResponse.expiresAt,
          resourcesAdded: savedResources.length
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in crawl-website function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400 
      }
    );
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// Define types directly in the edge function
interface ScrapedResource {
  title: string;
  description: string;
  source: string;
  link: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SCRAPING_SOURCES = [
  {
    name: 'GitHub Trending',
    url: 'https://github.com/trending',
    category: 'Technology',
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    category: 'Technology',
  },
];

async function scrapeResource(source: typeof SCRAPING_SOURCES[0]): Promise<ScrapedResource[]> {
  console.log(`Starting to scrape ${source.name} at ${source.url}`);
  
  // This is where you would implement the actual scraping logic for each source
  // For now, we'll return a placeholder resource
  return [{
    title: `Resource from ${source.name}`,
    description: `Automatically collected from ${source.url}`,
    source: source.name,
    link: source.url,
    category: source.category,
    tags: ['automated', source.category.toLowerCase()],
  }];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting automated resource collection');

    // Create a scraping history record
    const { data: scrapingHistory, error: historyError } = await supabase
      .from('scraping_history')
      .insert({
        status: 'in_progress',
      })
      .select()
      .single();

    if (historyError) throw historyError;

    let totalResourcesAdded = 0;
    let urlsScraped = 0;

    // Scrape resources from each source
    for (const source of SCRAPING_SOURCES) {
      try {
        const scrapedResources = await scrapeResource(source);
        urlsScraped++;

        // Process and insert each scraped resource
        for (const resource of scrapedResources) {
          const { error: insertError } = await supabase
            .from('resources')
            .insert({
              ...resource,
              date_added: new Date().toISOString(),
              rating: 0,
              visits: 0,
              clicks: 0,
            });

          if (!insertError) {
            totalResourcesAdded++;
          }
        }
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
      }
    }

    // Update scraping history
    const { error: updateError } = await supabase
      .from('scraping_history')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        urls_scraped: urlsScraped,
        resources_added: totalResourcesAdded,
      })
      .eq('id', scrapingHistory.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        message: 'Resources collected successfully',
        resourcesAdded: totalResourcesAdded,
        urlsScraped,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in collect-resources function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
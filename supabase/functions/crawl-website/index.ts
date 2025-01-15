import FirecrawlApp from '@mendable/firecrawl-js';

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

    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY not found in environment variables');
    }

    if (!url) {
      throw new Error('URL is required');
    }

    console.log('Initializing Firecrawl with provided API key');
    const firecrawl = new FirecrawlApp({ apiKey });

    console.log('Starting crawl for URL:', url);
    const crawlResponse = await firecrawl.crawlUrl(url, {
      limit: 100,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    });

    console.log('Crawl response:', crawlResponse);

    return new Response(
      JSON.stringify(crawlResponse),
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
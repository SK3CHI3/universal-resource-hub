
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
    type: 'html'
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    category: 'Programming',
    type: 'api'
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    category: 'Technology',
    type: 'html'
  }
];

async function scrapeGitHubTrending(): Promise<ScrapedResource[]> {
  console.log('Starting to scrape GitHub Trending');
  
  try {
    const response = await fetch('https://github.com/trending');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Simple pattern matching for repository information
    // Note: This is a simple approach; a proper HTML parser would be better
    const resources: ScrapedResource[] = [];
    
    // Extract repository blocks
    const repoRegex = /<article class="Box-row"[\s\S]*?<\/article>/g;
    const repoBlocks = html.match(repoRegex) || [];
    
    for (const block of repoBlocks) {
      try {
        // Extract title (repository name)
        const titleMatch = block.match(/<h2 class="h3 lh-condensed"[\s\S]*?<a href="([^"]+)"[\s\S]*?>([^<]+)<\/a>/);
        if (!titleMatch) continue;
        
        const repoPath = titleMatch[1];
        const repoName = titleMatch[2].trim();
        
        // Extract description
        const descMatch = block.match(/<p class="col-9 color-fg-muted my-1 pr-4">([\s\S]*?)<\/p>/);
        const description = descMatch ? descMatch[1].trim() : 'No description provided';
        
        // Extract language
        const langMatch = block.match(/<span class="d-inline-block ml-0 mr-3">[\s\S]*?<span>([^<]+)<\/span>/);
        const language = langMatch ? langMatch[1].trim() : '';
        
        resources.push({
          title: repoName,
          description,
          source: 'GitHub Trending',
          link: `https://github.com${repoPath}`,
          category: 'Technology',
          tags: language ? ['github', 'trending', language.toLowerCase()] : ['github', 'trending'],
          imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
        });
      } catch (error) {
        console.error('Error parsing GitHub repo block:', error);
      }
    }
    
    return resources;
  } catch (error) {
    console.error('Error scraping GitHub Trending:', error);
    return [];
  }
}

async function fetchDevToArticles(): Promise<ScrapedResource[]> {
  console.log('Fetching Dev.to articles via API');
  
  try {
    const response = await fetch('https://dev.to/api/articles?top=15');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const articles = await response.json();
    
    return articles.map((article: any) => ({
      title: article.title,
      description: article.description || article.title,
      source: 'Dev.to',
      link: article.url,
      category: 'Programming',
      tags: ['dev.to', ...(article.tag_list || [])],
      imageUrl: article.social_image || article.cover_image
    }));
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
}

async function scrapeHackerNews(): Promise<ScrapedResource[]> {
  console.log('Starting to scrape Hacker News');
  
  try {
    // Fetch top stories from HN API
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const storyIds = await response.json();
    const topStoryIds = storyIds.slice(0, 15); // Get top 15 stories
    
    const resources: ScrapedResource[] = [];
    
    // Fetch details for each story
    for (const id of topStoryIds) {
      try {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!storyResponse.ok) continue;
        
        const story = await storyResponse.json();
        
        resources.push({
          title: story.title,
          description: `A popular discussion on Hacker News with ${story.score} points and ${story.descendants || 0} comments.`,
          source: 'Hacker News',
          link: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          category: 'Technology',
          tags: ['hacker-news', 'technology', 'discussion'],
          imageUrl: 'https://news.ycombinator.com/y18.gif'
        });
      } catch (error) {
        console.error(`Error fetching HN story ${id}:`, error);
      }
    }
    
    return resources;
  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    return [];
  }
}

async function scrapeResource(source: typeof SCRAPING_SOURCES[0]): Promise<ScrapedResource[]> {
  console.log(`Starting to scrape ${source.name} at ${source.url}`);
  
  switch (source.name) {
    case 'GitHub Trending':
      return await scrapeGitHubTrending();
    case 'Dev.to':
      return await fetchDevToArticles();
    case 'Hacker News':
      return await scrapeHackerNews();
    default:
      console.log(`No specific scraper for ${source.name}, using placeholder`);
      return [{
        title: `Resource from ${source.name}`,
        description: `Automatically collected from ${source.url}`,
        source: source.name,
        link: source.url,
        category: source.category,
        tags: ['automated', source.category.toLowerCase()],
      }];
  }
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
        started_at: new Date().toISOString(),
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

        if (scrapedResources.length === 0) {
          console.log(`No resources found for ${source.name}`);
          continue;
        }

        console.log(`Found ${scrapedResources.length} resources from ${source.name}`);

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
          } else {
            console.error(`Error inserting resource: ${insertError.message}`);
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

    console.log(`Collection completed: ${totalResourcesAdded} resources added from ${urlsScraped} sources`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Resources collected successfully',
        resourcesAdded: totalResourcesAdded,
        urlsScraped,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in collect-resources function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

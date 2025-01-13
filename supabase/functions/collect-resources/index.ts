import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Resource {
  title: string;
  description: string;
  source: string;
  link: string;
  category: string;
  tags: string[];
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

    // Example: Collect resources from an RSS feed or API
    // This is a placeholder - you would implement your own resource collection logic here
    const newResources: Resource[] = [
      {
        title: "Daily Resource Example",
        description: "Automatically collected resource",
        source: "Automated Collection",
        link: "https://example.com",
        category: "Technology",
        tags: ["automated", "daily"],
      }
    ];

    // Insert new resources
    const { error } = await supabase
      .from('resources')
      .insert(newResources);

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Resources collected successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
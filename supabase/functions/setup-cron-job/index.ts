
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function is used to set up a CRON job that will run the collect-resources function daily
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Enable pg_cron and pg_net extensions if not already enabled
    const { error: extensionError } = await supabase.rpc('setup_cron_extensions');
    if (extensionError) {
      throw new Error(`Failed to enable extensions: ${extensionError.message}`);
    }

    // Create the cron job
    const { error: cronError } = await supabase.rpc('setup_daily_resource_collection');
    if (cronError) {
      throw new Error(`Failed to set up cron job: ${cronError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily resource collection scheduled successfully. Resources will be collected every day at midnight UTC.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error setting up cron job:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

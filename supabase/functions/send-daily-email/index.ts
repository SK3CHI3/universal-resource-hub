
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Resource {
  id: string
  title: string
  description: string
  link: string
  category: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get all users with daily email preferences enabled
    const { data: preferences, error: preferencesError } = await supabaseAdmin
      .from('user_preferences')
      .select('user_id')
      .eq('receive_daily_emails', true)
      .eq('email_frequency', 'daily')
      .lt('last_email_sent', new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()) // Send if last email was > 23 hours ago
    
    if (preferencesError) throw preferencesError

    if (!preferences || preferences.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users to send emails to' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Get the latest resources added in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data: resources, error: resourcesError } = await supabaseAdmin
      .from('resources')
      .select('id, title, description, link, category')
      .gt('date_added', oneDayAgo)
      .limit(10)
      .order('date_added', { ascending: false })
    
    if (resourcesError) throw resourcesError

    // Get user emails
    const userIds = preferences.map(pref => pref.user_id)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .in('id', userIds)
    
    if (profilesError) throw profilesError

    // For this example, we'll just log the emails that would be sent
    // In a real application, you would use a service like SendGrid, Mailgun, or Resend
    console.log(`Would send emails to ${profiles?.length} users with ${resources?.length} resources`)
    
    // For each user, update the last_email_sent timestamp
    for (const preference of preferences) {
      await supabaseAdmin
        .from('user_preferences')
        .update({ last_email_sent: new Date().toISOString() })
        .eq('user_id', preference.user_id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: profiles?.length || 0,
        resourcesSent: resources?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

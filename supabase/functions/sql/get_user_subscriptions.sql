
-- Create a function to get active subscriptions for a user
CREATE OR REPLACE FUNCTION public.get_user_subscriptions(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  plan_type TEXT,
  status TEXT, 
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id
  AND s.status = 'active'
  AND s.end_date > NOW();
END;
$$;


export interface Resource {
  id: string;
  title: string;
  description: string;
  source: string;
  tags: string[];
  link: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  dateAdded: string;
  visits?: number;
  clicks?: number;
  is_sponsored?: boolean;
}

export type Category = {
  name: string;
  icon: any;
  color: string;
  description: string;
  premium?: boolean;
}

export interface Analytics {
  id: string;
  resource_id: string;
  event_type: 'visit' | 'click';
  created_at: string;
  user_agent?: string;
  ip_address?: string;
}

export interface AdminSettings {
  id: string;
  last_sync: string;
  sync_sources: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  receive_daily_emails: boolean;
  email_frequency: string;
  last_email_sent?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  is_admin?: boolean;
}

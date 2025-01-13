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
}

export type Category = {
  name: string;
  icon: any;
  color: string;
  description: string;
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
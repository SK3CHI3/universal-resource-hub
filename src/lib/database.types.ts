
export interface Database {
  public: {
    Tables: {
      resources: {
        Row: {
          id: string
          title: string
          description: string
          source: string
          tags: string[]
          link: string
          category: string
          imageUrl?: string
          rating?: number
          dateAdded: string
          visits: number
          clicks: number
          is_sponsored?: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          source: string
          tags: string[]
          link: string
          category: string
          imageUrl?: string
          rating?: number
          dateAdded?: string
          visits?: number
          clicks?: number
          is_sponsored?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          source?: string
          tags?: string[]
          link?: string
          category?: string
          imageUrl?: string
          rating?: number
          dateAdded?: string
          visits?: number
          clicks?: number
          is_sponsored?: boolean
        }
      }
      analytics: {
        Row: {
          id: string
          resource_id: string
          event_type: 'visit' | 'click'
          created_at: string
          user_agent?: string
          ip_address?: string
        }
        Insert: {
          id?: string
          resource_id: string
          event_type: 'visit' | 'click'
          created_at?: string
          user_agent?: string
          ip_address?: string
        }
        Update: {
          id?: string
          resource_id?: string
          event_type?: 'visit' | 'click'
          created_at?: string
          user_agent?: string
          ip_address?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          last_sync: string
          sync_sources: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          last_sync: string
          sync_sources: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          last_sync?: string
          sync_sources?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email?: string
          full_name?: string
          avatar_url?: string
          is_premium: boolean
          created_at: string
          updated_at: string
          is_admin?: boolean
        }
        Insert: {
          id: string
          email?: string
          full_name?: string
          avatar_url?: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          is_premium?: boolean
          created_at?: string
          updated_at?: string
          is_admin?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          status: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: string
          status: string
          start_date?: string
          end_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          status?: string
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          receive_daily_emails: boolean
          email_frequency: string
          last_email_sent?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          receive_daily_emails?: boolean
          email_frequency?: string
          last_email_sent?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          receive_daily_emails?: boolean
          email_frequency?: string
          last_email_sent?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_subscriptions: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          user_id: string
          plan_type: string
          status: string
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
        }[]
      }
      setup_cron_extensions: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      setup_daily_resource_collection: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
}

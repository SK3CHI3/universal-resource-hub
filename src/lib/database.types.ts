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
    }
    Functions: {
      increment: {
        Args: Record<string, unknown>
        Returns: number
      }
    }
  }
}

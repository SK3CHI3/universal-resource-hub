export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          ip_address: string | null
          resource_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_premium: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_premium?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_premium?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          clicks: number | null
          date_added: string | null
          description: string | null
          id: string
          image_url: string | null
          is_sponsored: boolean | null
          link: string
          rating: number | null
          source: string
          tags: string[] | null
          title: string
          visits: number | null
        }
        Insert: {
          category: string
          clicks?: number | null
          date_added?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_sponsored?: boolean | null
          link: string
          rating?: number | null
          source: string
          tags?: string[] | null
          title: string
          visits?: number | null
        }
        Update: {
          category?: string
          clicks?: number | null
          date_added?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_sponsored?: boolean | null
          link?: string
          rating?: number | null
          source?: string
          tags?: string[] | null
          title?: string
          visits?: number | null
        }
        Relationships: []
      }
      scraping_history: {
        Row: {
          completed_at: string | null
          error: string | null
          id: string
          resources_added: number | null
          started_at: string | null
          status: string | null
          urls_scraped: number | null
        }
        Insert: {
          completed_at?: string | null
          error?: string | null
          id?: string
          resources_added?: number | null
          started_at?: string | null
          status?: string | null
          urls_scraped?: number | null
        }
        Update: {
          completed_at?: string | null
          error?: string | null
          id?: string
          resources_added?: number | null
          started_at?: string | null
          status?: string | null
          urls_scraped?: number | null
        }
        Relationships: []
      }
      scraping_sources: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_scraped_at: string | null
          name: string
          scraping_frequency: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_scraped_at?: string | null
          name: string
          scraping_frequency?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_scraped_at?: string | null
          name?: string
          scraping_frequency?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          plan_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          plan_type: string
          start_date?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_frequency: string
          id: string
          last_email_sent: string | null
          receive_daily_emails: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_frequency?: string
          id?: string
          last_email_sent?: string | null
          receive_daily_emails?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_frequency?: string
          id?: string
          last_email_sent?: string | null
          receive_daily_emails?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_subscriptions:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              subscription_id: number
              user_id: number
              subscription_details: string
            }[]
          }
        | {
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
      handle_new_user: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      setup_cron_extensions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      setup_daily_resource_collection: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

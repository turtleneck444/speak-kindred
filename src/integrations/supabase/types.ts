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
      boards: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          is_public: boolean | null
          locale: string | null
          name: string
          owner_id: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          locale?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          locale?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "boards_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          order_index: number | null
          owner_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number | null
          owner_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          caregiver_pin: string | null
          created_at: string | null
          display_name: string | null
          id: string
          preferences: Json | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          caregiver_pin?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          preferences?: Json | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          caregiver_pin?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          preferences?: Json | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_phrases: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_emergency: boolean | null
          owner_id: string | null
          phrase: string
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_emergency?: boolean | null
          owner_id?: string | null
          phrase: string
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_emergency?: boolean | null
          owner_id?: string | null
          phrase?: string
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_phrases_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tiles: {
        Row: {
          board_id: string | null
          category_id: string | null
          color: string | null
          created_at: string | null
          icon_name: string | null
          icon_url: string | null
          id: string
          image_url: string | null
          is_favorite: boolean | null
          label: string
          next_board_id: string | null
          order_index: number | null
          speech_text: string
        }
        Insert: {
          board_id?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          label: string
          next_board_id?: string | null
          order_index?: number | null
          speech_text: string
        }
        Update: {
          board_id?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          icon_name?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          label?: string
          next_board_id?: string | null
          order_index?: number | null
          speech_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiles_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tiles_next_board_id_fkey"
            columns: ["next_board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_events: {
        Row: {
          id: string
          occurred_at: string | null
          tile_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          occurred_at?: string | null
          tile_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          occurred_at?: string | null
          tile_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_events_tile_id_fkey"
            columns: ["tile_id"]
            isOneToOne: false
            referencedRelation: "tiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      word_history: {
        Row: {
          frequency: number | null
          id: string
          last_used_at: string | null
          user_id: string | null
          word: string
        }
        Insert: {
          frequency?: number | null
          id?: string
          last_used_at?: string | null
          user_id?: string | null
          word: string
        }
        Update: {
          frequency?: number | null
          id?: string
          last_used_at?: string | null
          user_id?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_word_predictions: {
        Args: {
          p_user_id: string
          p_prefix: string
          p_limit?: number
        }
        Returns: {
          word: string
          frequency: number
        }[]
      }
      update_word_history: {
        Args: {
          p_user_id: string
          p_word: string
        }
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

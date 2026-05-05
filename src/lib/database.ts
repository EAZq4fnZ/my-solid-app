export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ax: {
        Row: {
          ax_meta: Json
          ax_type_code: Database["public"]["Enums"]["ax_type_code"]
          created_at: string
          description: string
          display_id: string | null
          fault_ratio: string
          id: string
          incident_at: string
          place: string
          sit_code: Database["public"]["Enums"]["sit_code"]
          updated_at: string
          wth_code: Database["public"]["Enums"]["wth_code"]
        }
        Insert: {
          ax_meta?: Json
          ax_type_code?: Database["public"]["Enums"]["ax_type_code"]
          created_at?: string
          description?: string
          display_id?: string | null
          fault_ratio?: string
          id?: string
          incident_at: string
          place?: string
          sit_code?: Database["public"]["Enums"]["sit_code"]
          updated_at?: string
          wth_code?: Database["public"]["Enums"]["wth_code"]
        }
        Update: {
          ax_meta?: Json
          ax_type_code?: Database["public"]["Enums"]["ax_type_code"]
          created_at?: string
          description?: string
          display_id?: string | null
          fault_ratio?: string
          id?: string
          incident_at?: string
          place?: string
          sit_code?: Database["public"]["Enums"]["sit_code"]
          updated_at?: string
          wth_code?: Database["public"]["Enums"]["wth_code"]
        }
        Relationships: []
      }
      correspondence_logs: {
        Row: {
          contact_date: string | null
          content: string
          created_at: string | null
          id: string
          occurrence_date: string
          record_id: string | null
          staff_id: string | null
          updated_at: string
        }
        Insert: {
          contact_date?: string | null
          content: string
          created_at?: string | null
          id?: string
          occurrence_date?: string
          record_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Update: {
          contact_date?: string | null
          content?: string
          created_at?: string | null
          id?: string
          occurrence_date?: string
          record_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      px: {
        Row: {
          addr1: string
          addr2: string
          birthday: string | null
          created_at: string
          display_id: string | null
          email: string
          first_kana: string
          first_name: string
          gender_code: Database["public"]["Enums"]["gender_code"]
          id: string
          job: string
          last_kana: string
          last_name: string
          tel: string
          updated_at: string
          zip: string
        }
        Insert: {
          addr1?: string
          addr2?: string
          birthday?: string | null
          created_at?: string
          display_id?: string | null
          email?: string
          first_kana: string
          first_name: string
          gender_code?: Database["public"]["Enums"]["gender_code"]
          id?: string
          job?: string
          last_kana: string
          last_name: string
          tel?: string
          updated_at?: string
          zip?: string
        }
        Update: {
          addr1?: string
          addr2?: string
          birthday?: string | null
          created_at?: string
          display_id?: string | null
          email?: string
          first_kana?: string
          first_name?: string
          gender_code?: Database["public"]["Enums"]["gender_code"]
          id?: string
          job?: string
          last_kana?: string
          last_name?: string
          tel?: string
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      tx: {
        Row: {
          ax_id: string
          billing_code: Database["public"]["Enums"]["billing_code"]
          created_at: string
          display_id: string | null
          id: string
          last_visit_at: string | null
          memo: string
          px_id: string
          status_code: Database["public"]["Enums"]["status_code"]
          tx_end_at: string | null
          tx_meta: Json
          tx_start_at: string
          updated_at: string
        }
        Insert: {
          ax_id: string
          billing_code?: Database["public"]["Enums"]["billing_code"]
          created_at?: string
          display_id?: string | null
          id?: string
          last_visit_at?: string | null
          memo?: string
          px_id: string
          status_code?: Database["public"]["Enums"]["status_code"]
          tx_end_at?: string | null
          tx_meta?: Json
          tx_start_at?: string
          updated_at?: string
        }
        Update: {
          ax_id?: string
          billing_code?: Database["public"]["Enums"]["billing_code"]
          created_at?: string
          display_id?: string | null
          id?: string
          last_visit_at?: string | null
          memo?: string
          px_id?: string
          status_code?: Database["public"]["Enums"]["status_code"]
          tx_end_at?: string | null
          tx_meta?: Json
          tx_start_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tx_ax_id_fkey"
            columns: ["ax_id"]
            isOneToOne: false
            referencedRelation: "ax"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tx_px_id_fkey"
            columns: ["px_id"]
            isOneToOne: false
            referencedRelation: "px"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ax_type_code: "injury" | "property" | "self" | "other" | "unknown"
      billing_code: "ins" | "cali" | "pici" | "wcomp" | "reim" | "oth"
      gender_code: "male" | "female" | "other" | "unknown"
      sit_code:
        | "p2v"
        | "v_head"
        | "v_side"
        | "v_cross"
        | "v_cont"
        | "v_rear"
        | "v_oth"
        | "s_fall"
        | "s_dev"
        | "s_col"
        | "s_oth"
        | "rail"
        | "unknown"
      status_code:
        | "treating"
        | "finished"
        | "fixed"
        | "stopped"
        | "settled"
        | "unknown"
      wth_code:
        | "fine"
        | "cloudy"
        | "rainy"
        | "icy"
        | "foggy"
        | "other"
        | "unknown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ax_type_code: ["injury", "property", "self", "other", "unknown"],
      billing_code: ["ins", "cali", "pici", "wcomp", "reim", "oth"],
      gender_code: ["male", "female", "other", "unknown"],
      sit_code: [
        "p2v",
        "v_head",
        "v_side",
        "v_cross",
        "v_cont",
        "v_rear",
        "v_oth",
        "s_fall",
        "s_dev",
        "s_col",
        "s_oth",
        "rail",
        "unknown",
      ],
      status_code: [
        "treating",
        "finished",
        "fixed",
        "stopped",
        "settled",
        "unknown",
      ],
      wth_code: ["fine", "cloudy", "rainy", "icy", "foggy", "other", "unknown"],
    },
  },
} as const

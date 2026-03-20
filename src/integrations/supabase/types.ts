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
      boundary_alerts: {
        Row: {
          alert_type: string
          created_at: string
          direction: string
          distance: number
          id: string
          latitude: number
          longitude: number
          student_id: string
          student_name: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          direction: string
          distance: number
          id?: string
          latitude: number
          longitude: number
          student_id: string
          student_name: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          direction?: string
          distance?: number
          id?: string
          latitude?: number
          longitude?: number
          student_id?: string
          student_name?: string
        }
        Relationships: []
      }
      faculty_attendance: {
        Row: {
          auto_detected: boolean
          created_at: string
          date: string
          department: string
          faculty_id: string
          faculty_name: string
          id: string
          punch_in: string | null
          punch_out: string | null
          status: string
          total_hours: number | null
        }
        Insert: {
          auto_detected?: boolean
          created_at?: string
          date?: string
          department?: string
          faculty_id: string
          faculty_name: string
          id?: string
          punch_in?: string | null
          punch_out?: string | null
          status?: string
          total_hours?: number | null
        }
        Update: {
          auto_detected?: boolean
          created_at?: string
          date?: string
          department?: string
          faculty_id?: string
          faculty_name?: string
          id?: string
          punch_in?: string | null
          punch_out?: string | null
          status?: string
          total_hours?: number | null
        }
        Relationships: []
      }
      faculty_locations: {
        Row: {
          department: string
          distance_from_campus: number
          faculty_id: string
          faculty_name: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          status: string
        }
        Insert: {
          department?: string
          distance_from_campus: number
          faculty_id: string
          faculty_name: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          status: string
        }
        Update: {
          department?: string
          distance_from_campus?: number
          faculty_id?: string
          faculty_name?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          status?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          created_at: string
          department: string
          end_date: string
          faculty_id: string
          faculty_name: string
          id: string
          leave_type: string
          reason: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          department?: string
          end_date: string
          faculty_id: string
          faculty_name: string
          id?: string
          leave_type: string
          reason?: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          department?: string
          end_date?: string
          faculty_id?: string
          faculty_name?: string
          id?: string
          leave_type?: string
          reason?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_locations: {
        Row: {
          distance_from_campus: number
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          status: string
          student_id: string
          student_name: string
        }
        Insert: {
          distance_from_campus: number
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          status: string
          student_id: string
          student_name: string
        }
        Update: {
          distance_from_campus?: number
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          status?: string
          student_id?: string
          student_name?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          auth_user_id: string | null
          batch: string
          category: string
          course: string
          created_at: string
          email: string
          fee_status: string
          guardian: string
          id: string
          institute: string
          name: string
          phone: string
          program: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          batch?: string
          category?: string
          course?: string
          created_at?: string
          email: string
          fee_status?: string
          guardian?: string
          id?: string
          institute?: string
          name: string
          phone?: string
          program?: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          batch?: string
          category?: string
          course?: string
          created_at?: string
          email?: string
          fee_status?: string
          guardian?: string
          id?: string
          institute?: string
          name?: string
          phone?: string
          program?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hod"
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
      app_role: ["admin", "hod"],
    },
  },
} as const

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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      book_issues: {
        Row: {
          book_id: string
          created_at: string
          due_date: string
          id: string
          issue_date: string
          issued_by: string | null
          issued_by_name: string
          notes: string | null
          return_condition: string | null
          returned_date: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          due_date: string
          id?: string
          issue_date?: string
          issued_by?: string | null
          issued_by_name?: string
          notes?: string | null
          return_condition?: string | null
          returned_date?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          due_date?: string
          id?: string
          issue_date?: string
          issued_by?: string | null
          issued_by_name?: string
          notes?: string | null
          return_condition?: string | null
          returned_date?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_issues_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_issues_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          available_copies: number
          category: string
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          damaged_copies: number
          description: string | null
          edition: string | null
          id: string
          isbn: string | null
          issued_copies: number
          language: string | null
          location: string
          lost_copies: number
          publication_year: number | null
          publisher: string | null
          shelf_number: string | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          author?: string
          available_copies?: number
          category?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          damaged_copies?: number
          description?: string | null
          edition?: string | null
          id?: string
          isbn?: string | null
          issued_copies?: number
          language?: string | null
          location?: string
          lost_copies?: number
          publication_year?: number | null
          publisher?: string | null
          shelf_number?: string | null
          title: string
          total_copies?: number
          updated_at?: string
        }
        Update: {
          author?: string
          available_copies?: number
          category?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          damaged_copies?: number
          description?: string | null
          edition?: string | null
          id?: string
          isbn?: string | null
          issued_copies?: number
          language?: string | null
          location?: string
          lost_copies?: number
          publication_year?: number | null
          publisher?: string | null
          shelf_number?: string | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      inventory_adjustments: {
        Row: {
          adjusted_by: string | null
          adjusted_by_name: string
          adjustment_type: string
          book_id: string
          created_at: string
          id: string
          quantity: number
          reason: string | null
        }
        Insert: {
          adjusted_by?: string | null
          adjusted_by_name?: string
          adjustment_type: string
          book_id: string
          created_at?: string
          id?: string
          quantity: number
          reason?: string | null
        }
        Update: {
          adjusted_by?: string | null
          adjusted_by_name?: string
          adjustment_type?: string
          book_id?: string
          created_at?: string
          id?: string
          quantity?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_adjustments_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
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
      library_audit_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          record_id: string | null
          record_type: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          record_id?: string | null
          record_type?: string
          user_id?: string | null
          user_name?: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          record_id?: string | null
          record_type?: string
          user_id?: string | null
          user_name?: string
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
      adjust_inventory: {
        Args: {
          p_book_id: string
          p_quantity: number
          p_reason?: string
          p_type: string
        }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_library_staff: { Args: { _user_id: string }; Returns: boolean }
      issue_book: {
        Args: {
          p_book_id: string
          p_due_date: string
          p_notes?: string
          p_student_id: string
        }
        Returns: string
      }
      return_book: {
        Args: {
          p_condition?: string
          p_issue_id: string
          p_notes?: string
          p_return_date?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "hod" | "librarian"
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
      app_role: ["admin", "hod", "librarian"],
    },
  },
} as const

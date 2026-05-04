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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      health_insurances: {
        Row: {
          ars_name: string
          coverage_details: string | null
          created_at: string
          id: string
          monthly_premium: number | null
          plan_type: string | null
          user_id: string
        }
        Insert: {
          ars_name: string
          coverage_details?: string | null
          created_at?: string
          id?: string
          monthly_premium?: number | null
          plan_type?: string | null
          user_id: string
        }
        Update: {
          ars_name?: string
          coverage_details?: string | null
          created_at?: string
          id?: string
          monthly_premium?: number | null
          plan_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_insurances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      incomes: {
        Row: {
          average_amount: number | null
          created_at: string
          frequency: Database["public"]["Enums"]["income_frequency"] | null
          id: string
          is_primary: boolean | null
          source_name: string
          user_id: string
        }
        Insert: {
          average_amount?: number | null
          created_at?: string
          frequency?: Database["public"]["Enums"]["income_frequency"] | null
          id?: string
          is_primary?: boolean | null
          source_name: string
          user_id: string
        }
        Update: {
          average_amount?: number | null
          created_at?: string
          frequency?: Database["public"]["Enums"]["income_frequency"] | null
          id?: string
          is_primary?: boolean | null
          source_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incomes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          annual_rate: number
          created_at: string
          current_balance: number | null
          end_date: string | null
          id: string
          lender_name: string | null
          loan_type: Database["public"]["Enums"]["loan_type"]
          monthly_payment: number
          original_amount: number
          start_date: string
          status: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_rate: number
          created_at?: string
          current_balance?: number | null
          end_date?: string | null
          id?: string
          lender_name?: string | null
          loan_type: Database["public"]["Enums"]["loan_type"]
          monthly_payment: number
          original_amount: number
          start_date: string
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months: number
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_rate?: number
          created_at?: string
          current_balance?: number | null
          end_date?: string | null
          id?: string
          lender_name?: string | null
          loan_type?: Database["public"]["Enums"]["loan_type"]
          monthly_payment?: number
          original_amount?: number
          start_date?: string
          status?: Database["public"]["Enums"]["loan_status"] | null
          term_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          average_monthly_income: number | null
          business_monthly_revenue: number | null
          business_name: string | null
          business_rnc: string | null
          business_type: string | null
          created_at: string
          document_id: string | null
          email: string
          employee_count: number | null
          employer_name: string | null
          full_name: string | null
          gmail_connected: boolean | null
          id: string
          monthly_salary: number | null
          onboarding_completed: boolean
          onboarding_step: number
          phone: string | null
          profession_sector: string | null
          profile_type: Database["public"]["Enums"]["user_profile_type"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          average_monthly_income?: number | null
          business_monthly_revenue?: number | null
          business_name?: string | null
          business_rnc?: string | null
          business_type?: string | null
          created_at?: string
          document_id?: string | null
          email: string
          employee_count?: number | null
          employer_name?: string | null
          full_name?: string | null
          gmail_connected?: boolean | null
          id: string
          monthly_salary?: number | null
          onboarding_completed?: boolean
          onboarding_step?: number
          phone?: string | null
          profession_sector?: string | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          average_monthly_income?: number | null
          business_monthly_revenue?: number | null
          business_name?: string | null
          business_rnc?: string | null
          business_type?: string | null
          created_at?: string
          document_id?: string | null
          email?: string
          employee_count?: number | null
          employer_name?: string | null
          full_name?: string | null
          gmail_connected?: boolean | null
          id?: string
          monthly_salary?: number | null
          onboarding_completed?: boolean
          onboarding_step?: number
          phone?: string | null
          profession_sector?: string | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      income_frequency:
        | "weekly"
        | "biweekly"
        | "monthly"
        | "project_based"
        | "irregular"
      loan_status: "active" | "paid_off" | "refinanced"
      loan_type:
        | "personal"
        | "mortgage"
        | "vehicle"
        | "business"
        | "credit_card"
      user_profile_type: "employee" | "freelancer" | "business_owner"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      income_frequency: [
        "weekly",
        "biweekly",
        "monthly",
        "project_based",
        "irregular",
      ],
      loan_status: ["active", "paid_off", "refinanced"],
      loan_type: ["personal", "mortgage", "vehicle", "business", "credit_card"],
      user_profile_type: ["employee", "freelancer", "business_owner"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      freelancer_deduction_parameters: {
        Row: {
          created_at: string | null
          effective_from: string
          id: string
          is_active: boolean | null
          isr_exemption_threshold: number
          notes: string | null
          quarterly_advance_rate: number | null
          simplified_expense_rate: number
          source_retention_rate: number
          year: number
        }
        Insert: {
          created_at?: string | null
          effective_from: string
          id?: string
          is_active?: boolean | null
          isr_exemption_threshold?: number
          notes?: string | null
          quarterly_advance_rate?: number | null
          simplified_expense_rate?: number
          source_retention_rate?: number
          year: number
        }
        Update: {
          created_at?: string | null
          effective_from?: string
          id?: string
          is_active?: boolean | null
          isr_exemption_threshold?: number
          notes?: string | null
          quarterly_advance_rate?: number | null
          simplified_expense_rate?: number
          source_retention_rate?: number
          year?: number
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          base_currency: string
          fetched_at: string
          id: string
          provider: string
          rate: number
          rate_date: string
          target_currency: string
        }
        Insert: {
          base_currency?: string
          fetched_at?: string
          id?: string
          provider?: string
          rate: number
          rate_date: string
          target_currency?: string
        }
        Update: {
          base_currency?: string
          fetched_at?: string
          id?: string
          provider?: string
          rate?: number
          rate_date?: string
          target_currency?: string
        }
        Relationships: []
      }
      gmail_connections: {
        Row: {
          access_token: string | null
          connected_at: string
          google_email: string
          last_sync_at: string | null
          last_sync_stats: Json | null
          refresh_token: string
          scopes: string[]
          sync_error: string | null
          sync_status: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connected_at?: string
          google_email: string
          last_sync_at?: string | null
          last_sync_stats?: Json | null
          refresh_token: string
          scopes?: string[]
          sync_error?: string | null
          sync_status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          connected_at?: string
          google_email?: string
          last_sync_at?: string | null
          last_sync_stats?: Json | null
          refresh_token?: string
          scopes?: string[]
          sync_error?: string | null
          sync_status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      itbis_parameters: {
        Row: {
          annual_threshold: number
          created_at: string | null
          declaration_period: string | null
          effective_from: string
          id: string
          is_active: boolean | null
          notes: string | null
          reduced_rate: number | null
          retention_rate: number
          standard_rate: number
          updated_at: string | null
          year: number
        }
        Insert: {
          annual_threshold?: number
          created_at?: string | null
          declaration_period?: string | null
          effective_from: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          reduced_rate?: number | null
          retention_rate?: number
          standard_rate?: number
          updated_at?: string | null
          year: number
        }
        Update: {
          annual_threshold?: number
          created_at?: string | null
          declaration_period?: string | null
          effective_from?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          reduced_rate?: number | null
          retention_rate?: number
          standard_rate?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      credit_card_installments: {
        Row: {
          annual_rate: number
          created_at: string
          credit_card_id: string
          description: string | null
          end_date: string | null
          id: string
          monthly_payment: number
          original_amount: number
          payment_due_day: number | null
          remaining_balance: number | null
          start_date: string | null
          statement_close_day: number | null
          status: Database["public"]["Enums"]["installment_status"]
          term_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_rate?: number
          created_at?: string
          credit_card_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          monthly_payment: number
          original_amount: number
          payment_due_day?: number | null
          remaining_balance?: number | null
          start_date?: string | null
          statement_close_day?: number | null
          status?: Database["public"]["Enums"]["installment_status"]
          term_months: number
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_rate?: number
          created_at?: string
          credit_card_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          monthly_payment?: number
          original_amount?: number
          payment_due_day?: number | null
          remaining_balance?: number | null
          start_date?: string | null
          statement_close_day?: number | null
          status?: Database["public"]["Enums"]["installment_status"]
          term_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_installments_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          annual_rate: number | null
          card_label: string | null
          created_at: string
          credit_limit: number
          credit_limit_usd: number | null
          currency_mode: Database["public"]["Enums"]["credit_card_currency_mode"]
          current_balance: number
          current_balance_usd: number | null
          id: string
          issuer_name: string
          minimum_payment: number
          minimum_payment_usd: number | null
          payment_due_day: number
          statement_close_day: number | null
          status: Database["public"]["Enums"]["credit_card_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_rate?: number | null
          card_label?: string | null
          created_at?: string
          credit_limit: number
          credit_limit_usd?: number | null
          currency_mode?: Database["public"]["Enums"]["credit_card_currency_mode"]
          current_balance?: number
          current_balance_usd?: number | null
          id?: string
          issuer_name: string
          minimum_payment: number
          minimum_payment_usd?: number | null
          payment_due_day: number
          statement_close_day?: number | null
          status?: Database["public"]["Enums"]["credit_card_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_rate?: number | null
          card_label?: string | null
          created_at?: string
          credit_limit?: number
          credit_limit_usd?: number | null
          currency_mode?: Database["public"]["Enums"]["credit_card_currency_mode"]
          current_balance?: number
          current_balance_usd?: number | null
          id?: string
          issuer_name?: string
          minimum_payment?: number
          minimum_payment_usd?: number | null
          payment_due_day?: number
          statement_close_day?: number | null
          status?: Database["public"]["Enums"]["credit_card_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fixed_obligations: {
        Row: {
          created_at: string
          id: string
          monthly_amount: number
          name: string
          obligation_type: Database["public"]["Enums"]["obligation_type"]
          payment_amount: number
          payment_due_day: number
          payment_frequency: Database["public"]["Enums"]["obligation_payment_frequency"]
          provider_name: string | null
          status: Database["public"]["Enums"]["obligation_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_amount: number
          name?: string
          obligation_type: Database["public"]["Enums"]["obligation_type"]
          payment_amount: number
          payment_due_day: number
          payment_frequency?: Database["public"]["Enums"]["obligation_payment_frequency"]
          provider_name?: string | null
          status?: Database["public"]["Enums"]["obligation_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_amount?: number
          name?: string
          obligation_type?: Database["public"]["Enums"]["obligation_type"]
          payment_amount?: number
          payment_due_day?: number
          payment_frequency?: Database["public"]["Enums"]["obligation_payment_frequency"]
          provider_name?: string | null
          status?: Database["public"]["Enums"]["obligation_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          payment_due_day: number | null
          start_date: string | null
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
          payment_due_day?: number | null
          start_date?: string | null
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
          payment_due_day?: number | null
          start_date?: string | null
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
      tax_parameters: {
        Row: {
          afp_ceiling: number | null
          afp_employee: number | null
          afp_employer: number | null
          created_at: string | null
          effective_from: string
          id: string
          infotep_employer: number | null
          is_active: boolean | null
          isr_brackets: Json
          minimum_wage: number | null
          notes: string | null
          sfs_ceiling: number | null
          sfs_employee: number | null
          sfs_employer: number | null
          srl_ceiling: number | null
          srl_employer: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          afp_ceiling?: number | null
          afp_employee?: number | null
          afp_employer?: number | null
          created_at?: string | null
          effective_from: string
          id?: string
          infotep_employer?: number | null
          is_active?: boolean | null
          isr_brackets?: Json
          minimum_wage?: number | null
          notes?: string | null
          sfs_ceiling?: number | null
          sfs_employee?: number | null
          sfs_employer?: number | null
          srl_ceiling?: number | null
          srl_employer?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          afp_ceiling?: number | null
          afp_employee?: number | null
          afp_employer?: number | null
          created_at?: string | null
          effective_from?: string
          id?: string
          infotep_employer?: number | null
          is_active?: boolean | null
          isr_brackets?: Json
          minimum_wage?: number | null
          notes?: string | null
          sfs_ceiling?: number | null
          sfs_employee?: number | null
          sfs_employer?: number | null
          srl_ceiling?: number | null
          srl_employer?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          bank_name: string
          category_source: string | null
          created_at: string
          currency: string
          description: string | null
          exchange_rate: number | null
          expense_category: Database["public"]["Enums"]["expense_category"] | null
          gmail_message_id: string
          id: string
          merchant_name: string | null
          original_amount: number | null
          original_currency: string | null
          parse_status: Database["public"]["Enums"]["transaction_parse_status"]
          rate_source: string | null
          raw_from: string | null
          raw_subject: string | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_name: string
          category_source?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          exchange_rate?: number | null
          expense_category?: Database["public"]["Enums"]["expense_category"] | null
          gmail_message_id: string
          id?: string
          merchant_name?: string | null
          original_amount?: number | null
          original_currency?: string | null
          parse_status?: Database["public"]["Enums"]["transaction_parse_status"]
          rate_source?: string | null
          raw_from?: string | null
          raw_subject?: string | null
          transaction_date: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_name?: string
          category_source?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          exchange_rate?: number | null
          expense_category?: Database["public"]["Enums"]["expense_category"] | null
          gmail_message_id?: string
          id?: string
          merchant_name?: string | null
          original_amount?: number | null
          original_currency?: string | null
          parse_status?: Database["public"]["Enums"]["transaction_parse_status"]
          rate_source?: string | null
          raw_from?: string | null
          raw_subject?: string | null
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_ai_insights: {
        Row: {
          context_hash: string
          diagnosis: string
          generated_at: string
          source: string
          tips: Json
          trigger_event: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_hash: string
          diagnosis: string
          generated_at?: string
          source: string
          tips?: Json
          trigger_event: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_hash?: string
          diagnosis?: string
          generated_at?: string
          source?: string
          tips?: Json
          trigger_event?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          annual_deductible_costs: number | null
          annual_deductible_expenses: number | null
          annual_gross_revenue: number | null
          annual_retentions_10pct: number | null
          avatar_url: string | null
          average_monthly_income: number | null
          business_monthly_revenue: number | null
          business_name: string | null
          business_rnc: string | null
          business_type: string | null
          contributes_afp: boolean | null
          contributes_sipen: boolean | null
          created_at: string
          document_id: string | null
          effective_tax_rate: number | null
          email: string
          employee_count: number | null
          employer_name: string | null
          full_name: string | null
          gmail_connected: boolean | null
          id: string
          monthly_afp_deduction: number | null
          monthly_salary: number | null
          monthly_sfs_deduction: number | null
          monthly_tax_advance: number | null
          monthly_tss_deduction: number | null
          onboarding_completed: boolean
          onboarding_step: number
          phone: string | null
          profession_sector: string | null
          profile_type: Database["public"]["Enums"]["user_profile_type"] | null
          projected_annual_tax: number | null
          projected_monthly_tax: number | null
          tax_bracket: number | null
          updated_at: string
          uses_rst: boolean | null
          uses_simplified_deduction: boolean | null
        }
        Insert: {
          annual_deductible_costs?: number | null
          annual_deductible_expenses?: number | null
          annual_gross_revenue?: number | null
          annual_retentions_10pct?: number | null
          avatar_url?: string | null
          average_monthly_income?: number | null
          business_monthly_revenue?: number | null
          business_name?: string | null
          business_rnc?: string | null
          business_type?: string | null
          contributes_afp?: boolean | null
          contributes_sipen?: boolean | null
          created_at?: string
          document_id?: string | null
          effective_tax_rate?: number | null
          email: string
          employee_count?: number | null
          employer_name?: string | null
          full_name?: string | null
          gmail_connected?: boolean | null
          id: string
          monthly_afp_deduction?: number | null
          monthly_salary?: number | null
          monthly_sfs_deduction?: number | null
          monthly_tax_advance?: number | null
          monthly_tss_deduction?: number | null
          onboarding_completed?: boolean
          onboarding_step?: number
          phone?: string | null
          profession_sector?: string | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"] | null
          projected_annual_tax?: number | null
          projected_monthly_tax?: number | null
          tax_bracket?: number | null
          updated_at?: string
          uses_rst?: boolean | null
          uses_simplified_deduction?: boolean | null
        }
        Update: {
          annual_deductible_costs?: number | null
          annual_deductible_expenses?: number | null
          annual_gross_revenue?: number | null
          annual_retentions_10pct?: number | null
          avatar_url?: string | null
          average_monthly_income?: number | null
          business_monthly_revenue?: number | null
          business_name?: string | null
          business_rnc?: string | null
          business_type?: string | null
          contributes_afp?: boolean | null
          contributes_sipen?: boolean | null
          created_at?: string
          document_id?: string | null
          effective_tax_rate?: number | null
          email?: string
          employee_count?: number | null
          employer_name?: string | null
          full_name?: string | null
          gmail_connected?: boolean | null
          id?: string
          monthly_afp_deduction?: number | null
          monthly_salary?: number | null
          monthly_sfs_deduction?: number | null
          monthly_tax_advance?: number | null
          monthly_tss_deduction?: number | null
          onboarding_completed?: boolean
          onboarding_step?: number
          phone?: string | null
          profession_sector?: string | null
          profile_type?: Database["public"]["Enums"]["user_profile_type"] | null
          projected_annual_tax?: number | null
          projected_monthly_tax?: number | null
          tax_bracket?: number | null
          updated_at?: string
          uses_rst?: boolean | null
          uses_simplified_deduction?: boolean | null
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
      credit_card_currency_mode: "dop_only" | "usd_only" | "mixed"
      credit_card_status: "active" | "closed"
      expense_category:
        | "transferencias"
        | "entretenimiento"
        | "restaurantes"
        | "supermercados"
        | "transporte"
        | "salud"
        | "educacion"
        | "servicios"
        | "telecom"
        | "ocio"
        | "compras"
        | "viajes"
        | "deudas"
        | "negocios"
        | "hogar"
        | "mascotas"
        | "ahorros"
        | "otros"
      income_frequency:
        | "weekly"
        | "biweekly"
        | "monthly"
        | "project_based"
        | "irregular"
      installment_status: "active" | "paid_off"
      loan_status: "active" | "paid_off" | "refinanced"
      loan_type: "personal" | "mortgage" | "vehicle" | "business"
      obligation_payment_frequency: "monthly" | "weekly" | "biweekly" | "daily"
      obligation_status: "active" | "inactive"
      obligation_type:
        | "rent"
        | "electricity"
        | "water"
        | "gas"
        | "internet"
        | "transport"
        | "insurance"
        | "gym"
        | "university"
        | "other"
      transaction_parse_status: "parsed" | "partial" | "failed"
      transaction_type:
        | "debit"
        | "credit"
        | "transfer"
        | "payment"
        | "deposit"
        | "unknown"
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
  public: {
    Enums: {
      expense_category: [
        "transferencias",
        "entretenimiento",
        "restaurantes",
        "supermercados",
        "transporte",
        "salud",
        "educacion",
        "servicios",
        "telecom",
        "ocio",
        "compras",
        "viajes",
        "deudas",
        "negocios",
        "hogar",
        "mascotas",
        "ahorros",
        "otros",
      ],
      income_frequency: [
        "weekly",
        "biweekly",
        "monthly",
        "project_based",
        "irregular",
      ],
      credit_card_currency_mode: ["dop_only", "usd_only", "mixed"],
      credit_card_status: ["active", "closed"],
      installment_status: ["active", "paid_off"],
      loan_status: ["active", "paid_off", "refinanced"],
      loan_type: ["personal", "mortgage", "vehicle", "business"],
      obligation_payment_frequency: ["monthly", "weekly", "biweekly", "daily"],
      obligation_status: ["active", "inactive"],
      obligation_type: [
        "rent",
        "electricity",
        "water",
        "gas",
        "internet",
        "transport",
        "insurance",
        "gym",
        "university",
        "other",
      ],
      transaction_parse_status: ["parsed", "partial", "failed"],
      transaction_type: [
        "debit",
        "credit",
        "transfer",
        "payment",
        "deposit",
        "unknown",
      ],
      user_profile_type: ["employee", "freelancer", "business_owner"],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      cook_logs: {
        Row: {
          actual_yield_grams: number | null
          containers: number | null
          cooked_at: string
          created_at: string
          finished_at: string | null
          id: string
          multiplier: number
          note: string | null
          rating: number | null
          recipe_id: string
          snapshot: Json
        }
        Insert: {
          actual_yield_grams?: number | null
          containers?: number | null
          cooked_at?: string
          created_at?: string
          finished_at?: string | null
          id?: string
          multiplier?: number
          note?: string | null
          rating?: number | null
          recipe_id: string
          snapshot: Json
        }
        Update: {
          actual_yield_grams?: number | null
          containers?: number | null
          cooked_at?: string
          created_at?: string
          finished_at?: string | null
          id?: string
          multiplier?: number
          note?: string | null
          rating?: number | null
          recipe_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "cook_logs_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      dish_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          archived_at: string | null
          carbs_100: number | null
          created_at: string
          fat_100: number | null
          id: string
          is_approximate: boolean
          kcal_100: number | null
          name: string | null
          note: string | null
          product_id: string
          protein_100: number | null
          source: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          carbs_100?: number | null
          created_at?: string
          fat_100?: number | null
          id?: string
          is_approximate?: boolean
          kcal_100?: number | null
          name?: string | null
          note?: string | null
          product_id: string
          protein_100?: number | null
          source?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          carbs_100?: number | null
          created_at?: string
          fat_100?: number | null
          id?: string
          is_approximate?: boolean
          kcal_100?: number | null
          name?: string | null
          note?: string | null
          product_id?: string
          protein_100?: number | null
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active_variant_id: string | null
          archived_at: string | null
          category_id: string
          created_at: string
          id: string
          name: string
          note: string | null
          updated_at: string
        }
        Insert: {
          active_variant_id?: string | null
          archived_at?: string | null
          category_id: string
          created_at?: string
          id?: string
          name: string
          note?: string | null
          updated_at?: string
        }
        Update: {
          active_variant_id?: string | null
          archived_at?: string | null
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_active_variant"
            columns: ["active_variant_id", "id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id", "product_id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_dish_categories: {
        Row: {
          dish_category_id: string
          recipe_id: string
        }
        Insert: {
          dish_category_id: string
          recipe_id: string
        }
        Update: {
          dish_category_id?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_dish_categories_dish_category_id_fkey"
            columns: ["dish_category_id"]
            isOneToOne: false
            referencedRelation: "dish_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_dish_categories_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          amount_grams: number
          id: string
          is_optional: boolean
          note: string | null
          pinned_variant_id: string | null
          product_id: string
          recipe_id: string
          sort_order: number
        }
        Insert: {
          amount_grams: number
          id?: string
          is_optional?: boolean
          note?: string | null
          pinned_variant_id?: string | null
          product_id: string
          recipe_id: string
          sort_order: number
        }
        Update: {
          amount_grams?: number
          id?: string
          is_optional?: boolean
          note?: string | null
          pinned_variant_id?: string | null
          product_id?: string
          recipe_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_pinned_variant"
            columns: ["product_id", "pinned_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["product_id", "id"]
          },
          {
            foreignKeyName: "recipe_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_steps: {
        Row: {
          id: string
          recipe_id: string
          sort_order: number
          text: string
        }
        Insert: {
          id?: string
          recipe_id: string
          sort_order: number
          text: string
        }
        Update: {
          id?: string
          recipe_id?: string
          sort_order?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          archived_at: string | null
          carbs_100_override: number | null
          cook_time_min: number | null
          created_at: string
          fat_100_override: number | null
          freezable: boolean
          freezer_days: number | null
          fridge_days: number | null
          id: string
          kcal_100_override: number | null
          name: string
          notes: string | null
          photo_path: string | null
          protein_100_override: number | null
          servings_base: number
          updated_at: string
          video_urls: string[]
          yield_grams: number | null
        }
        Insert: {
          archived_at?: string | null
          carbs_100_override?: number | null
          cook_time_min?: number | null
          created_at?: string
          fat_100_override?: number | null
          freezable?: boolean
          freezer_days?: number | null
          fridge_days?: number | null
          id?: string
          kcal_100_override?: number | null
          name: string
          notes?: string | null
          photo_path?: string | null
          protein_100_override?: number | null
          servings_base?: number
          updated_at?: string
          video_urls?: string[]
          yield_grams?: number | null
        }
        Update: {
          archived_at?: string | null
          carbs_100_override?: number | null
          cook_time_min?: number | null
          created_at?: string
          fat_100_override?: number | null
          freezable?: boolean
          freezer_days?: number | null
          fridge_days?: number | null
          id?: string
          kcal_100_override?: number | null
          name?: string
          notes?: string | null
          photo_path?: string | null
          protein_100_override?: number | null
          servings_base?: number
          updated_at?: string
          video_urls?: string[]
          yield_grams?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_product_with_variant: {
        Args: {
          p_carbs_100?: number
          p_category_id: string
          p_fat_100?: number
          p_is_approximate?: boolean
          p_kcal_100?: number
          p_product_name: string
          p_product_note?: string
          p_protein_100?: number
          p_variant_name?: string
          p_variant_note?: string
        }
        Returns: string
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
    Enums: {},
  },
} as const


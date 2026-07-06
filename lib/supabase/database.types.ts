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
      ai_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["ai_action_type"]
          applied_at: string | null
          conversation_id: string | null
          created_at: string
          id: string
          payload: Json
          rationale: string | null
          reverted_at: string | null
          status: Database["public"]["Enums"]["ai_action_status"]
          user_id: string
        }
        Insert: {
          action_type: Database["public"]["Enums"]["ai_action_type"]
          applied_at?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          payload: Json
          rationale?: string | null
          reverted_at?: string | null
          status?: Database["public"]["Enums"]["ai_action_status"]
          user_id: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["ai_action_type"]
          applied_at?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          rationale?: string | null
          reverted_at?: string | null
          status?: Database["public"]["Enums"]["ai_action_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_actions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          context_snapshot: Json | null
          conversation_id: string
          created_at: string
          id: string
          role: string
          token_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          context_snapshot?: Json | null
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          token_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          context_snapshot?: Json | null
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          token_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_recommendations: {
        Row: {
          created_at: string
          data_used: Json | null
          domain: string
          id: string
          is_dismissed: boolean
          rationale: string | null
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_used?: Json | null
          domain: string
          id?: string
          is_dismissed?: boolean
          rationale?: string | null
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_used?: Json | null
          domain?: string
          id?: string
          is_dismissed?: boolean
          rationale?: string | null
          summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      body_measurements: {
        Row: {
          arm_left_cm: number | null
          arm_right_cm: number | null
          body_fat_pct: number | null
          calf_left_cm: number | null
          calf_right_cm: number | null
          chest_cm: number | null
          created_at: string
          hips_cm: number | null
          id: string
          measured_at: string
          muscle_mass_kg: number | null
          neck_cm: number | null
          notes: string | null
          shoulders_cm: number | null
          thigh_left_cm: number | null
          thigh_right_cm: number | null
          user_id: string
          waist_cm: number | null
          water_mass_pct: number | null
          weight_kg: number | null
        }
        Insert: {
          arm_left_cm?: number | null
          arm_right_cm?: number | null
          body_fat_pct?: number | null
          calf_left_cm?: number | null
          calf_right_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          hips_cm?: number | null
          id?: string
          measured_at?: string
          muscle_mass_kg?: number | null
          neck_cm?: number | null
          notes?: string | null
          shoulders_cm?: number | null
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          user_id: string
          waist_cm?: number | null
          water_mass_pct?: number | null
          weight_kg?: number | null
        }
        Update: {
          arm_left_cm?: number | null
          arm_right_cm?: number | null
          body_fat_pct?: number | null
          calf_left_cm?: number | null
          calf_right_cm?: number | null
          chest_cm?: number | null
          created_at?: string
          hips_cm?: number | null
          id?: string
          measured_at?: string
          muscle_mass_kg?: number | null
          neck_cm?: number | null
          notes?: string | null
          shoulders_cm?: number | null
          thigh_left_cm?: number | null
          thigh_right_cm?: number | null
          user_id?: string
          waist_cm?: number | null
          water_mass_pct?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "body_measurements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          completed_at: string | null
          created_at: string
          ends_at: string | null
          event_type: Database["public"]["Enums"]["calendar_event_type"]
          id: string
          is_overdue: boolean
          is_recurring: boolean
          notes: string | null
          recurrence_rule: string | null
          related_meal_id: string | null
          related_tennis_session_id: string | null
          related_workout_session_id: string | null
          starts_at: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          ends_at?: string | null
          event_type: Database["public"]["Enums"]["calendar_event_type"]
          id?: string
          is_overdue?: boolean
          is_recurring?: boolean
          notes?: string | null
          recurrence_rule?: string | null
          related_meal_id?: string | null
          related_tennis_session_id?: string | null
          related_workout_session_id?: string | null
          starts_at: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["calendar_event_type"]
          id?: string
          is_overdue?: boolean
          is_recurring?: boolean
          notes?: string | null
          recurrence_rule?: string | null
          related_meal_id?: string | null
          related_tennis_session_id?: string | null
          related_workout_session_id?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_related_meal_id_fkey"
            columns: ["related_meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_related_tennis_session_id_fkey"
            columns: ["related_tennis_session_id"]
            isOneToOne: false
            referencedRelation: "tennis_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_related_workout_session_id_fkey"
            columns: ["related_workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_checkins: {
        Row: {
          checkin_date: string
          created_at: string
          digestion: number | null
          energy: number | null
          fatigue: number | null
          hunger: number | null
          id: string
          mood: number | null
          motivation: number | null
          notes: string | null
          readiness_score: number | null
          resting_heart_rate: number | null
          sleep_hours: number | null
          sleep_quality: number | null
          soreness: number | null
          stress: number | null
          training_motivation: number | null
          user_id: string
        }
        Insert: {
          checkin_date?: string
          created_at?: string
          digestion?: number | null
          energy?: number | null
          fatigue?: number | null
          hunger?: number | null
          id?: string
          mood?: number | null
          motivation?: number | null
          notes?: string | null
          readiness_score?: number | null
          resting_heart_rate?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
          training_motivation?: number | null
          user_id: string
        }
        Update: {
          checkin_date?: string
          created_at?: string
          digestion?: number | null
          energy?: number | null
          fatigue?: number | null
          hunger?: number | null
          id?: string
          mood?: number | null
          motivation?: number | null
          notes?: string | null
          readiness_score?: number | null
          resting_heart_rate?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
          training_motivation?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_variations: {
        Row: {
          alternative_exercise_id: string
          created_at: string
          exercise_id: string
          id: string
          reason: string | null
        }
        Insert: {
          alternative_exercise_id: string
          created_at?: string
          exercise_id: string
          id?: string
          reason?: string | null
        }
        Update: {
          alternative_exercise_id?: string
          created_at?: string
          exercise_id?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_variations_alternative_exercise_id_fkey"
            columns: ["alternative_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_variations_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          common_mistakes: string | null
          contraindications: string | null
          created_at: string
          equipment: string[]
          id: string
          instructions: string | null
          is_unilateral: boolean
          level: Database["public"]["Enums"]["sport_level"]
          media_url: string | null
          movement_type: Database["public"]["Enums"]["movement_type"]
          name: string
          primary_muscle: Database["public"]["Enums"]["muscle_group"]
          recommended_rom: string | null
          secondary_muscles: Database["public"]["Enums"]["muscle_group"][]
          technique_tips: string | null
          updated_at: string
        }
        Insert: {
          common_mistakes?: string | null
          contraindications?: string | null
          created_at?: string
          equipment?: string[]
          id?: string
          instructions?: string | null
          is_unilateral?: boolean
          level?: Database["public"]["Enums"]["sport_level"]
          media_url?: string | null
          movement_type: Database["public"]["Enums"]["movement_type"]
          name: string
          primary_muscle: Database["public"]["Enums"]["muscle_group"]
          recommended_rom?: string | null
          secondary_muscles?: Database["public"]["Enums"]["muscle_group"][]
          technique_tips?: string | null
          updated_at?: string
        }
        Update: {
          common_mistakes?: string | null
          contraindications?: string | null
          created_at?: string
          equipment?: string[]
          id?: string
          instructions?: string | null
          is_unilateral?: boolean
          level?: Database["public"]["Enums"]["sport_level"]
          media_url?: string | null
          movement_type?: Database["public"]["Enums"]["movement_type"]
          name?: string
          primary_muscle?: Database["public"]["Enums"]["muscle_group"]
          recommended_rom?: string | null
          secondary_muscles?: Database["public"]["Enums"]["muscle_group"][]
          technique_tips?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          barcode: string | null
          brand: string | null
          calories_kcal_per_100g: number
          carbs_g_per_100g: number
          created_at: string
          fat_g_per_100g: number
          fiber_g_per_100g: number | null
          id: string
          is_favorite: boolean
          name: string
          protein_g_per_100g: number
          serving_size_g: number | null
          user_id: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_kcal_per_100g: number
          carbs_g_per_100g: number
          created_at?: string
          fat_g_per_100g: number
          fiber_g_per_100g?: number | null
          id?: string
          is_favorite?: boolean
          name: string
          protein_g_per_100g: number
          serving_size_g?: number | null
          user_id?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_kcal_per_100g?: number
          carbs_g_per_100g?: number
          created_at?: string
          fat_g_per_100g?: number
          fiber_g_per_100g?: number | null
          id?: string
          is_favorite?: boolean
          name?: string
          protein_g_per_100g?: number
          serving_size_g?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          available_equipment: string[]
          created_at: string
          id: string
          is_active: boolean
          max_session_minutes: number | null
          primary_goal: Database["public"]["Enums"]["primary_goal"]
          secondary_goals: Database["public"]["Enums"]["secondary_goal"][]
          sport_level: Database["public"]["Enums"]["sport_level"] | null
          target_date: string | null
          target_weight_kg: number | null
          tennis_level: string | null
          training_location:
            | Database["public"]["Enums"]["training_location"]
            | null
          updated_at: string
          user_id: string
          weekly_sessions_target: number | null
        }
        Insert: {
          available_equipment?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          max_session_minutes?: number | null
          primary_goal: Database["public"]["Enums"]["primary_goal"]
          secondary_goals?: Database["public"]["Enums"]["secondary_goal"][]
          sport_level?: Database["public"]["Enums"]["sport_level"] | null
          target_date?: string | null
          target_weight_kg?: number | null
          tennis_level?: string | null
          training_location?:
            | Database["public"]["Enums"]["training_location"]
            | null
          updated_at?: string
          user_id: string
          weekly_sessions_target?: number | null
        }
        Update: {
          available_equipment?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          max_session_minutes?: number | null
          primary_goal?: Database["public"]["Enums"]["primary_goal"]
          secondary_goals?: Database["public"]["Enums"]["secondary_goal"][]
          sport_level?: Database["public"]["Enums"]["sport_level"] | null
          target_date?: string | null
          target_weight_kg?: number | null
          tennis_level?: string | null
          training_location?:
            | Database["public"]["Enums"]["training_location"]
            | null
          updated_at?: string
          user_id?: string
          weekly_sessions_target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          habit_id: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          habit_id: string
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          target_frequency_per_week: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          target_frequency_per_week?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          target_frequency_per_week?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_items: {
        Row: {
          created_at: string
          food_item_id: string | null
          id: string
          meal_id: string
          quantity_g: number
          recipe_id: string | null
        }
        Insert: {
          created_at?: string
          food_item_id?: string | null
          id?: string
          meal_id: string
          quantity_g: number
          recipe_id?: string | null
        }
        Update: {
          created_at?: string
          food_item_id?: string | null
          id?: string
          meal_id?: string
          quantity_g?: number
          recipe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plan_days: {
        Row: {
          created_at: string
          food_item_id: string | null
          id: string
          meal_plan_id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          plan_date: string
          quantity_g: number | null
          recipe_id: string | null
        }
        Insert: {
          created_at?: string
          food_item_id?: string | null
          id?: string
          meal_plan_id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          plan_date: string
          quantity_g?: number | null
          recipe_id?: string | null
        }
        Update: {
          created_at?: string
          food_item_id?: string | null
          id?: string
          meal_plan_id?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          plan_date?: string
          quantity_g?: number | null
          recipe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_days_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_days_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_days_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string
          id: string
          logged_at: string | null
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes: string | null
          planned_at: string | null
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logged_at?: string | null
          meal_date?: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          planned_at?: string | null
          source?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          logged_at?: string | null
          meal_date?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          planned_at?: string | null
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_plans: {
        Row: {
          created_at: string
          days: Json
          generated_at: string
          id: string
          is_active: boolean
          parameters: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days: Json
          generated_at?: string
          id?: string
          is_active?: boolean
          parameters?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days?: Json
          generated_at?: string
          id?: string
          is_active?: boolean
          parameters?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_reports: {
        Row: {
          created_at: string
          id: string
          metrics: Json | null
          period: Database["public"]["Enums"]["report_period"]
          period_end: string
          period_start: string
          recommendations: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json | null
          period?: Database["public"]["Enums"]["report_period"]
          period_end: string
          period_start: string
          recommendations?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json | null
          period?: Database["public"]["Enums"]["report_period"]
          period_end?: string
          period_start?: string
          recommendations?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          is_read: boolean
          link_path: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category: string
          created_at?: string
          id?: string
          is_read?: boolean
          link_path?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link_path?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_targets: {
        Row: {
          calories_kcal: number
          carbs_g: number
          created_at: string
          effective_from: string
          fat_g: number
          fiber_g: number | null
          id: string
          is_manual_override: boolean
          protein_g: number
          user_id: string
          water_ml: number | null
        }
        Insert: {
          calories_kcal: number
          carbs_g: number
          created_at?: string
          effective_from?: string
          fat_g: number
          fiber_g?: number | null
          id?: string
          is_manual_override?: boolean
          protein_g: number
          user_id: string
          water_ml?: number | null
        }
        Update: {
          calories_kcal?: number
          carbs_g?: number
          created_at?: string
          effective_from?: string
          fat_g?: number
          fiber_g?: number | null
          id?: string
          is_manual_override?: boolean
          protein_g?: number
          user_id?: string
          water_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_targets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pain_logs: {
        Row: {
          body_zone: string
          created_at: string
          id: string
          intensity: number
          notes: string | null
          pain_type: string | null
          resolved_on: string | null
          side: Database["public"]["Enums"]["pain_side"] | null
          started_on: string
          trigger_movement: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body_zone: string
          created_at?: string
          id?: string
          intensity: number
          notes?: string | null
          pain_type?: string | null
          resolved_on?: string | null
          side?: Database["public"]["Enums"]["pain_side"] | null
          started_on?: string
          trigger_movement?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body_zone?: string
          created_at?: string
          id?: string
          intensity?: number
          notes?: string | null
          pain_type?: string | null
          resolved_on?: string | null
          side?: Database["public"]["Enums"]["pain_side"] | null
          started_on?: string
          trigger_movement?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pain_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_records: {
        Row: {
          achieved_at: string
          created_at: string
          exercise_id: string
          id: string
          record_type: string
          user_id: string
          value: number
          workout_set_id: string | null
        }
        Insert: {
          achieved_at?: string
          created_at?: string
          exercise_id: string
          id?: string
          record_type: string
          user_id: string
          value: number
          workout_set_id?: string | null
        }
        Update: {
          achieved_at?: string
          created_at?: string
          exercise_id?: string
          id?: string
          record_type?: string
          user_id?: string
          value?: number
          workout_set_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_workout_set_id_fkey"
            columns: ["workout_set_id"]
            isOneToOne: false
            referencedRelation: "workout_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          first_name: string
          height_cm: number | null
          id: string
          locale: string
          onboarding_completed_at: string | null
          sex: Database["public"]["Enums"]["sex_type"] | null
          units_length: string
          units_weight: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          first_name: string
          height_cm?: number | null
          id: string
          locale?: string
          onboarding_completed_at?: string | null
          sex?: Database["public"]["Enums"]["sex_type"] | null
          units_length?: string
          units_weight?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          first_name?: string
          height_cm?: number | null
          id?: string
          locale?: string
          onboarding_completed_at?: string | null
          sex?: Database["public"]["Enums"]["sex_type"] | null
          units_length?: string
          units_weight?: string
          updated_at?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          angle: string
          created_at: string
          id: string
          is_hidden: boolean
          storage_path: string
          taken_at: string
          user_id: string
        }
        Insert: {
          angle: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          storage_path: string
          taken_at?: string
          user_id: string
        }
        Update: {
          angle?: string
          created_at?: string
          id?: string
          is_hidden?: boolean
          storage_path?: string
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          custom_name: string | null
          food_item_id: string | null
          id: string
          quantity_g: number
          recipe_id: string
          shopping_category: string | null
        }
        Insert: {
          created_at?: string
          custom_name?: string | null
          food_item_id?: string | null
          id?: string
          quantity_g: number
          recipe_id: string
          shopping_category?: string | null
        }
        Update: {
          created_at?: string
          custom_name?: string | null
          food_item_id?: string | null
          id?: string
          quantity_g?: number
          recipe_id?: string
          shopping_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
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
      recipes: {
        Row: {
          batch_cooking_friendly: boolean
          calories_kcal: number | null
          carbs_g: number | null
          cook_minutes: number | null
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_cost_eur: number | null
          fat_g: number | null
          fiber_g: number | null
          id: string
          image_storage_path: string | null
          name: string
          prep_minutes: number | null
          protein_g: number | null
          servings: number
          storage_instructions: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          batch_cooking_friendly?: boolean
          calories_kcal?: number | null
          carbs_g?: number | null
          cook_minutes?: number | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_cost_eur?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          image_storage_path?: string | null
          name: string
          prep_minutes?: number | null
          protein_g?: number | null
          servings?: number
          storage_instructions?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          batch_cooking_friendly?: boolean
          calories_kcal?: number | null
          carbs_g?: number | null
          cook_minutes?: number | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_cost_eur?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          image_storage_path?: string | null
          name?: string
          prep_minutes?: number | null
          protein_g?: number | null
          servings?: number
          storage_instructions?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          category: string
          created_at: string
          days_of_week: number[]
          id: string
          is_enabled: boolean
          label: string
          reminder_time: string
          snoozed_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_enabled?: boolean
          label: string
          reminder_time: string
          snoozed_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_enabled?: boolean
          label?: string
          reminder_time?: string
          snoozed_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_items: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_checked: boolean
          label: string
          quantity_g: number | null
          shopping_list_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_checked?: boolean
          label: string
          quantity_g?: number | null
          shopping_list_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_checked?: boolean
          label?: string
          quantity_g?: number | null
          shopping_list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          id: string
          meal_plan_id: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_plan_id?: string | null
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_plan_id?: string | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_lists_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplement_logs: {
        Row: {
          created_at: string
          dosage_taken: number | null
          id: string
          notes: string | null
          supplement_id: string
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage_taken?: number | null
          id?: string
          notes?: string | null
          supplement_id: string
          taken_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage_taken?: number | null
          id?: string
          notes?: string | null
          supplement_id?: string
          taken_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplement_logs_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "supplements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplement_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplements: {
        Row: {
          adverse_effects: string | null
          brand: string | null
          created_at: string
          dosage: number | null
          end_date: string | null
          frequency: string | null
          goal: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          perceived_effects: string | null
          requires_medical_validation: boolean
          start_date: string | null
          stock_remaining: number | null
          timing: string | null
          type: Database["public"]["Enums"]["supplement_type"]
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adverse_effects?: string | null
          brand?: string | null
          created_at?: string
          dosage?: number | null
          end_date?: string | null
          frequency?: string | null
          goal?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          perceived_effects?: string | null
          requires_medical_validation?: boolean
          start_date?: string | null
          stock_remaining?: number | null
          timing?: string | null
          type: Database["public"]["Enums"]["supplement_type"]
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adverse_effects?: string | null
          brand?: string | null
          created_at?: string
          dosage?: number | null
          end_date?: string | null
          frequency?: string | null
          goal?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          perceived_effects?: string | null
          requires_medical_validation?: boolean
          start_date?: string | null
          stock_remaining?: number | null
          timing?: string | null
          type?: Database["public"]["Enums"]["supplement_type"]
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tennis_drills: {
        Row: {
          category: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          name: string
          notes: string | null
          tennis_session_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          name: string
          notes?: string | null
          tennis_session_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          name?: string
          notes?: string | null
          tennis_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tennis_drills_tennis_session_id_fkey"
            columns: ["tennis_session_id"]
            isOneToOne: false
            referencedRelation: "tennis_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tennis_sessions: {
        Row: {
          backhand_rating: number | null
          coach_name: string | null
          created_at: string
          duration_minutes: number | null
          fatigue: number | null
          forehand_rating: number | null
          id: string
          intensity: number | null
          is_match: boolean
          match_score: string | null
          match_won: boolean | null
          movement_rating: number | null
          notes: string | null
          pain_flag: boolean
          partner_name: string | null
          service_rating: number | null
          session_date: string
          session_type: string | null
          surface: string | null
          user_id: string
          volley_rating: number | null
        }
        Insert: {
          backhand_rating?: number | null
          coach_name?: string | null
          created_at?: string
          duration_minutes?: number | null
          fatigue?: number | null
          forehand_rating?: number | null
          id?: string
          intensity?: number | null
          is_match?: boolean
          match_score?: string | null
          match_won?: boolean | null
          movement_rating?: number | null
          notes?: string | null
          pain_flag?: boolean
          partner_name?: string | null
          service_rating?: number | null
          session_date?: string
          session_type?: string | null
          surface?: string | null
          user_id: string
          volley_rating?: number | null
        }
        Update: {
          backhand_rating?: number | null
          coach_name?: string | null
          created_at?: string
          duration_minutes?: number | null
          fatigue?: number | null
          forehand_rating?: number | null
          id?: string
          intensity?: number | null
          is_match?: boolean
          match_score?: string | null
          match_won?: boolean | null
          movement_rating?: number | null
          notes?: string | null
          pain_flag?: boolean
          partner_name?: string | null
          service_rating?: number | null
          session_date?: string
          session_type?: string | null
          surface?: string | null
          user_id?: string
          volley_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tennis_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          ai_history_retained: boolean
          ai_personalization_enabled: boolean
          allergies: string[]
          average_energy: number | null
          average_sleep_quality: number | null
          average_stress: number | null
          cooking_budget_level: string | null
          cooking_time_minutes: number | null
          created_at: string
          dark_mode: boolean
          data_export_requested_at: string | null
          declared_treatments: string | null
          diet_type: Database["public"]["Enums"]["diet_type"] | null
          intolerances: string[]
          joint_limitations: string | null
          notifications_enabled: boolean
          past_injuries: string | null
          preferred_meals_count: number | null
          refused_foods: string[]
          updated_at: string
          user_id: string
          voluntary_health_notes: string | null
        }
        Insert: {
          ai_history_retained?: boolean
          ai_personalization_enabled?: boolean
          allergies?: string[]
          average_energy?: number | null
          average_sleep_quality?: number | null
          average_stress?: number | null
          cooking_budget_level?: string | null
          cooking_time_minutes?: number | null
          created_at?: string
          dark_mode?: boolean
          data_export_requested_at?: string | null
          declared_treatments?: string | null
          diet_type?: Database["public"]["Enums"]["diet_type"] | null
          intolerances?: string[]
          joint_limitations?: string | null
          notifications_enabled?: boolean
          past_injuries?: string | null
          preferred_meals_count?: number | null
          refused_foods?: string[]
          updated_at?: string
          user_id: string
          voluntary_health_notes?: string | null
        }
        Update: {
          ai_history_retained?: boolean
          ai_personalization_enabled?: boolean
          allergies?: string[]
          average_energy?: number | null
          average_sleep_quality?: number | null
          average_stress?: number | null
          cooking_budget_level?: string | null
          cooking_time_minutes?: number | null
          created_at?: string
          dark_mode?: boolean
          data_export_requested_at?: string | null
          declared_treatments?: string | null
          diet_type?: Database["public"]["Enums"]["diet_type"] | null
          intolerances?: string[]
          joint_limitations?: string | null
          notifications_enabled?: boolean
          past_injuries?: string | null
          preferred_meals_count?: number | null
          refused_foods?: string[]
          updated_at?: string
          user_id?: string
          voluntary_health_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_reports: {
        Row: {
          created_at: string
          id: string
          metrics: Json | null
          period: Database["public"]["Enums"]["report_period"]
          period_end: string
          period_start: string
          recommendations: string | null
          summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json | null
          period?: Database["public"]["Enums"]["report_period"]
          period_end: string
          period_start: string
          recommendations?: string | null
          summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json | null
          period?: Database["public"]["Enums"]["report_period"]
          period_end?: string
          period_start?: string
          recommendations?: string | null
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_program_days: {
        Row: {
          created_at: string
          day_index: number
          id: string
          name: string
          notes: string | null
          program_id: string
        }
        Insert: {
          created_at?: string
          day_index: number
          id?: string
          name: string
          notes?: string | null
          program_id: string
        }
        Update: {
          created_at?: string
          day_index?: number
          id?: string
          name?: string
          notes?: string | null
          program_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_program_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "workout_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_program_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          is_optional: boolean
          notes: string | null
          order_index: number
          program_day_id: string
          rest_seconds: number | null
          set_type: Database["public"]["Enums"]["set_type"]
          target_reps_max: number | null
          target_reps_min: number | null
          target_rir: number | null
          target_rpe: number | null
          target_sets: number
          tempo: string | null
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          is_optional?: boolean
          notes?: string | null
          order_index: number
          program_day_id: string
          rest_seconds?: number | null
          set_type?: Database["public"]["Enums"]["set_type"]
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_rir?: number | null
          target_rpe?: number | null
          target_sets?: number
          tempo?: string | null
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          is_optional?: boolean
          notes?: string | null
          order_index?: number
          program_day_id?: string
          rest_seconds?: number | null
          set_type?: Database["public"]["Enums"]["set_type"]
          target_reps_max?: number | null
          target_reps_min?: number | null
          target_rir?: number | null
          target_rpe?: number | null
          target_sets?: number
          tempo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_program_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_program_exercises_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "workout_program_days"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_programs: {
        Row: {
          created_at: string
          goal: Database["public"]["Enums"]["secondary_goal"] | null
          id: string
          is_active: boolean
          level: Database["public"]["Enums"]["sport_level"]
          name: string
          notes: string | null
          split: Database["public"]["Enums"]["program_split"]
          updated_at: string
          user_id: string
          weeks_count: number
        }
        Insert: {
          created_at?: string
          goal?: Database["public"]["Enums"]["secondary_goal"] | null
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["sport_level"]
          name: string
          notes?: string | null
          split: Database["public"]["Enums"]["program_split"]
          updated_at?: string
          user_id: string
          weeks_count?: number
        }
        Update: {
          created_at?: string
          goal?: Database["public"]["Enums"]["secondary_goal"] | null
          id?: string
          is_active?: boolean
          level?: Database["public"]["Enums"]["sport_level"]
          name?: string
          notes?: string | null
          split?: Database["public"]["Enums"]["program_split"]
          updated_at?: string
          user_id?: string
          weeks_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_session_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          pain_flag: boolean
          replaced_program_exercise_id: string | null
          session_id: string
          skipped: boolean
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          notes?: string | null
          order_index: number
          pain_flag?: boolean
          replaced_program_exercise_id?: string | null
          session_id: string
          skipped?: boolean
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          pain_flag?: boolean
          replaced_program_exercise_id?: string | null
          session_id?: string
          skipped?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "workout_session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_exercises_replaced_program_exercise_id_fkey"
            columns: ["replaced_program_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_program_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          perceived_fatigue: number | null
          program_day_id: string | null
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["session_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          perceived_fatigue?: number | null
          program_day_id?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          perceived_fatigue?: number | null
          program_day_id?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "workout_program_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          reps: number | null
          rir: number | null
          rpe: number | null
          session_exercise_id: string
          set_index: number
          set_type: Database["public"]["Enums"]["set_type"]
          weight_kg: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reps?: number | null
          rir?: number | null
          rpe?: number | null
          session_exercise_id: string
          set_index: number
          set_type?: Database["public"]["Enums"]["set_type"]
          weight_kg?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reps?: number | null
          rir?: number | null
          rpe?: number | null
          session_exercise_id?: string
          set_index?: number
          set_type?: Database["public"]["Enums"]["set_type"]
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_session_exercise_id_fkey"
            columns: ["session_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_session_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_conversation: {
        Args: { p_conversation_id: string }
        Returns: boolean
      }
      owns_habit: { Args: { p_habit_id: string }; Returns: boolean }
      owns_meal: { Args: { p_meal_id: string }; Returns: boolean }
      owns_meal_plan: { Args: { p_meal_plan_id: string }; Returns: boolean }
      owns_program_day: { Args: { p_program_day_id: string }; Returns: boolean }
      owns_recipe: { Args: { p_recipe_id: string }; Returns: boolean }
      owns_session: { Args: { p_session_id: string }; Returns: boolean }
      owns_session_exercise: {
        Args: { p_session_exercise_id: string }
        Returns: boolean
      }
      owns_shopping_list: {
        Args: { p_shopping_list_id: string }
        Returns: boolean
      }
      owns_supplement: { Args: { p_supplement_id: string }; Returns: boolean }
      owns_tennis_session: {
        Args: { p_tennis_session_id: string }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      ai_action_status:
        | "proposed"
        | "approved"
        | "rejected"
        | "applied"
        | "reverted"
      ai_action_type:
        | "propose_session"
        | "move_session"
        | "replace_exercise"
        | "adjust_calorie_target"
        | "generate_menu"
        | "generate_shopping_list"
        | "adjust_progression"
        | "create_deload_week"
      calendar_event_type:
        | "strength_session"
        | "tennis_session"
        | "mobility"
        | "cardio"
        | "recovery"
        | "rest"
        | "meal"
        | "meal_prep"
        | "supplement"
        | "weigh_in"
        | "measurement"
        | "progress_photo"
        | "appointment"
        | "custom"
      diet_type: "omnivore" | "vegetarian" | "vegan" | "pescatarian" | "other"
      meal_type:
        | "breakfast"
        | "morning_snack"
        | "lunch"
        | "afternoon_snack"
        | "pre_workout"
        | "post_workout"
        | "dinner"
        | "evening_snack"
      movement_type:
        | "compound"
        | "isolation"
        | "bodyweight"
        | "cardio"
        | "mobility"
      muscle_group:
        | "chest"
        | "back"
        | "shoulders"
        | "biceps"
        | "triceps"
        | "quadriceps"
        | "hamstrings"
        | "glutes"
        | "calves"
        | "abs"
        | "core"
        | "mobility"
        | "cardio"
        | "warmup"
      pain_side: "left" | "right" | "center" | "both"
      primary_goal: "bulk" | "cut" | "recomp" | "maintain"
      program_split:
        | "full_body"
        | "upper_lower"
        | "push_pull_legs"
        | "body_part_split"
        | "custom"
      report_period: "weekly" | "monthly" | "cycle"
      secondary_goal:
        | "strength"
        | "hypertrophy"
        | "endurance"
        | "mobility"
        | "conditioning"
        | "tennis_performance"
        | "injury_prevention"
        | "recovery"
        | "sleep"
      session_status:
        | "planned"
        | "in_progress"
        | "completed"
        | "skipped"
        | "cancelled"
      set_type:
        | "warmup"
        | "working"
        | "superset"
        | "dropset"
        | "circuit"
        | "amrap"
      sex_type: "male" | "female"
      sport_level: "beginner" | "intermediate" | "advanced" | "elite"
      supplement_type:
        | "protein"
        | "creatine"
        | "vitamin_d"
        | "magnesium"
        | "omega3"
        | "electrolytes"
        | "caffeine"
        | "multivitamin"
        | "collagen"
        | "zinc"
        | "iron"
        | "vitamin_b12"
        | "other"
      training_location: "home" | "gym" | "both"
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
      ai_action_status: [
        "proposed",
        "approved",
        "rejected",
        "applied",
        "reverted",
      ],
      ai_action_type: [
        "propose_session",
        "move_session",
        "replace_exercise",
        "adjust_calorie_target",
        "generate_menu",
        "generate_shopping_list",
        "adjust_progression",
        "create_deload_week",
      ],
      calendar_event_type: [
        "strength_session",
        "tennis_session",
        "mobility",
        "cardio",
        "recovery",
        "rest",
        "meal",
        "meal_prep",
        "supplement",
        "weigh_in",
        "measurement",
        "progress_photo",
        "appointment",
        "custom",
      ],
      diet_type: ["omnivore", "vegetarian", "vegan", "pescatarian", "other"],
      meal_type: [
        "breakfast",
        "morning_snack",
        "lunch",
        "afternoon_snack",
        "pre_workout",
        "post_workout",
        "dinner",
        "evening_snack",
      ],
      movement_type: [
        "compound",
        "isolation",
        "bodyweight",
        "cardio",
        "mobility",
      ],
      muscle_group: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "abs",
        "core",
        "mobility",
        "cardio",
        "warmup",
      ],
      pain_side: ["left", "right", "center", "both"],
      primary_goal: ["bulk", "cut", "recomp", "maintain"],
      program_split: [
        "full_body",
        "upper_lower",
        "push_pull_legs",
        "body_part_split",
        "custom",
      ],
      report_period: ["weekly", "monthly", "cycle"],
      secondary_goal: [
        "strength",
        "hypertrophy",
        "endurance",
        "mobility",
        "conditioning",
        "tennis_performance",
        "injury_prevention",
        "recovery",
        "sleep",
      ],
      session_status: [
        "planned",
        "in_progress",
        "completed",
        "skipped",
        "cancelled",
      ],
      set_type: [
        "warmup",
        "working",
        "superset",
        "dropset",
        "circuit",
        "amrap",
      ],
      sex_type: ["male", "female"],
      sport_level: ["beginner", "intermediate", "advanced", "elite"],
      supplement_type: [
        "protein",
        "creatine",
        "vitamin_d",
        "magnesium",
        "omega3",
        "electrolytes",
        "caffeine",
        "multivitamin",
        "collagen",
        "zinc",
        "iron",
        "vitamin_b12",
        "other",
      ],
      training_location: ["home", "gym", "both"],
    },
  },
} as const

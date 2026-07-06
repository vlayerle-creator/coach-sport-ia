import { z } from "zod";

export const nutritionTargetsSchema = z.object({
  calories_kcal: z.coerce.number().int().min(500).max(10000),
  protein_g: z.coerce.number().int().min(0).max(500),
  carbs_g: z.coerce.number().int().min(0).max(1000),
  fat_g: z.coerce.number().int().min(0).max(500),
  fiber_g: z.coerce.number().int().min(0).max(100).optional(),
  water_ml: z.coerce.number().int().min(0).max(10000).optional(),
});

export const addMealItemSchema = z.object({
  meal_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  meal_type: z.enum(["breakfast", "morning_snack", "lunch", "afternoon_snack", "pre_workout", "post_workout", "dinner", "evening_snack"]),
  food_item_id: z.string().uuid(),
  quantity_g: z.coerce.number().min(1).max(5000),
});

export const createFoodItemSchema = z.object({
  name: z.string().min(1, "Nom requis").max(200),
  brand: z.string().optional(),
  serving_size_g: z.coerce.number().min(1).optional(),
  calories_kcal_per_100g: z.coerce.number().min(0),
  protein_g_per_100g: z.coerce.number().min(0),
  carbs_g_per_100g: z.coerce.number().min(0),
  fat_g_per_100g: z.coerce.number().min(0),
  fiber_g_per_100g: z.coerce.number().min(0).optional(),
});

export type NutritionTargetsInput = z.infer<typeof nutritionTargetsSchema>;
export type AddMealItemInput = z.infer<typeof addMealItemSchema>;
export type CreateFoodItemInput = z.infer<typeof createFoodItemSchema>;

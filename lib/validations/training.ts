import { z } from "zod";

export const createProgramSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100),
  split: z.enum(["full_body", "upper_lower", "push_pull_legs", "body_part_split", "custom"]),
  goal: z.enum(["strength", "hypertrophy", "endurance", "mobility", "conditioning", "tennis_performance", "injury_prevention", "recovery", "sleep"]).optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "elite"]),
  weeks_count: z.coerce.number().int().min(1).max(52).default(4),
  notes: z.string().optional(),
});

export const createProgramDaySchema = z.object({
  program_id: z.string().uuid(),
  day_index: z.coerce.number().int().min(0).max(6),
  name: z.string().min(1, "Nom requis").max(100),
  notes: z.string().optional(),
});

export const addExerciseToDaySchema = z.object({
  program_day_id: z.string().uuid(),
  exercise_id: z.string().uuid(),
  order_index: z.coerce.number().int().min(0).default(0),
  target_sets: z.coerce.number().int().min(1).max(20).default(3),
  target_reps_min: z.coerce.number().int().min(1).optional(),
  target_reps_max: z.coerce.number().int().min(1).optional(),
  rest_seconds: z.coerce.number().int().min(0).default(90),
  notes: z.string().optional(),
});

export const logSetSchema = z.object({
  session_exercise_id: z.string().uuid(),
  set_index: z.coerce.number().int().min(0),
  weight_kg: z.coerce.number().min(0).optional(),
  reps: z.coerce.number().int().min(0).optional(),
  rpe: z.coerce.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

export const completeSessionSchema = z.object({
  session_id: z.string().uuid(),
  perceived_fatigue: z.coerce.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type CreateProgramDayInput = z.infer<typeof createProgramDaySchema>;
export type AddExerciseToDayInput = z.infer<typeof addExerciseToDaySchema>;
export type LogSetInput = z.infer<typeof logSetSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;

import { z } from "zod";

export const onboardingProfileSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").max(60),
  birthDate: z.string().min(1, "Date de naissance requise"),
  sex: z.enum(["male", "female"]),
  heightCm: z.coerce.number().min(100).max(250),
  currentWeightKg: z.coerce.number().min(30).max(300),
  targetWeightKg: z.coerce.number().min(30).max(300).optional(),
});
export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;

export const onboardingLevelSchema = z.object({
  sportLevel: z.enum(["beginner", "intermediate", "advanced", "elite"]),
  strengthTrainingYears: z.coerce.number().min(0).max(60).optional(),
  tennisLevel: z.string().optional(),
  currentWeeklyFrequency: z.coerce.number().min(0).max(14),
  desiredWeeklyFrequency: z.coerce.number().min(0).max(14),
  availableDays: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])).min(1),
  maxSessionMinutes: z.coerce.number().min(10).max(240),
  trainingLocation: z.enum(["home", "gym", "both"]),
  availableEquipment: z.array(z.string()).default([]),
});
export type OnboardingLevelInput = z.infer<typeof onboardingLevelSchema>;

export const onboardingGoalsSchema = z.object({
  primaryGoal: z.enum(["bulk", "cut", "recomp", "maintain"]),
  secondaryGoals: z
    .array(
      z.enum([
        "strength", "hypertrophy", "endurance", "mobility", "conditioning",
        "tennis_performance", "injury_prevention", "recovery", "sleep",
      ]),
    )
    .default([]),
  targetDate: z.string().optional(),
});
export type OnboardingGoalsInput = z.infer<typeof onboardingGoalsSchema>;

export const onboardingHealthSchema = z.object({
  pastInjuries: z.string().optional(),
  currentPain: z.string().optional(),
  jointLimitations: z.string().optional(),
  acuteWarningFlags: z
    .array(
      z.enum([
        "acute_pain", "recent_injury", "dizziness", "chest_pain",
        "abnormal_fatigue", "rapid_weight_loss", "disordered_eating_concern",
      ]),
    )
    .default([]),
});
export type OnboardingHealthInput = z.infer<typeof onboardingHealthSchema>;

export const onboardingNutritionSchema = z.object({
  dietType: z.enum(["omnivore", "vegetarian", "vegan", "pescatarian", "other"]),
  allergies: z.array(z.string()).default([]),
  intolerances: z.array(z.string()).default([]),
  refusedFoods: z.array(z.string()).default([]),
  preferredMealsCount: z.coerce.number().min(1).max(8),
  cookingBudgetLevel: z.enum(["low", "medium", "high"]),
  cookingTimeMinutes: z.coerce.number().min(5).max(180),
});
export type OnboardingNutritionInput = z.infer<typeof onboardingNutritionSchema>;

export const onboardingLifestyleSchema = z.object({
  averageSleepQuality: z.coerce.number().min(1).max(5),
  averageStress: z.coerce.number().min(1).max(5),
  averageEnergy: z.coerce.number().min(1).max(5),
  currentSupplements: z.array(z.string()).default([]),
  declaredTreatments: z.string().optional(),
  voluntaryHealthNotes: z.string().optional(),
});
export type OnboardingLifestyleInput = z.infer<typeof onboardingLifestyleSchema>;

export const onboardingSchema = onboardingProfileSchema
  .merge(onboardingLevelSchema)
  .merge(onboardingGoalsSchema)
  .merge(onboardingHealthSchema)
  .merge(onboardingNutritionSchema)
  .merge(onboardingLifestyleSchema);
export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const ONBOARDING_STEPS = [
  "profile",
  "level",
  "goals",
  "health",
  "nutrition",
  "lifestyle",
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

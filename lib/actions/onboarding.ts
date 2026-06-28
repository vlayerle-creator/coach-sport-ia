"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/onboarding";

type ActionResult = { error?: string };

const KNOWN_SUPPLEMENT_TYPES = [
  "protein", "creatine", "vitamin_d", "magnesium", "omega3", "electrolytes",
  "caffeine", "multivitamin", "collagen", "zinc", "iron", "vitamin_b12",
] as const;

function guessSupplementType(name: string) {
  const normalized = name.trim().toLowerCase();
  return (
    KNOWN_SUPPLEMENT_TYPES.find((type) => normalized.includes(type.replace("_", " "))) ??
    "other"
  );
}

export async function completeOnboarding(input: OnboardingInput): Promise<ActionResult> {
  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Certaines réponses sont invalides, vérifie le formulaire." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { error: "Session expirée, reconnecte-toi." };
  }
  const userId = userData.user.id;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: data.firstName,
      birth_date: data.birthDate,
      sex: data.sex,
      height_cm: data.heightCm,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (profileError) return { error: "Impossible d'enregistrer le profil." };

  const { error: settingsError } = await supabase
    .from("user_settings")
    .update({
      diet_type: data.dietType,
      allergies: data.allergies,
      intolerances: data.intolerances,
      refused_foods: data.refusedFoods,
      preferred_meals_count: data.preferredMealsCount,
      cooking_budget_level: data.cookingBudgetLevel,
      cooking_time_minutes: data.cookingTimeMinutes,
      past_injuries: data.pastInjuries,
      joint_limitations: data.jointLimitations,
      declared_treatments: data.declaredTreatments,
      voluntary_health_notes: data.voluntaryHealthNotes,
      average_sleep_quality: data.averageSleepQuality,
      average_stress: data.averageStress,
      average_energy: data.averageEnergy,
    })
    .eq("user_id", userId);
  if (settingsError) return { error: "Impossible d'enregistrer les préférences." };

  const { error: goalsError } = await supabase.from("goals").insert({
    user_id: userId,
    primary_goal: data.primaryGoal,
    secondary_goals: data.secondaryGoals,
    target_weight_kg: data.targetWeightKg ?? null,
    target_date: data.targetDate || null,
    sport_level: data.sportLevel,
    tennis_level: data.tennisLevel || null,
    weekly_sessions_target: data.desiredWeeklyFrequency,
    training_location: data.trainingLocation,
    available_equipment: data.availableEquipment,
    max_session_minutes: data.maxSessionMinutes,
  });
  if (goalsError) return { error: "Impossible d'enregistrer les objectifs." };

  const { error: measurementError } = await supabase.from("body_measurements").insert({
    user_id: userId,
    weight_kg: data.currentWeightKg,
    notes: "Première pesée — onboarding",
  });
  if (measurementError) return { error: "Impossible d'enregistrer le poids initial." };

  if (data.currentPain) {
    await supabase.from("pain_logs").insert({
      user_id: userId,
      body_zone: "non précisé",
      intensity: 5,
      notes: data.currentPain,
    });
  }

  if (data.currentSupplements.length > 0) {
    await supabase.from("supplements").insert(
      data.currentSupplements
        .filter((name) => name.trim().length > 0)
        .map((name) => ({
          user_id: userId,
          name,
          type: guessSupplementType(name),
        })),
    );
  }

  if (data.acuteWarningFlags.length > 0) {
    await supabase.from("notifications").insert({
      user_id: userId,
      category: "safety",
      title: "Signal de sécurité détecté",
      body:
        "Tu as signalé un ou plusieurs symptômes nécessitant de la prudence. " +
        "L'application n'est pas un professionnel de santé : consulte un médecin si ces " +
        "signaux persistent ou s'aggravent.",
    });
  }

  redirect("/dashboard");
}

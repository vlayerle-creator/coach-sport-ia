"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createProgramSchema,
  createProgramDaySchema,
  addExerciseToDaySchema,
  logSetSchema,
  completeSessionSchema,
} from "@/lib/validations/training";

export async function createProgram(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = createProgramSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data, error } = await supabase
    .from("workout_programs")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/training");
  redirect(`/training/programs/${data.id}`);
}

export async function createProgramDay(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = createProgramDaySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("workout_program_days")
    .insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath(`/training/programs/${parsed.data.program_id}`);
  return { success: true };
}

export async function addExerciseToDay(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = addExerciseToDaySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: existing } = await supabase
    .from("workout_program_exercises")
    .select("order_index")
    .eq("program_day_id", parsed.data.program_day_id)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const order_index = existing ? existing.order_index + 1 : 0;

  const { error } = await supabase
    .from("workout_program_exercises")
    .insert({ ...parsed.data, order_index });

  if (error) return { error: error.message };

  revalidatePath("/training/programs");
  return { success: true };
}

export async function reorderProgramExercises(updates: { id: string; order_index: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  await Promise.all(
    updates.map(({ id, order_index }) =>
      supabase
        .from("workout_program_exercises")
        .update({ order_index })
        .eq("id", id)
    )
  );

  revalidatePath("/training/programs");
  return { success: true };
}

export async function removeProgramExercise(program_exercise_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  await supabase
    .from("workout_program_exercises")
    .delete()
    .eq("id", program_exercise_id);

  revalidatePath("/training/programs");
  return { success: true };
}

export async function replaceProgramExercise(program_exercise_id: string, new_exercise_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("workout_program_exercises")
    .update({ exercise_id: new_exercise_id })
    .eq("id", program_exercise_id);

  if (error) return { error: error.message };

  revalidatePath("/training/programs");
  return { success: true };
}

export async function startSession(program_day_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Mark any existing in_progress sessions as completed (abandoned)
  await supabase
    .from("workout_sessions")
    .update({ status: "completed" })
    .eq("user_id", user.id)
    .eq("status", "in_progress");

  const { data: session, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: user.id,
      program_day_id,
      status: "in_progress",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (sessionError || !session) redirect("/training");

  const { data: programExercises } = await supabase
    .from("workout_program_exercises")
    .select("id, exercise_id, order_index")
    .eq("program_day_id", program_day_id)
    .order("order_index");

  if (programExercises && programExercises.length > 0) {
    await supabase.from("workout_session_exercises").insert(
      programExercises.map((pe) => ({
        session_id: session.id,
        exercise_id: pe.exercise_id,
        order_index: pe.order_index,
        replaced_program_exercise_id: pe.id,
      }))
    );
  }

  redirect(`/training/sessions/${session.id}`);
}

export async function logSet(data: {
  session_exercise_id: string;
  set_index: number;
  weight_kg?: number;
  reps?: number;
  rpe?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const parsed = logSetSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: inserted, error } = await supabase
    .from("workout_sets")
    .insert({ ...parsed.data, completed_at: new Date().toISOString() })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (parsed.data.weight_kg && parsed.data.reps) {
    const { data: sessionExercise } = await supabase
      .from("workout_session_exercises")
      .select("exercise_id")
      .eq("id", parsed.data.session_exercise_id)
      .single();

    if (sessionExercise) {
      const estimated1rm = parsed.data.weight_kg * (1 + parsed.data.reps / 30);
      const { data: currentPr } = await supabase
        .from("personal_records")
        .select("value")
        .eq("user_id", user.id)
        .eq("exercise_id", sessionExercise.exercise_id)
        .eq("record_type", "1rm_estimated")
        .order("value", { ascending: false })
        .limit(1)
        .single();

      if (!currentPr || estimated1rm > currentPr.value) {
        await supabase.from("personal_records").insert({
          user_id: user.id,
          exercise_id: sessionExercise.exercise_id,
          record_type: "1rm_estimated",
          value: Math.round(estimated1rm * 10) / 10,
          workout_set_id: inserted?.id,
        });
      }
    }
  }

  return { success: true };
}

export async function completeSession(data: {
  session_id: string;
  perceived_fatigue?: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const parsed = completeSessionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("workout_sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      perceived_fatigue: parsed.data.perceived_fatigue,
      notes: parsed.data.notes,
    })
    .eq("id", parsed.data.session_id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/training");
  revalidatePath("/dashboard");
  redirect("/training");
}

export async function deleteProgram(_: FormData, program_id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("workout_programs")
    .delete()
    .eq("id", program_id)
    .eq("user_id", user.id);

  revalidatePath("/training");
  redirect("/training");
}

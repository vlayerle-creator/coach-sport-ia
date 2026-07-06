"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveCheckin(data: {
  sleep_quality?: number;
  sleep_hours?: number;
  energy?: number;
  motivation?: number;
  stress?: number;
  soreness?: number;
  mood?: number;
  fatigue?: number;
  training_motivation?: number;
  resting_heart_rate?: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const today = new Date().toISOString().split("T")[0];

  // Compute readiness score (0-100)
  const scores = [
    data.sleep_quality ? (data.sleep_quality / 5) * 100 : null,
    data.energy ? (data.energy / 5) * 100 : null,
    data.fatigue ? ((6 - data.fatigue) / 5) * 100 : null,     // inverted
    data.soreness ? ((6 - data.soreness) / 5) * 100 : null,   // inverted
    data.stress ? ((6 - data.stress) / 5) * 100 : null,       // inverted
    data.motivation ? (data.motivation / 5) * 100 : null,
  ].filter(Boolean) as number[];

  const readiness_score = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  const { error } = await supabase.from("daily_checkins").upsert(
    { user_id: user.id, checkin_date: today, ...data, readiness_score },
    { onConflict: "user_id,checkin_date" }
  );

  if (error) return { error: error.message };
  revalidatePath("/recovery");
  return { success: true, readiness_score };
}

export async function addPainLog(data: {
  body_zone: string;
  side?: "left" | "right" | "both" | "center";
  intensity: number;
  pain_type?: string;
  trigger_movement?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("pain_logs").insert({
    user_id: user.id,
    started_on: new Date().toISOString().split("T")[0],
    ...data,
  });

  if (error) return { error: error.message };
  revalidatePath("/recovery");
  return { success: true };
}

export async function resolvePainLog(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("pain_logs")
    .update({ resolved_on: new Date().toISOString().split("T")[0] })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/recovery");
  return { success: true };
}

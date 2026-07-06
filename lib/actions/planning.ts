"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addPlannedSession(program_day_id: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase.from("workout_sessions").insert({
    user_id: user.id,
    program_day_id,
    scheduled_at: `${date}T10:00:00`,
    started_at: `${date}T10:00:00`,
  });

  if (error) return { error: error.message };
  revalidatePath("/planning");
  return { success: true };
}

export async function deletePlannedSession(session_id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("workout_sessions")
    .delete()
    .eq("id", session_id)
    .eq("user_id", user.id)
    .eq("status", "planned");

  if (error) return { error: error.message };
  revalidatePath("/planning");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveMeasurement(data: Record<string, number>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const today = new Date().toISOString().split("T")[0];

  // Check if a measurement already exists today
  const { data: existing } = await supabase
    .from("body_measurements")
    .select("id")
    .eq("user_id", user.id)
    .eq("measured_at", today)
    .single();

  const { error } = existing
    ? await supabase.from("body_measurements").update(data as any).eq("id", existing.id)
    : await supabase.from("body_measurements").insert({ user_id: user.id, measured_at: today, ...(data as any) });

  if (error) return { error: error.message };

  revalidatePath("/progress");
  return { success: true };
}

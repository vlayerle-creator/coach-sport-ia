import { createClient } from "@/lib/supabase/server";
import { WeightChart } from "@/components/progress/weight-chart";
import { MeasurementsSummary } from "@/components/progress/measurements-summary";
import { PRList } from "@/components/progress/pr-list";
import { AddMeasurementDialog } from "@/components/progress/add-measurement-dialog";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: measurements },
    { data: prs },
    { data: goal },
  ] = await Promise.all([
    supabase
      .from("body_measurements")
      .select("measured_at, weight_kg, body_fat_pct, neck_cm, shoulders_cm, chest_cm, waist_cm, hips_cm, arm_left_cm, arm_right_cm, thigh_left_cm, thigh_right_cm, calf_left_cm, calf_right_cm, muscle_mass_kg")
      .eq("user_id", user!.id)
      .order("measured_at", { ascending: true })
      .limit(60),
    supabase
      .from("personal_records")
      .select("id, record_type, value, achieved_at, exercises(name, primary_muscle)")
      .eq("user_id", user!.id)
      .eq("record_type", "max_weight")
      .order("achieved_at", { ascending: false })
      .limit(50),
    supabase
      .from("goals")
      .select("target_weight_kg")
      .eq("user_id", user!.id)
      .eq("is_active", true)
      .single(),
  ]);

  const latest = measurements?.[measurements.length - 1] ?? null;
  const previous = measurements?.[measurements.length - 2] ?? null;

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progrès</h1>
        <AddMeasurementDialog />
      </div>

      <WeightChart
        measurements={measurements ?? []}
        targetWeight={goal?.target_weight_kg ?? null}
      />

      <MeasurementsSummary latest={latest} previous={previous} />

      <PRList prs={prs ?? []} />
    </div>
  );
}

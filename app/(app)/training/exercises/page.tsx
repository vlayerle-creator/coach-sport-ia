import { createClient } from "@/lib/supabase/server";
import { ExerciseLibraryClient } from "./exercise-library-client";

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name, primary_muscle, secondary_muscles, movement_type, equipment, level, instructions, is_unilateral")
    .order("primary_muscle, name");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bibliothèque d'exercices</h1>
      <ExerciseLibraryClient exercises={exercises ?? []} />
    </div>
  );
}

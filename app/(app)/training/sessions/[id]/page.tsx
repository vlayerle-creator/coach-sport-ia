import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { SessionLogger } from "./session-logger";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: session } = await supabase
    .from("workout_sessions")
    .select(`
      id, status, started_at,
      workout_program_days (name),
      workout_session_exercises (
        id, order_index, skipped,
        exercises (name, primary_muscle),
        replaced_program_exercise_id
      )
    `)
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!session) notFound();
  if (session.status === "completed") redirect("/training");

  const sessionExercises = (session.workout_session_exercises ?? []).sort(
    (a: any, b: any) => a.order_index - b.order_index
  );

  const programExerciseIds = sessionExercises
    .map((se: any) => se.replaced_program_exercise_id)
    .filter(Boolean);

  let programExercisesMap: Record<string, any> = {};
  if (programExerciseIds.length > 0) {
    const { data: programExercises } = await supabase
      .from("workout_program_exercises")
      .select("id, target_sets, target_reps_min, target_reps_max, rest_seconds")
      .in("id", programExerciseIds);

    programExercisesMap = Object.fromEntries((programExercises ?? []).map((pe) => [pe.id, pe]));
  }

  const enrichedExercises = sessionExercises.map((se: any) => ({
    ...se,
    program_exercise: se.replaced_program_exercise_id
      ? programExercisesMap[se.replaced_program_exercise_id]
      : null,
  }));

  const dayName = (session as any).workout_program_days?.name ?? "Séance libre";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/training" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold">{dayName}</h1>
          <p className="text-xs text-muted-foreground">
            Démarrée {session.started_at ? new Date(session.started_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}
          </p>
        </div>
      </div>

      <SessionLogger session_id={session.id} session_exercises={enrichedExercises} />
    </div>
  );
}

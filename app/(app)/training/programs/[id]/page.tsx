import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { startSession, deleteProgram } from "@/lib/actions/training";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { AddDayForm } from "./add-day-form";
import { AddExerciseDialog } from "./add-exercise-dialog";
import { SortableExercises } from "./sortable-exercises";

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules", biceps: "Biceps",
  triceps: "Triceps", quadriceps: "Quadriceps", hamstrings: "Ischio",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdos", core: "Core",
  mobility: "Mobilité", cardio: "Cardio", warmup: "Échauffement",
};

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: program }, { data: exercises }] = await Promise.all([
    supabase
      .from("workout_programs")
      .select(`
        id, name, split, level, weeks_count, is_active, notes,
        workout_program_days (
          id, day_index, name, notes,
          workout_program_exercises (
            id, order_index, target_sets, target_reps_min, target_reps_max, rest_seconds, notes,
            exercises (id, name, primary_muscle, movement_type, equipment, is_unilateral)
          )
        )
      `)
      .eq("id", id)
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("exercises")
      .select("id, name, primary_muscle, movement_type, equipment, is_unilateral")
      .order("name"),
  ]);

  if (!program) notFound();

  const days = (program.workout_program_days ?? []).sort((a: any, b: any) => a.day_index - b.day_index);

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center gap-2">
        <Link href="/training" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold flex-1 truncate">{program.name}</h1>
        <form action={deleteProgram.bind(null, new FormData(), program.id)}>
          <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{program.split}</Badge>
        <Badge variant="outline">{program.level}</Badge>
        <Badge variant="outline">{program.weeks_count} semaines</Badge>
        {program.is_active && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Actif</Badge>}
      </div>

      {program.notes && <p className="text-sm text-muted-foreground">{program.notes}</p>}

      <Separator />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Jours ({days.length})</h2>
        <AddDayForm program_id={program.id} next_day_index={days.length} />
      </div>

      {days.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Aucun jour configuré. Ajoutez un jour pour commencer.
        </p>
      )}

      <div className="space-y-4">
        {days.map((day: any) => {
          const dayExercises = (day.workout_program_exercises ?? []).sort((a: any, b: any) => a.order_index - b.order_index);
          return (
            <Card key={day.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{day.name}</CardTitle>
                  <form action={startSession.bind(null, day.id)}>
                    <Button size="sm" type="submit" disabled={dayExercises.length === 0}>
                      <Play className="h-3.5 w-3.5 mr-1" /> Démarrer
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <SortableExercises initialExercises={dayExercises} allExercises={exercises ?? []} />
                <div className="pt-1">
                  <AddExerciseDialog program_day_id={day.id} exercises={exercises ?? []} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

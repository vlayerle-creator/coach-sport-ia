"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { ChevronUp, ChevronDown } from "lucide-react";
import { reorderProgramExercises } from "@/lib/actions/training";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RemoveExerciseButton, ReplaceExerciseDialog } from "./exercise-actions";

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules", biceps: "Biceps",
  triceps: "Triceps", quadriceps: "Quadriceps", hamstrings: "Ischio",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdos", core: "Core",
  mobility: "Mobilité", cardio: "Cardio", warmup: "Échauffement",
};

interface ProgramExercise {
  id: string;
  order_index: number;
  target_sets: number;
  target_reps_min: number | null;
  target_reps_max: number | null;
  rest_seconds: number | null;
  exercises: { name: string; primary_muscle: string } | null;
}

interface Exercise {
  id: string;
  name: string;
  primary_muscle: string;
  movement_type: string;
  equipment: string[];
  is_unilateral: boolean;
}

interface SortableExercisesProps {
  initialExercises: ProgramExercise[];
  allExercises: Exercise[];
}

export function SortableExercises({ initialExercises, allExercises }: SortableExercisesProps) {
  const [items, setItems] = useState(initialExercises);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialExercises);
  }, [initialExercises]);

  function move(index: number, direction: -1 | 1) {
    const newItems = [...items];
    const target = index + direction;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    const reindexed = newItems.map((item, i) => ({ ...item, order_index: i }));
    setItems(reindexed);
    startTransition(async () => {
      const result = await reorderProgramExercises(
        reindexed.map(({ id, order_index }) => ({ id, order_index }))
      );
      if (result?.error) toast.error(result.error);
    });
  }

  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">Aucun exercice.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((pe, i) => (
        <div key={pe.id} className="flex items-start gap-2 text-sm">
          <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground"
              disabled={i === 0 || pending}
              onClick={() => move(i, -1)}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground"
              disabled={i === items.length - 1 || pending}
              onClick={() => move(i, 1)}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>

          <span className="text-muted-foreground w-5 text-right shrink-0 pt-1">{i + 1}.</span>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{pe.exercises?.name}</p>
            <p className="text-xs text-muted-foreground">
              {pe.target_sets} × {pe.target_reps_min ?? "?"}
              {pe.target_reps_max && pe.target_reps_max !== pe.target_reps_min ? `–${pe.target_reps_max}` : ""} reps
              {pe.rest_seconds ? ` · ${pe.rest_seconds}s repos` : ""}
            </p>
          </div>

          <Badge variant="outline" className="text-xs shrink-0">
            {MUSCLE_LABELS[pe.exercises?.primary_muscle ?? ""] ?? pe.exercises?.primary_muscle}
          </Badge>

          <div className="flex items-center gap-0.5 shrink-0">
            <ReplaceExerciseDialog program_exercise_id={pe.id} exercises={allExercises} />
            <RemoveExerciseButton program_exercise_id={pe.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

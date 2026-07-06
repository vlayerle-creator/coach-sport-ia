"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, RefreshCw, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeProgramExercise, replaceProgramExercise } from "@/lib/actions/training";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExerciseCard } from "@/components/training/exercise-card";

interface Exercise {
  id: string;
  name: string;
  primary_muscle: string;
  movement_type: string;
  equipment: string[];
  is_unilateral: boolean;
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules", biceps: "Biceps",
  triceps: "Triceps", quadriceps: "Quadriceps", hamstrings: "Ischio",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdos", core: "Core",
  mobility: "Mobilité", cardio: "Cardio",
};

export function RemoveExerciseButton({ program_exercise_id }: { program_exercise_id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRemove() {
    if (!confirm("Supprimer cet exercice du programme ?")) return;
    startTransition(async () => {
      const result = await removeProgramExercise(program_exercise_id);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Exercice supprimé");
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground hover:text-destructive"
      disabled={pending}
      onClick={handleRemove}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}

export function ReplaceExerciseDialog({
  program_exercise_id,
  exercises,
}: {
  program_exercise_id: string;
  exercises: Exercise[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [pending, startTransition] = useTransition();

  const filtered = exercises.filter((e) => {
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchMuscle = muscle === "all" || e.primary_muscle === muscle;
    return matchQuery && matchMuscle;
  });

  function replace(exercise_id: string) {
    startTransition(async () => {
      const result = await replaceProgramExercise(program_exercise_id, exercise_id);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Exercice remplacé");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-6 w-6 text-muted-foreground hover:text-primary")}>
        <RefreshCw className="h-3.5 w-3.5" />
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Remplacer l'exercice</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button variant={muscle === "all" ? "default" : "outline"} size="sm" onClick={() => setMuscle("all")}>Tous</Button>
            {Object.entries(MUSCLE_LABELS).map(([k, v]) => (
              <Button key={k} variant={muscle === k ? "default" : "outline"} size="sm" onClick={() => setMuscle(k)}>{v}</Button>
            ))}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Aucun résultat</p>}
            {filtered.map((e) => (
              <ExerciseCard
                key={e.id}
                {...e}
                action={
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => replace(e.id)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                }
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { addExerciseToDay } from "@/lib/actions/training";
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

interface AddExerciseDialogProps {
  program_day_id: string;
  exercises: Exercise[];
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules", biceps: "Biceps",
  triceps: "Triceps", quadriceps: "Quadriceps", hamstrings: "Ischio",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdos", core: "Core",
  mobility: "Mobilité", cardio: "Cardio",
};

export function AddExerciseDialog({ program_day_id, exercises }: AddExerciseDialogProps) {
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

  function addExercise(exercise_id: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("program_day_id", program_day_id);
      fd.append("exercise_id", exercise_id);
      const result = await addExerciseToDay(fd);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Exercice ajouté");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter exercice
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Ajouter un exercice</DialogTitle></DialogHeader>
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
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => addExercise(e.id)}>
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

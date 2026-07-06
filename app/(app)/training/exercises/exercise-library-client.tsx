"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/training/exercise-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  id: string;
  name: string;
  primary_muscle: string;
  secondary_muscles: string[];
  movement_type: string;
  equipment: string[];
  level: string;
  instructions: string | null;
  is_unilateral: boolean;
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules", biceps: "Biceps",
  triceps: "Triceps", quadriceps: "Quadriceps", hamstrings: "Ischio",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdos", core: "Core",
  mobility: "Mobilité", cardio: "Cardio",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant", intermediate: "Intermédiaire", advanced: "Avancé", elite: "Élite",
};

export function ExerciseLibraryClient({ exercises }: { exercises: Exercise[] }) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState("all");
  const [selected, setSelected] = useState<Exercise | null>(null);

  const filtered = exercises.filter((e) => {
    const matchQuery = e.name.toLowerCase().includes(query.toLowerCase());
    const matchMuscle = muscle === "all" || e.primary_muscle === muscle;
    return matchQuery && matchMuscle;
  });

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Rechercher un exercice…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <Button variant={muscle === "all" ? "default" : "outline"} size="sm" onClick={() => setMuscle("all")}>Tous</Button>
        {Object.entries(MUSCLE_LABELS).map(([k, v]) => (
          <Button key={k} variant={muscle === k ? "default" : "outline"} size="sm" onClick={() => setMuscle(k)}>{v}</Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} exercice{filtered.length !== 1 ? "s" : ""}</p>

      <div className="space-y-2 pb-24">
        {filtered.map((e) => (
          <ExerciseCard key={e.id} {...e} onClick={(id) => setSelected(exercises.find((x) => x.id === id) ?? null)} />
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{MUSCLE_LABELS[selected.primary_muscle] ?? selected.primary_muscle}</Badge>
                <Badge variant="outline">{selected.movement_type}</Badge>
                <Badge variant="outline">{LEVEL_LABELS[selected.level] ?? selected.level}</Badge>
                {selected.is_unilateral && <Badge variant="outline">Unilatéral</Badge>}
              </div>
              {selected.equipment.length > 0 && selected.equipment[0] !== "" && (
                <p className="text-sm text-muted-foreground">Matériel : {selected.equipment.join(", ")}</p>
              )}
              {selected.secondary_muscles.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Secondaires : {selected.secondary_muscles.map((m) => MUSCLE_LABELS[m] ?? m).join(", ")}
                </p>
              )}
              {selected.instructions && (
                <p className="text-sm leading-relaxed">{selected.instructions}</p>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { CheckCircle2, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { logSet, completeSession } from "@/lib/actions/training";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RestTimer } from "@/components/training/rest-timer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SetLog {
  set_index: number;
  weight_kg: string;
  reps: string;
  done: boolean;
}

interface SessionExercise {
  id: string;
  order_index: number;
  skipped: boolean;
  exercises: {
    name: string;
    primary_muscle: string;
  };
  program_exercise?: {
    target_sets: number;
    target_reps_min: number | null;
    target_reps_max: number | null;
    rest_seconds: number;
  };
}

interface SessionLoggerProps {
  session_id: string;
  session_exercises: SessionExercise[];
}

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules", biceps: "Biceps",
  triceps: "Triceps", quadriceps: "Quadriceps", hamstrings: "Ischio",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdos", core: "Core",
};

export function SessionLogger({ session_id, session_exercises }: SessionLoggerProps) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [sets, setSets] = useState<Record<string, SetLog[]>>(() => {
    const init: Record<string, SetLog[]> = {};
    session_exercises.forEach((se) => {
      const count = se.program_exercise?.target_sets ?? 3;
      init[se.id] = Array.from({ length: count }, (_, i) => ({
        set_index: i,
        weight_kg: "",
        reps: "",
        done: false,
      }));
    });
    return init;
  });
  const [restTimer, setRestTimer] = useState<{ active: boolean; seconds: number }>({ active: false, seconds: 0 });
  const [completing, setCompleting] = useState(false);
  const [fatigue, setFatigue] = useState<number | undefined>();
  const [showComplete, setShowComplete] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const currentExercise = session_exercises[currentExerciseIdx];

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function updateSet(exercise_id: string, set_index: number, field: "weight_kg" | "reps", value: string) {
    setSets((prev) => ({
      ...prev,
      [exercise_id]: prev[exercise_id].map((s) =>
        s.set_index === set_index ? { ...s, [field]: value } : s
      ),
    }));
  }

  async function markSetDone(exercise_id: string, set_index: number) {
    const set = sets[exercise_id]?.[set_index];
    if (!set) return;
    setSaving(`${exercise_id}-${set_index}`);

    const result = await logSet({
      session_exercise_id: exercise_id,
      set_index,
      weight_kg: set.weight_kg ? parseFloat(set.weight_kg) : undefined,
      reps: set.reps ? parseInt(set.reps) : undefined,
    });

    setSaving(null);

    if (result?.error) { toast.error(result.error); return; }

    setSets((prev) => ({
      ...prev,
      [exercise_id]: prev[exercise_id].map((s) =>
        s.set_index === set_index ? { ...s, done: true } : s
      ),
    }));

    // If last set of current exercise, auto-advance
    const allDone = sets[exercise_id].every((s) => s.set_index === set_index ? true : s.done);
    const restSeconds = currentExercise?.program_exercise?.rest_seconds ?? 90;

    if (allDone) {
      setRestTimer({ active: true, seconds: restSeconds });
    } else {
      setRestTimer({ active: true, seconds: restSeconds });
    }
  }

  const onTimerDone = useCallback(() => {
    setRestTimer({ active: false, seconds: 0 });
  }, []);

  async function finishSession() {
    setCompleting(true);
    const result = await completeSession({ session_id, perceived_fatigue: fatigue });
    if (result?.error) { toast.error(result.error); setCompleting(false); }
  }

  const totalSets = session_exercises.reduce((acc, se) => acc + (sets[se.id]?.length ?? 0), 0);
  const doneSets = session_exercises.reduce((acc, se) => acc + (sets[se.id]?.filter((s) => s.done).length ?? 0), 0);
  const progress = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-4 pb-36">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{doneSets} / {totalSets} séries</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Exercises */}
      {session_exercises.map((se, idx) => {
        const isActive = idx === currentExerciseIdx;
        const isOpen = expanded[se.id] !== undefined ? expanded[se.id] : isActive;
        const exerciseSets = sets[se.id] ?? [];
        const allDone = exerciseSets.length > 0 && exerciseSets.every((s) => s.done);

        return (
          <Card key={se.id} className={isActive ? "border-primary" : allDone ? "opacity-60" : ""}>
            <CardHeader className="pb-2 cursor-pointer" onClick={() => { setCurrentExerciseIdx(idx); toggleExpanded(se.id); }}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {allDone && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
                  <CardTitle className="text-sm font-semibold truncate">{se.exercises.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{MUSCLE_LABELS[se.exercises.primary_muscle] ?? se.exercises.primary_muscle}</Badge>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              {se.program_exercise && (
                <p className="text-xs text-muted-foreground">
                  {se.program_exercise.target_sets} × {se.program_exercise.target_reps_min ?? "?"}
                  {se.program_exercise.target_reps_max ? `–${se.program_exercise.target_reps_max}` : ""} reps
                  · {se.program_exercise.rest_seconds}s repos
                </p>
              )}
            </CardHeader>

            {isOpen && (
              <CardContent className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium px-1 mb-1">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">Poids (kg)</span>
                  <span className="col-span-4">Reps</span>
                  <span className="col-span-3 text-right">OK</span>
                </div>
                {exerciseSets.map((s) => (
                  <div key={s.set_index} className={`grid grid-cols-12 gap-2 items-center ${s.done ? "opacity-50" : ""}`}>
                    <span className="col-span-1 text-sm text-muted-foreground">{s.set_index + 1}</span>
                    <Input
                      className="col-span-4 h-8 text-sm"
                      type="number"
                      placeholder="—"
                      value={s.weight_kg}
                      disabled={s.done}
                      onChange={(e) => updateSet(se.id, s.set_index, "weight_kg", e.target.value)}
                    />
                    <Input
                      className="col-span-4 h-8 text-sm"
                      type="number"
                      placeholder="—"
                      value={s.reps}
                      disabled={s.done}
                      onChange={(e) => updateSet(se.id, s.set_index, "reps", e.target.value)}
                    />
                    <div className="col-span-3 flex justify-end">
                      <Button
                        size="sm"
                        variant={s.done ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                        disabled={s.done || saving === `${se.id}-${s.set_index}`}
                        onClick={() => markSetDone(se.id, s.set_index)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {idx < session_exercises.length - 1 && allDone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={() => setCurrentExerciseIdx(idx + 1)}
                  >
                    Exercice suivant →
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Finish button */}
      <Button className="w-full" size="lg" onClick={() => setShowComplete(true)}>
        <Flag className="h-4 w-4 mr-2" /> Terminer la séance
      </Button>

      {/* Rest timer */}
      {restTimer.active && (
        <RestTimer key={restTimer.seconds} seconds={restTimer.seconds} onDone={onTimerDone} />
      )}

      {/* Complete dialog */}
      <Dialog open={showComplete} onOpenChange={setShowComplete}>
        <DialogContent>
          <DialogHeader><DialogTitle>Terminer la séance ?</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {doneSets} série{doneSets > 1 ? "s" : ""} complétée{doneSets > 1 ? "s" : ""} sur {totalSets}.
            </p>
            <div className="space-y-2">
              <Label>Fatigue ressentie</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Button
                    key={n}
                    variant={fatigue === n ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setFatigue(n)}
                  >
                    {n}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">1 = Très facile · 5 = Épuisé</p>
            </div>
            <Button className="w-full" onClick={finishSession} disabled={completing}>
              {completing ? "Enregistrement…" : "Valider la séance"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules",
  biceps: "Biceps", triceps: "Triceps", forearms: "Avant-bras",
  quadriceps: "Quadriceps", hamstrings: "Ischio-jambiers",
  glutes: "Fessiers", calves: "Mollets", abs: "Abdominaux",
  full_body: "Corps entier", cardio: "Cardio",
};

interface PR {
  id: string;
  value: number;
  achieved_at: string;
  exercises: { name: string; primary_muscle: string } | null;
}

export function PRList({ prs }: { prs: PR[] }) {
  if (prs.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">🏆 Records personnels</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 text-sm text-muted-foreground">
          Aucun record enregistré. Lance une séance pour commencer !
        </CardContent>
      </Card>
    );
  }

  // Keep only best per exercise
  const bestPerExercise = new Map<string, PR>();
  for (const pr of prs) {
    const name = pr.exercises?.name ?? "?";
    const existing = bestPerExercise.get(name);
    if (!existing || pr.value > existing.value) {
      bestPerExercise.set(name, pr);
    }
  }

  // Group by muscle
  const byMuscle: Record<string, PR[]> = {};
  for (const pr of bestPerExercise.values()) {
    const mg = pr.exercises?.primary_muscle ?? "other";
    if (!byMuscle[mg]) byMuscle[mg] = [];
    byMuscle[mg].push(pr);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">🏆 Records personnels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(byMuscle).map(([muscle, records]) => (
          <div key={muscle}>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {MUSCLE_LABELS[muscle] ?? muscle}
            </p>
            <div className="space-y-1.5">
              {records
                .sort((a, b) => b.value - a.value)
                .map(pr => (
                  <div key={pr.id} className="flex items-center justify-between">
                    <span className="text-sm">{pr.exercises?.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-bold">
                        {pr.value} kg
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(pr.achieved_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

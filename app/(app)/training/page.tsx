import Link from "next/link";
import { Plus, Play, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgramCard } from "@/components/training/program-card";

export default async function TrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: programs }, { data: inProgress }, { data: recentSessions }] = await Promise.all([
    supabase
      .from("workout_programs")
      .select("id, name, split, level, weeks_count, is_active, workout_program_days(count)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("workout_sessions")
      .select("id, started_at, workout_program_days(name)")
      .eq("user_id", user!.id)
      .eq("status", "in_progress")
      .single(),
    supabase
      .from("workout_sessions")
      .select("id, started_at, completed_at, status, workout_program_days(name)")
      .eq("user_id", user!.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Entraînement</h1>
        <Link href="/training/programs/new" className={cn(buttonVariants({ size: "sm" }))}>
          <Plus className="h-4 w-4 mr-1" /> Programme
        </Link>
      </div>

      {inProgress && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Séance en cours</p>
              <p className="font-semibold">{(inProgress as any).workout_program_days?.name ?? "Séance libre"}</p>
            </div>
            <Link href={`/training/sessions/${inProgress.id}`} className={cn(buttonVariants())}>
              <Play className="h-4 w-4 mr-1" /> Reprendre
            </Link>
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Mes programmes</h2>
          <Link href="/training/programs" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Voir tout
          </Link>
        </div>
        {!programs || programs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground text-sm py-10">
              <p>Aucun programme.</p>
              <Link href="/training/programs/new" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3 inline-flex")}>
                Créer mon premier programme
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {programs.slice(0, 3).map((p) => (
              <ProgramCard
                key={p.id}
                id={p.id}
                name={p.name}
                split={p.split}
                level={p.level}
                weeks_count={p.weeks_count}
                is_active={p.is_active}
                days_count={(p.workout_program_days as any)?.[0]?.count ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold">Séances récentes</h2>
        </div>
        {!recentSessions || recentSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune séance terminée.</p>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <Card key={s.id}>
                <CardContent className="pt-3 pb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{(s as any).workout_program_days?.name ?? "Séance libre"}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.completed_at ? new Date(s.completed_at).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" }) : "—"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-500/30">Terminée</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Link href="/training/exercises" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}>
        Bibliothèque d'exercices
      </Link>
    </div>
  );
}

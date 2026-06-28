import {
  Dumbbell, Trophy, Apple, LineChart, HeartPulse, Bot, ListTodo,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: activeGoal } = await supabase
    .from("goals")
    .select("primary_goal, weekly_sessions_target")
    .eq("user_id", userData.user!.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Aujourd&apos;hui</h1>
        {activeGoal && (
          <p className="text-sm text-muted-foreground">
            Objectif actuel : {GOAL_LABELS[activeGoal.primary_goal]} ·{" "}
            {activeGoal.weekly_sessions_target} séances/semaine visées
          </p>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Score de préparation du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={HeartPulse}
            title="Pas encore de données"
            description="Fais ton check-in du jour pour obtenir une estimation de ta forme."
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Séance prévue aujourd&apos;hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Dumbbell}
              title="Aucune séance planifiée"
              description="Crée un programme pour voir ta séance du jour apparaître ici."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prochain entraînement tennis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Trophy}
              title="Rien de prévu"
              description="Ajoute une séance de tennis depuis le planning."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nutrition du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Apple}
              title="Aucun repas enregistré"
              description="Ajoute ton premier repas pour suivre tes calories et macros."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Évolution du poids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={LineChart}
              title="Pas assez de mesures"
              description="Une courbe apparaîtra après quelques pesées."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Résumé du coach IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Bot}
            title="Ton coach n'a pas encore de résumé"
            description="Reviens après ta première séance et ton premier check-in."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rappels et tâches du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ListTodo}
            title="Aucun rappel"
            description="Configure tes rappels dans Paramètres."
          />
        </CardContent>
      </Card>
    </div>
  );
}

const GOAL_LABELS: Record<string, string> = {
  bulk: "Prise de masse",
  cut: "Sèche",
  recomp: "Recomposition",
  maintain: "Maintien",
};

import { createClient } from "@/lib/supabase/server";
import { CheckinForm } from "@/components/recovery/checkin-form";
import { RecoveryTrends } from "@/components/recovery/recovery-trends";
import { PainTracker } from "@/components/recovery/pain-tracker";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ReadinessRing({ score }: { score: number | null }) {
  if (score === null) return null;

  const color =
    score >= 70 ? "text-green-500" :
    score >= 40 ? "text-amber-500" :
    "text-rose-500";

  const label =
    score >= 70 ? "Prêt à l'effort" :
    score >= 40 ? "Récupération modérée" :
    "Repos recommandé";

  return (
    <Card>
      <CardContent className="py-4 flex items-center gap-5">
        <div className="relative shrink-0 w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="32" fill="none"
              stroke={score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#f43f5e"}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <span className={cn("absolute inset-0 flex items-center justify-center text-xl font-bold", color)}>
            {score}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Score de forme</p>
          <p className={cn("text-lg font-bold", color)}>{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Basé sur ton check-in du jour
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function RecoveryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const [
    { data: todayCheckin },
    { data: checkins },
    { data: painLogs },
  ] = await Promise.all([
    supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", user!.id)
      .eq("checkin_date", today)
      .single(),
    supabase
      .from("daily_checkins")
      .select("checkin_date, sleep_quality, energy, fatigue, soreness, readiness_score")
      .eq("user_id", user!.id)
      .order("checkin_date", { ascending: false })
      .limit(14),
    supabase
      .from("pain_logs")
      .select("*")
      .eq("user_id", user!.id)
      .order("started_on", { ascending: false }),
  ]);

  const alreadyDone = !!todayCheckin;
  const activePains = (painLogs ?? []).filter((p: any) => !p.resolved_on).length;

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Récupération</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        {activePains > 0 && (
          <span className="text-xs bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 px-2.5 py-1 rounded-full font-medium">
            {activePains} douleur{activePains > 1 ? "s" : ""} active{activePains > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {alreadyDone && (todayCheckin as any)?.readiness_score != null && (
        <ReadinessRing score={(todayCheckin as any).readiness_score} />
      )}

      <CheckinForm
        existing={(todayCheckin as any) ?? undefined}
        alreadyDone={alreadyDone}
      />

      {(checkins ?? []).length > 1 && (
        <Card>
          <div className="px-6 pt-5 pb-1">
            <h2 className="text-sm font-semibold">Tendances — 14 derniers jours</h2>
          </div>
          <CardContent className="pt-2">
            <RecoveryTrends checkins={(checkins ?? []) as any[]} />
          </CardContent>
        </Card>
      )}

      <PainTracker painLogs={(painLogs ?? []) as any[]} />
    </div>
  );
}

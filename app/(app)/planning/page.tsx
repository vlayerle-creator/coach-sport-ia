import { createClient } from "@/lib/supabase/server";
import { WeekPlanning } from "@/components/planning/week-planning";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function getWeekBounds(offsetWeeks: number) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + offsetWeeks * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

export default async function PlanningPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const { w } = await searchParams;
  const offset = parseInt(w ?? "0", 10) || 0;
  const { monday, sunday } = getWeekBounds(offset);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { data: sessions },
    { data: programs },
    { data: target },
  ] = await Promise.all([
    supabase
      .from("workout_sessions")
      .select("id, started_at, status, program_day:workout_program_days(name, workout_programs(name))")
      .eq("user_id", user!.id)
      .gte("started_at", monday.toISOString())
      .lte("started_at", sunday.toISOString())
      .order("started_at"),
    supabase
      .from("workout_program_days")
      .select("id, name, program:workout_programs!inner(name, id, user_id, is_active)")
      .eq("workout_programs.user_id", user!.id)
      .eq("workout_programs.is_active", true)
      .order("day_index"),
    supabase
      .from("nutrition_targets")
      .select("calories_kcal, protein_g")
      .eq("user_id", user!.id)
      .order("effective_from", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const mondayLabel = monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const sundayLabel = sunday.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-4 pb-24">
      {/* Header + week nav */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planning</h1>
        <div className="flex items-center gap-1">
          <Link
            href={`/planning?w=${offset - 1}`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link
            href="/planning"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs px-2")}
          >
            Aujourd'hui
          </Link>
          <Link
            href={`/planning?w=${offset + 1}`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <p className="text-sm text-muted-foreground -mt-2">
        {mondayLabel} — {sundayLabel}
      </p>

      <WeekPlanning
        monday={monday.toISOString()}
        sessions={(sessions ?? []) as any[]}
        programs={(programs ?? []) as any[]}
        calorieTarget={target?.calories_kcal ?? null}
        proteinTarget={target?.protein_g ?? null}
        weekOffset={offset}
      />
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { ProgramCard } from "@/components/training/program-card";

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: programs } = await supabase
    .from("workout_programs")
    .select("id, name, split, level, weeks_count, is_active, workout_program_days(count)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes programmes</h1>
        <Link href="/training/programs/new" className={cn(buttonVariants({ size: "sm" }))}>
          <Plus className="h-4 w-4 mr-1" /> Nouveau
        </Link>
      </div>

      {!programs || programs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Aucun programme créé.</p>
          <Link href="/training/programs/new" className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}>
            Créer un programme
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {programs.map((p) => (
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
    </div>
  );
}

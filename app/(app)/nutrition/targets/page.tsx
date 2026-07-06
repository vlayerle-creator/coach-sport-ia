import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NutritionTargetsForm } from "./targets-form";

export default async function NutritionTargetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = new Date().toISOString().split("T")[0];

  const { data: current } = await supabase
    .from("nutrition_targets")
    .select("calories_kcal, protein_g, carbs_g, fat_g, fiber_g, water_ml")
    .eq("user_id", user!.id)
    .lte("effective_from", today)
    .order("effective_from", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/nutrition" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold">Objectifs nutritionnels</h1>
      </div>
      <Card>
        <CardContent className="pt-6">
          <NutritionTargetsForm current={current ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}

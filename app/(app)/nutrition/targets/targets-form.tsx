"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { nutritionTargetsSchema, type NutritionTargetsInput } from "@/lib/validations/nutrition";
import { saveNutritionTargets } from "@/lib/actions/nutrition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = z.input<typeof nutritionTargetsSchema>;

const PRESETS = [
  { label: "Prise de masse", cal: 2800, prot: 180, carbs: 340, fat: 80 },
  { label: "Sèche", cal: 1900, prot: 200, carbs: 160, fat: 65 },
  { label: "Maintien", cal: 2300, prot: 160, carbs: 260, fat: 75 },
];

interface Props {
  current: { calories_kcal: number; protein_g: number; carbs_g: number; fat_g: number; fiber_g: number | null; water_ml: number | null } | null;
}

export function NutritionTargetsForm({ current }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues, unknown, NutritionTargetsInput>({
    resolver: zodResolver(nutritionTargetsSchema),
    defaultValues: current ? {
      calories_kcal: current.calories_kcal as any,
      protein_g: current.protein_g as any,
      carbs_g: current.carbs_g as any,
      fat_g: current.fat_g as any,
      fiber_g: current.fiber_g ?? undefined as any,
      water_ml: current.water_ml ?? undefined as any,
    } : {},
  });

  function applyPreset(preset: typeof PRESETS[0]) {
    setValue("calories_kcal", preset.cal as any);
    setValue("protein_g", preset.prot as any);
    setValue("carbs_g", preset.carbs as any);
    setValue("fat_g", preset.fat as any);
  }

  function onSubmit(values: NutritionTargetsInput) {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v !== undefined && fd.append(k, String(v)));
      const result = await saveNutritionTargets(fd);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Objectifs enregistrés");
      router.push("/nutrition");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wide">Préréglages rapides</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button key={p.label} type="button" variant="outline" size="sm" onClick={() => applyPreset(p)}>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="calories_kcal">Calories (kcal)</Label>
          <Input id="calories_kcal" type="number" {...register("calories_kcal")} />
          {errors.calories_kcal && <p className="text-xs text-destructive">{errors.calories_kcal.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein_g">Protéines (g)</Label>
          <Input id="protein_g" type="number" {...register("protein_g")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbs_g">Glucides (g)</Label>
          <Input id="carbs_g" type="number" {...register("carbs_g")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat_g">Lipides (g)</Label>
          <Input id="fat_g" type="number" {...register("fat_g")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fiber_g">Fibres (g) <span className="text-muted-foreground text-xs">optionnel</span></Label>
          <Input id="fiber_g" type="number" {...register("fiber_g")} />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="water_ml">Eau (ml) <span className="text-muted-foreground text-xs">optionnel</span></Label>
          <Input id="water_ml" type="number" placeholder="2000" {...register("water_ml")} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createProgramSchema, type CreateProgramInput } from "@/lib/validations/training";
import { createProgram } from "@/lib/actions/training";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ProgramFormValues = z.input<typeof createProgramSchema>;

export function ProgramForm() {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProgramFormValues, unknown, CreateProgramInput>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: { weeks_count: 4 as any, level: "beginner", split: "full_body" },
  });

  function onSubmit(values: CreateProgramInput) {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => v !== undefined && fd.append(k, String(v)));
      const result = await createProgram(fd);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du programme</Label>
        <Input id="name" placeholder="Ex: PPL Hypertrophie" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Structure</Label>
        <Select defaultValue="full_body" onValueChange={(v) => setValue("split", v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="full_body">Full Body</SelectItem>
            <SelectItem value="upper_lower">Upper / Lower</SelectItem>
            <SelectItem value="push_pull_legs">Push Pull Legs</SelectItem>
            <SelectItem value="body_part_split">Bro Split</SelectItem>
            <SelectItem value="custom">Personnalisé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Niveau</Label>
        <Select defaultValue="beginner" onValueChange={(v) => setValue("level", v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Débutant</SelectItem>
            <SelectItem value="intermediate">Intermédiaire</SelectItem>
            <SelectItem value="advanced">Avancé</SelectItem>
            <SelectItem value="elite">Élite</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Objectif principal</Label>
        <Select onValueChange={(v) => setValue("goal", v as any)}>
          <SelectTrigger><SelectValue placeholder="Choisir (optionnel)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="strength">Force</SelectItem>
            <SelectItem value="hypertrophy">Hypertrophie</SelectItem>
            <SelectItem value="endurance">Endurance</SelectItem>
            <SelectItem value="conditioning">Conditioning</SelectItem>
            <SelectItem value="mobility">Mobilité</SelectItem>
            <SelectItem value="injury_prevention">Prévention blessures</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="weeks_count">Durée (semaines)</Label>
        <Input id="weeks_count" type="number" min={1} max={52} {...register("weeks_count")} />
        {errors.weeks_count && <p className="text-sm text-destructive">{errors.weeks_count.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Notes optionnelles..." rows={3} {...register("notes")} />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Création..." : "Créer le programme"}
      </Button>
    </form>
  );
}

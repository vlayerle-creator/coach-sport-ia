"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveMeasurement } from "@/lib/actions/progress";

const FIELDS = [
  { key: "weight_kg", label: "Poids (kg)", placeholder: "75.5" },
  { key: "body_fat_pct", label: "Masse grasse (%)", placeholder: "15" },
  { key: "muscle_mass_kg", label: "Masse musculaire (kg)", placeholder: "65" },
  { key: "neck_cm", label: "Tour de cou (cm)", placeholder: "38" },
  { key: "shoulders_cm", label: "Tour d'épaules (cm)", placeholder: "120" },
  { key: "chest_cm", label: "Tour de poitrine (cm)", placeholder: "100" },
  { key: "waist_cm", label: "Tour de taille (cm)", placeholder: "80" },
  { key: "hips_cm", label: "Tour de fesses (cm)", placeholder: "95" },
  { key: "arm_left_cm", label: "Bras gauche (cm)", placeholder: "35" },
  { key: "arm_right_cm", label: "Bras droit (cm)", placeholder: "35" },
  { key: "thigh_left_cm", label: "Cuisse gauche (cm)", placeholder: "55" },
  { key: "thigh_right_cm", label: "Cuisse droite (cm)", placeholder: "55" },
  { key: "calf_left_cm", label: "Mollet gauche (cm)", placeholder: "37" },
  { key: "calf_right_cm", label: "Mollet droit (cm)", placeholder: "37" },
] as const;

export function AddMeasurementDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState<Record<string, string>>({});

  function set(key: string, val: string) {
    setValues(v => ({ ...v, [key]: val }));
  }

  function handleSave() {
    const data: Record<string, number> = {};
    for (const [k, v] of Object.entries(values)) {
      const n = parseFloat(v);
      if (!isNaN(n) && n > 0) data[k] = n;
    }
    if (Object.keys(data).length === 0) {
      toast.error("Remplis au moins une valeur");
      return;
    }
    startTransition(async () => {
      const result = await saveMeasurement(data);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Mesure enregistrée !");
      setOpen(false);
      setValues({});
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: "sm" }))}>
        <Plus className="h-4 w-4 mr-1.5" />
        Ajouter
      </DialogTrigger>

      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle mesure</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                type="number"
                step="0.1"
                placeholder={placeholder}
                value={values[key] ?? ""}
                onChange={e => set(key, e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          ))}

          <Button className="w-full mt-2" disabled={pending} onClick={handleSave}>
            {pending ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Enregistrement…</> : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

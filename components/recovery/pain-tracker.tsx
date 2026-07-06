"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { addPainLog, resolvePainLog } from "@/lib/actions/recovery";
import { cn } from "@/lib/utils";

const BODY_ZONES = [
  "Cou", "Épaule gauche", "Épaule droite", "Biceps gauche", "Biceps droit",
  "Coude gauche", "Coude droit", "Avant-bras gauche", "Avant-bras droit",
  "Poignet gauche", "Poignet droit", "Poitrine", "Dos supérieur",
  "Dos inférieur / Lombaires", "Abdominaux", "Hanche gauche", "Hanche droite",
  "Quadriceps gauche", "Quadriceps droit", "Ischio gauche", "Ischio droit",
  "Genou gauche", "Genou droit", "Mollet gauche", "Mollet droit",
  "Cheville gauche", "Cheville droite",
];

const PAIN_TYPES = [
  "Douleur musculaire", "Douleur articulaire", "Tendinite", "Crampe",
  "Claquage", "Déchirure", "Contusion", "Autre",
];

interface PainLog {
  id: string;
  body_zone: string;
  side?: string | null;
  intensity: number;
  pain_type?: string | null;
  started_on: string;
  resolved_on?: string | null;
  trigger_movement?: string | null;
  notes?: string | null;
}

interface Props { painLogs: PainLog[] }

function intensityColor(n: number) {
  if (n <= 3) return "bg-amber-400";
  if (n <= 6) return "bg-orange-500";
  return "bg-rose-600";
}

function AddPainDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [bodyZone, setBodyZone] = useState("");
  const [painType, setPainType] = useState("");
  const [intensity, setIntensity] = useState<number>(3);
  const [trigger, setTrigger] = useState("");
  const [notes, setNotes] = useState("");

  function handleAdd() {
    if (!bodyZone) { toast.error("Sélectionne une zone"); return; }
    startTransition(async () => {
      const result = await addPainLog({
        body_zone: bodyZone,
        intensity,
        pain_type: painType || undefined,
        trigger_movement: trigger || undefined,
        notes: notes || undefined,
      });
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Douleur enregistrée");
      onClose();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Zone douloureuse *</label>
        <Select value={bodyZone} onValueChange={(v) => setBodyZone(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
          <SelectContent>
            {BODY_ZONES.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Type de douleur</label>
        <Select value={painType} onValueChange={(v) => setPainType(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="Optionnel…" /></SelectTrigger>
          <SelectContent>
            {PAIN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium">Intensité : {intensity}/10</label>
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
            <button
              key={v}
              onClick={() => setIntensity(v)}
              className={cn(
                "flex-1 h-7 rounded text-xs font-semibold transition-all",
                intensity === v
                  ? v <= 3 ? "bg-amber-400 text-white" : v <= 6 ? "bg-orange-500 text-white" : "bg-rose-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted-foreground/20",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Mouvement déclencheur</label>
        <input
          value={trigger}
          onChange={e => setTrigger(e.target.value)}
          className="w-full h-9 rounded-lg border bg-muted/40 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Ex. : Développé couché, squat…"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border bg-muted/40 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Apparue lors de…"
        />
      </div>

      <Button className="w-full" disabled={pending || !bodyZone} onClick={handleAdd}>
        {pending ? "Enregistrement…" : "Ajouter la douleur"}
      </Button>
    </div>
  );
}

export function PainTracker({ painLogs }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const active = painLogs.filter(p => !p.resolved_on);
  const resolved = painLogs.filter(p => p.resolved_on);

  function handleResolve(id: string) {
    startTransition(async () => {
      const result = await resolvePainLog(id);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Marquée comme résolue");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Suivi des douleurs
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 text-xs")}>
            <Plus className="h-3 w-3" /> Ajouter
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Signaler une douleur</DialogTitle>
            </DialogHeader>
            <AddPainDialog onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {active.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-3">
            Aucune douleur active — continue comme ça 💪
          </p>
        )}

        {active.map(p => (
          <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border">
            <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", intensityColor(p.intensity))} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{p.body_zone}</p>
              {p.pain_type && <p className="text-xs text-muted-foreground">{p.pain_type}</p>}
              {p.trigger_movement && (
                <p className="text-xs text-muted-foreground">→ {p.trigger_movement}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                  Intensité {p.intensity}/10
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  Depuis le {new Date(p.started_on).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
            <button
              disabled={pending}
              onClick={() => handleResolve(p.id)}
              title="Marquer comme résolue"
              className="text-muted-foreground hover:text-green-500 transition-colors shrink-0 mt-0.5"
            >
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {resolved.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-muted-foreground cursor-pointer select-none">
              {resolved.length} douleur{resolved.length > 1 ? "s" : ""} résolue{resolved.length > 1 ? "s" : ""}
            </summary>
            <div className="space-y-2 mt-2">
              {resolved.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg opacity-50">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{p.body_zone}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Résolu le {new Date(p.resolved_on!).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

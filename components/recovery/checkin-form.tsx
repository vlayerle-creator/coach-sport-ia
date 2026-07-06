"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveCheckin } from "@/lib/actions/recovery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const METRICS = [
  {
    key: "sleep_quality" as const,
    label: "Qualité du sommeil",
    emoji: "😴",
    low: "Très mauvaise",
    high: "Excellente",
  },
  {
    key: "energy" as const,
    label: "Énergie",
    emoji: "⚡",
    low: "Épuisé",
    high: "Au top",
  },
  {
    key: "motivation" as const,
    label: "Motivation",
    emoji: "🔥",
    low: "Aucune",
    high: "Maximale",
  },
  {
    key: "soreness" as const,
    label: "Courbatures",
    emoji: "💪",
    low: "Aucune",
    high: "Très intenses",
    inverted: true,
  },
  {
    key: "fatigue" as const,
    label: "Fatigue musculaire",
    emoji: "😮‍💨",
    low: "Reposé",
    high: "Exténué",
    inverted: true,
  },
  {
    key: "stress" as const,
    label: "Stress",
    emoji: "🧠",
    low: "Zen",
    high: "Très stressé",
    inverted: true,
  },
];

type CheckinData = {
  sleep_quality?: number;
  energy?: number;
  motivation?: number;
  soreness?: number;
  fatigue?: number;
  stress?: number;
  sleep_hours?: number;
  resting_heart_rate?: number;
  notes?: string;
};

interface Props {
  existing?: CheckinData & { readiness_score?: number | null };
  alreadyDone: boolean;
}

function ScoreButton({ value, selected, onClick, inverted }: {
  value: number;
  selected: boolean;
  onClick: () => void;
  inverted?: boolean;
}) {
  const good = inverted ? value <= 2 : value >= 4;
  const bad = inverted ? value >= 4 : value <= 2;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-9 h-9 rounded-lg text-sm font-semibold transition-all border",
        selected && good && "bg-green-500 text-white border-green-500",
        selected && !good && !bad && "bg-amber-400 text-white border-amber-400",
        selected && bad && "bg-rose-500 text-white border-rose-500",
        !selected && "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
      )}
    >
      {value}
    </button>
  );
}

export function CheckinForm({ existing, alreadyDone }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(!alreadyDone);
  const [values, setValues] = useState<CheckinData>(existing ?? {});

  function set(key: keyof CheckinData, val: number | string) {
    setValues(v => ({ ...v, [key]: val }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await saveCheckin(values);
      if (result?.error) { toast.error(result.error); return; }
      toast.success(`Check-in enregistré · Score : ${result.readiness_score ?? "—"}/100`);
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base">Check-in du jour</CardTitle>
        {alreadyDone && !editing && (
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setEditing(true)}>
            Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {METRICS.map(m => (
          <div key={m.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span>{m.emoji}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-16 shrink-0">{m.low}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(v => (
                  <ScoreButton
                    key={v}
                    value={v}
                    selected={values[m.key] === v}
                    onClick={() => editing && set(m.key, v)}
                    inverted={m.inverted}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground w-16 shrink-0 text-right">{m.high}</span>
            </div>
          </div>
        ))}

        {/* Extras */}
        <div className="grid grid-cols-2 gap-4 pt-1 border-t">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Heures de sommeil</label>
            <input
              type="number"
              min={0} max={24} step={0.5}
              value={values.sleep_hours ?? ""}
              onChange={e => editing && set("sleep_hours", parseFloat(e.target.value))}
              readOnly={!editing}
              className="w-full h-9 rounded-lg border bg-muted/40 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="7.5"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">FC au repos (bpm)</label>
            <input
              type="number"
              min={30} max={200}
              value={values.resting_heart_rate ?? ""}
              onChange={e => editing && set("resting_heart_rate", parseInt(e.target.value))}
              readOnly={!editing}
              className="w-full h-9 rounded-lg border bg-muted/40 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="60"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Notes (optionnel)</label>
          <textarea
            value={values.notes ?? ""}
            onChange={e => editing && set("notes", e.target.value)}
            readOnly={!editing}
            rows={2}
            className="w-full rounded-lg border bg-muted/40 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Nuit agitée, veille de compétition…"
          />
        </div>

        {editing && (
          <Button className="w-full" disabled={pending} onClick={handleSubmit}>
            {pending ? "Enregistrement…" : alreadyDone ? "Mettre à jour" : "Valider le check-in"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

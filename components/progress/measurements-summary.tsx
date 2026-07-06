import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Measurement {
  measured_at: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  neck_cm: number | null;
  shoulders_cm: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  hips_cm: number | null;
  arm_left_cm: number | null;
  arm_right_cm: number | null;
  thigh_left_cm: number | null;
  thigh_right_cm: number | null;
  calf_left_cm: number | null;
  calf_right_cm: number | null;
}

interface Props {
  latest: Measurement | null;
  previous: Measurement | null;
}

const FIELDS: { key: keyof Measurement; label: string; unit: string }[] = [
  { key: "body_fat_pct", label: "Masse grasse", unit: "%" },
  { key: "muscle_mass_kg", label: "Masse musculaire", unit: "kg" },
  { key: "neck_cm", label: "Tour de cou", unit: "cm" },
  { key: "shoulders_cm", label: "Tour d'épaules", unit: "cm" },
  { key: "chest_cm", label: "Tour de poitrine", unit: "cm" },
  { key: "waist_cm", label: "Tour de taille", unit: "cm" },
  { key: "hips_cm", label: "Tour de fesses", unit: "cm" },
  { key: "arm_left_cm", label: "Bras gauche", unit: "cm" },
  { key: "arm_right_cm", label: "Bras droit", unit: "cm" },
  { key: "thigh_left_cm", label: "Cuisse gauche", unit: "cm" },
  { key: "thigh_right_cm", label: "Cuisse droite", unit: "cm" },
  { key: "calf_left_cm", label: "Mollet gauche", unit: "cm" },
  { key: "calf_right_cm", label: "Mollet droit", unit: "cm" },
];

function DiffBadge({ val, prev, unit, lowerIsBetter = false }: { val: number; prev: number; unit: string; lowerIsBetter?: boolean }) {
  const diff = val - prev;
  if (Math.abs(diff) < 0.05) return null;
  const positive = lowerIsBetter ? diff < 0 : diff > 0;
  return (
    <span className={`text-[10px] font-medium ml-1 ${positive ? "text-green-600" : "text-rose-500"}`}>
      {diff > 0 ? "+" : ""}{diff.toFixed(1)}{unit}
    </span>
  );
}

export function MeasurementsSummary({ latest, previous }: Props) {
  if (!latest) return null;

  const fields = FIELDS.filter(f => latest[f.key] != null);
  if (fields.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">📏 Mensurations</CardTitle>
        {latest.measured_at && (
          <p className="text-xs text-muted-foreground">
            Dernière mesure : {new Date(latest.measured_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {fields.map(({ key, label, unit }) => {
            const val = latest[key] as number;
            const prev = previous?.[key] as number | undefined;
            return (
              <div key={key} className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">{label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold">{val}{unit}</span>
                  {prev != null && (
                    <DiffBadge
                      val={val}
                      prev={prev}
                      unit={unit}
                      lowerIsBetter={key === "body_fat_pct" || key === "waist_cm" || key === "hips_cm"}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

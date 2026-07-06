import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Supplement {
  id: string;
  name: string;
  type: string;
  dosage: number | null;
  unit: string | null;
  timing: string | null;
}

const SUPPLEMENT_TIMING: Record<string, { label: string; moment: string; color: string }> = {
  creatine:   { label: "Créatine",     moment: "Post-entraînement ou matin",   color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  whey:       { label: "Whey",         moment: "Dans les 30 min post-entraîn.", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  protein:    { label: "Protéine",     moment: "Post-entraînement ou collation", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  vitamin_d:  { label: "Vitamine D",   moment: "Matin avec repas",             color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  magnesium:  { label: "Magnésium",    moment: "Soir avant coucher",           color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  omega3:     { label: "Oméga-3",      moment: "Avec repas gras (déj. ou dîner)", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
  caffeine:   { label: "Caféine",      moment: "30-60 min avant entraînement", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  multivitamin:{ label: "Multivit.",   moment: "Matin avec le petit-déjeuner", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  collagen:   { label: "Collagène",    moment: "Matin à jeun ou pré-workout",  color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  zinc:       { label: "Zinc",         moment: "Soir à jeun ou avec repas léger", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  iron:       { label: "Fer",          moment: "Matin à jeun avec vitamine C", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  vitamin_b12:{ label: "Vitamine B12", moment: "Matin avec le petit-déjeuner", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  electrolytes:{ label: "Électrolytes","moment": "Pendant / après l'entraînement", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  other:      { label: "Supplément",   moment: "Selon notice",                 color: "bg-muted text-muted-foreground border-border" },
};

export function SupplementSchedule({ supplements }: { supplements: Supplement[] }) {
  if (supplements.length === 0) return null;

  return (
    <div className="space-y-2">
      {supplements.map((s) => {
        const info = SUPPLEMENT_TIMING[s.type] ?? SUPPLEMENT_TIMING.other;
        const customTiming = s.timing ?? info.moment;
        return (
          <div key={s.id} className="flex items-start gap-3">
            <div className="mt-0.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{s.name}</span>
                {s.dosage && <span className="text-xs text-muted-foreground">{s.dosage}{s.unit ?? ""}</span>}
                <Badge className={`text-xs border ${info.color}`}>{info.label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{customTiming}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Poitrine", back: "Dos", shoulders: "Épaules",
  biceps: "Biceps", triceps: "Triceps", quadriceps: "Quadriceps",
  hamstrings: "Ischio", glutes: "Fessiers", calves: "Mollets",
  abs: "Abdos", core: "Core", mobility: "Mobilité", cardio: "Cardio", warmup: "Échauffement",
};

const MOVEMENT_LABELS: Record<string, string> = {
  compound: "Polyarticulaire", isolation: "Isolation",
  bodyweight: "Poids de corps", cardio: "Cardio", mobility: "Mobilité",
};

interface ExerciseCardProps {
  id: string;
  name: string;
  primary_muscle: string;
  movement_type: string;
  equipment: string[];
  is_unilateral: boolean;
  onClick?: (id: string) => void;
  action?: React.ReactNode;
}

export function ExerciseCard({ id, name, primary_muscle, movement_type, equipment, is_unilateral, onClick, action }: ExerciseCardProps) {
  return (
    <Card
      className={onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
      onClick={() => onClick?.(id)}
    >
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="font-medium text-sm leading-tight">{name}</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">{MUSCLE_LABELS[primary_muscle] ?? primary_muscle}</Badge>
              <Badge variant="outline" className="text-xs">{MOVEMENT_LABELS[movement_type] ?? movement_type}</Badge>
              {is_unilateral && <Badge variant="outline" className="text-xs">Unilatéral</Badge>}
              {equipment.length > 0 && equipment[0] !== "" && (
                <Badge variant="outline" className="text-xs capitalize">{equipment[0]}</Badge>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

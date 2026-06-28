import { Dumbbell } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function TrainingPage() {
  return (
    <ComingSoon
      icon={Dumbbell}
      title="Entraînement"
      description="Programmes, séances et progression automatique arrivent en phase 2."
    />
  );
}

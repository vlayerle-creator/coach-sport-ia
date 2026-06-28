import { LineChart } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ProgressPage() {
  return (
    <ComingSoon
      icon={LineChart}
      title="Progrès"
      description="Mesures, photos et graphiques arrivent en phase 3."
    />
  );
}

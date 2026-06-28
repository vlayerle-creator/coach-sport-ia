import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function PlanningPage() {
  return (
    <ComingSoon
      icon={CalendarDays}
      title="Planning"
      description="Le calendrier jour/semaine/mois arrivera en phase 5."
    />
  );
}

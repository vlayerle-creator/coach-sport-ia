import { HeartPulse } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function RecoveryPage() {
  return (
    <ComingSoon
      icon={HeartPulse}
      title="Récupération"
      description="Check-in quotidien et carte de douleurs arrivent en phase 3."
    />
  );
}

import { Trophy } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function TennisPage() {
  return (
    <ComingSoon
      icon={Trophy}
      title="Tennis"
      description="Suivi des séances et statistiques arrivent en phase 5."
    />
  );
}

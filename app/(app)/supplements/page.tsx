import { Pill } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function SupplementsPage() {
  return (
    <ComingSoon
      icon={Pill}
      title="Compléments"
      description="Suivi des prises et alertes arrivent en phase 6."
    />
  );
}

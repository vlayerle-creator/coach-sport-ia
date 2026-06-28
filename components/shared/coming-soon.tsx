import type { LucideIcon } from "lucide-react";
import { EmptyState } from "./empty-state";

export function ComingSoon({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <EmptyState icon={icon} title="Module en construction" description={description} />
    </div>
  );
}

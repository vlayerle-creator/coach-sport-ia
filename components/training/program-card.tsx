import Link from "next/link";
import { Dumbbell, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SPLIT_LABELS: Record<string, string> = {
  full_body: "Full Body",
  upper_lower: "Upper / Lower",
  push_pull_legs: "Push Pull Legs",
  body_part_split: "Bro Split",
  custom: "Personnalisé",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
  elite: "Élite",
};

interface ProgramCardProps {
  id: string;
  name: string;
  split: string;
  level: string;
  weeks_count: number;
  is_active: boolean;
  days_count?: number;
}

export function ProgramCard({ id, name, split, level, weeks_count, is_active, days_count = 0 }: ProgramCardProps) {
  return (
    <Link href={`/training/programs/${id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">{name}</CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">{SPLIT_LABELS[split] ?? split}</Badge>
          <Badge variant="outline">{LEVEL_LABELS[level] ?? level}</Badge>
          <Badge variant="outline">{weeks_count} sem.</Badge>
          <Badge variant="outline">{days_count} jour{days_count > 1 ? "s" : ""}</Badge>
          {is_active && <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Actif</Badge>}
        </CardContent>
      </Card>
    </Link>
  );
}

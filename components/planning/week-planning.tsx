"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Dumbbell, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { addPlannedSession, deletePlannedSession } from "@/lib/actions/planning";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAY_LABELS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

interface Session {
  id: string;
  started_at: string;
  status: string;
  program: { name: string; id: string } | null;
}

interface Program { id: string; name: string }

interface Props {
  monday: string;
  sessions: Session[];
  programs: Program[];
  calorieTarget: number | null;
  proteinTarget: number | null;
  weekOffset: number;
}

function DayCard({
  dayIndex, date, sessions, programs, isToday,
}: {
  dayIndex: number;
  date: Date;
  sessions: Session[];
  programs: Program[];
  isToday: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [pending, startTransition] = useTransition();

  const dateStr = date.toISOString().split("T")[0];
  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

  function handleAdd() {
    if (!selectedProgram) return;
    startTransition(async () => {
      const result = await addPlannedSession(selectedProgram, dateStr);
      if (result?.error) { toast.error(result.error); return; }
      setAdding(false);
      setSelectedProgram("");
      router.refresh();
    });
  }

  function handleDelete(session_id: string) {
    startTransition(async () => {
      const result = await deletePlannedSession(session_id);
      if (result?.error) { toast.error(result.error); return; }
      router.refresh();
    });
  }

  const statusColor: Record<string, string> = {
    completed: "bg-green-500",
    in_progress: "bg-amber-500 animate-pulse",
    planned: "bg-blue-400",
  };

  const statusLabel: Record<string, string> = {
    completed: "Terminée",
    in_progress: "En cours",
    planned: "Planifiée",
  };

  return (
    <div className={cn(
      "border rounded-xl p-3 space-y-2 min-h-[120px] flex flex-col",
      isToday && "border-primary ring-1 ring-primary/30 bg-primary/5",
      isPast && !isToday && "opacity-70",
    )}>
      {/* Day header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-xs font-bold", isToday && "text-primary")}>{DAY_LABELS[dayIndex]}</p>
          <p className="text-[11px] text-muted-foreground">
            {date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
          </p>
        </div>
        {isToday && <Badge className="text-[9px] py-0 px-1.5 h-4">Aujourd'hui</Badge>}
      </div>

      {/* Sessions */}
      <div className="flex-1 space-y-1.5">
        {sessions.map(s => (
          <div key={s.id} className="flex items-center gap-1.5 group">
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusColor[s.status] ?? "bg-gray-400")} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium truncate">{s.program?.name ?? "Séance libre"}</p>
              <p className="text-[10px] text-muted-foreground">{statusLabel[s.status] ?? s.status}</p>
            </div>
            {s.status === "planned" && (
              <button
                onClick={() => handleDelete(s.id)}
                disabled={pending}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-opacity shrink-0"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add session */}
      {!isPast && programs.length > 0 && (
        <div>
          {adding ? (
            <div className="space-y-1.5">
              <Select value={selectedProgram} onValueChange={(v) => setSelectedProgram(v ?? "")}>
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue placeholder="Programme…" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button size="sm" className="flex-1 h-6 text-[10px]" disabled={!selectedProgram || pending} onClick={handleAdd}>
                  Ajouter
                </Button>
                <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setAdding(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-foreground border border-dashed rounded-lg py-1.5 hover:border-primary transition-colors"
            >
              <Plus className="h-3 w-3" />
              Séance
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function WeekPlanning({ monday, sessions, programs, calorieTarget, proteinTarget, weekOffset }: Props) {
  const mondayDate = new Date(monday);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionsByDay = days.map(d => {
    const ds = d.toISOString().split("T")[0];
    return sessions.filter(s => s.started_at.startsWith(ds));
  });

  const totalSessions = sessions.filter(s => s.status === "completed").length;
  const plannedSessions = sessions.filter(s => s.status === "planned").length;

  return (
    <div className="space-y-4">
      {/* Week summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-2xl font-bold text-green-600">{totalSessions}</p>
            <p className="text-[11px] text-muted-foreground">Séances réalisées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-2xl font-bold text-blue-500">{plannedSessions}</p>
            <p className="text-[11px] text-muted-foreground">Planifiées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-2xl font-bold">{7 - totalSessions - plannedSessions}</p>
            <p className="text-[11px] text-muted-foreground">Jours de repos</p>
          </CardContent>
        </Card>
      </div>

      {/* 7-day grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {days.map((date, i) => {
          const isToday = date.getTime() === today.getTime();
          return (
            <DayCard
              key={i}
              dayIndex={i}
              date={date}
              sessions={sessionsByDay[i]}
              programs={programs}
              isToday={isToday}
            />
          );
        })}
      </div>

      {/* Nutrition reminder */}
      {calorieTarget && (
        <Card>
          <CardContent className="py-3 flex items-center gap-3">
            <span className="text-lg">🥗</span>
            <div className="text-xs">
              <span className="font-medium">Objectif nutritionnel cette semaine :</span>
              <span className="text-muted-foreground ml-1">{calorieTarget} kcal/j · {proteinTarget}g protéines/j</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

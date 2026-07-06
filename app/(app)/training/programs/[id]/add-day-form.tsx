"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProgramDay } from "@/lib/actions/training";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const DAY_SUGGESTIONS = ["Jour A", "Jour B", "Push", "Pull", "Legs", "Upper", "Lower", "Full Body"];

interface AddDayFormProps {
  program_id: string;
  next_day_index: number;
}

export function AddDayForm({ program_id, next_day_index }: AddDayFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("program_id", program_id);
      fd.append("day_index", String(next_day_index));
      fd.append("name", name);
      const result = await createProgramDay(fd);
      if (result?.error) { toast.error(result.error); return; }
      toast.success("Jour ajouté");
      setOpen(false);
      setName("");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        <Plus className="h-4 w-4 mr-1" /> Ajouter un jour
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nouveau jour d'entraînement</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Push, Full Body…" />
          </div>
          <div className="flex flex-wrap gap-2">
            {DAY_SUGGESTIONS.map((s) => (
              <Button key={s} variant="outline" size="sm" type="button" onClick={() => setName(s)}>{s}</Button>
            ))}
          </div>
          <Button className="w-full" onClick={submit} disabled={pending || !name.trim()}>
            {pending ? "Ajout..." : "Ajouter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

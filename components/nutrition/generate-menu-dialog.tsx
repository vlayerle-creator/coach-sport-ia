"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generateAndSaveMenu } from "@/lib/actions/menu";

const DAY_OPTIONS = [
  { value: 1, label: "1 jour" },
  { value: 3, label: "3 jours" },
  { value: 7, label: "1 semaine" },
  { value: 14, label: "2 semaines" },
];

export function GenerateMenuDialog({ hasTarget }: { hasTarget: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [days, setDays] = useState(1);
  const [exclusions, setExclusions] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [styleNotes, setStyleNotes] = useState("");

  function handleGenerate() {
    startTransition(async () => {
      try {
        const result = await generateAndSaveMenu({
          days,
          extra_exclusions: exclusions || undefined,
          extra_inclusions: inclusions || undefined,
          style_notes: styleNotes || undefined,
        });
        if (!result) { toast.error("Aucune réponse du serveur"); return; }
        if (result.error) { toast.error(result.error); return; }
        toast.success("Menu généré !");
        setOpen(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Erreur lors de la génération");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!hasTarget}
        className={cn(buttonVariants({ size: "sm" }), !hasTarget && "opacity-50 cursor-not-allowed")}
        onClick={e => { if (!hasTarget) e.preventDefault(); }}
      >
        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
        Générer un menu
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Générer mon menu IA</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Durée du menu</Label>
            <div className="grid grid-cols-2 gap-2">
              {DAY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDays(opt.value)}
                  className={cn(
                    "border rounded-lg py-2.5 text-sm font-medium transition-colors",
                    days === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted border-input"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Aliments à exclure <span className="font-normal text-muted-foreground">(optionnel)</span></Label>
            <Textarea
              placeholder="Ex : brocoli, saumon, fromage blanc..."
              value={exclusions}
              onChange={e => setExclusions(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Aliments à inclure <span className="font-normal text-muted-foreground">(optionnel)</span></Label>
            <Textarea
              placeholder="Ex : inclure du riz basmati, des œufs, des patates douces..."
              value={inclusions}
              onChange={e => setInclusions(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          {/* Style */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Instructions particulières <span className="font-normal text-muted-foreground">(optionnel)</span></Label>
            <Textarea
              placeholder="Ex : repas simples et rapides, batch cooking le dimanche, pas de poisson cette semaine..."
              value={styleNotes}
              onChange={e => setStyleNotes(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          <Button
            className="w-full"
            disabled={pending}
            onClick={handleGenerate}
          >
            {pending ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Génération en cours…</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" />Générer</>
            )}
          </Button>

          {pending && (
            <p className="text-xs text-center text-muted-foreground">
              Claude génère ton menu personnalisé… (~30-60s)
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

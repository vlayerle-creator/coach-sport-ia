"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  onboardingSchema,
  ONBOARDING_STEPS,
  type OnboardingInput,
  type OnboardingStep,
} from "@/lib/validations/onboarding";

type OnboardingFormValues = z.input<typeof onboardingSchema>;
import { completeOnboarding } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SafetyDisclaimer } from "./safety-disclaimer";

const STEP_FIELDS: Record<OnboardingStep, FieldPath<OnboardingFormValues>[]> = {
  profile: ["firstName", "birthDate", "sex", "heightCm", "currentWeightKg", "targetWeightKg"],
  level: [
    "sportLevel", "strengthTrainingYears", "tennisLevel", "currentWeeklyFrequency",
    "desiredWeeklyFrequency", "availableDays", "maxSessionMinutes", "trainingLocation",
    "availableEquipment",
  ],
  goals: ["primaryGoal", "secondaryGoals", "targetDate"],
  health: ["pastInjuries", "currentPain", "jointLimitations", "acuteWarningFlags"],
  nutrition: [
    "dietType", "allergies", "intolerances", "refusedFoods", "preferredMealsCount",
    "cookingBudgetLevel", "cookingTimeMinutes",
  ],
  lifestyle: [
    "averageSleepQuality", "averageStress", "averageEnergy", "currentSupplements",
    "declaredTreatments", "voluntaryHealthNotes",
  ],
};

const STEP_TITLES: Record<OnboardingStep, string> = {
  profile: "Ton profil",
  level: "Ton niveau et tes disponibilités",
  goals: "Tes objectifs",
  health: "Santé et sécurité",
  nutrition: "Préférences alimentaires",
  lifestyle: "Sommeil, stress, compléments",
};

const DAYS: { value: string; label: string }[] = [
  { value: "mon", label: "Lun" }, { value: "tue", label: "Mar" },
  { value: "wed", label: "Mer" }, { value: "thu", label: "Jeu" },
  { value: "fri", label: "Ven" }, { value: "sat", label: "Sam" },
  { value: "sun", label: "Dim" },
];

const SECONDARY_GOALS: { value: string; label: string }[] = [
  { value: "strength", label: "Force" },
  { value: "hypertrophy", label: "Hypertrophie" },
  { value: "endurance", label: "Endurance musculaire" },
  { value: "mobility", label: "Mobilité" },
  { value: "conditioning", label: "Condition physique" },
  { value: "tennis_performance", label: "Performance tennis" },
  { value: "injury_prevention", label: "Prévention des blessures" },
  { value: "recovery", label: "Récupération" },
  { value: "sleep", label: "Sommeil" },
];

const WARNING_FLAGS: { value: string; label: string }[] = [
  { value: "acute_pain", label: "Douleur aiguë" },
  { value: "recent_injury", label: "Blessure récente" },
  { value: "dizziness", label: "Vertiges" },
  { value: "chest_pain", label: "Douleur thoracique" },
  { value: "abnormal_fatigue", label: "Fatigue anormale" },
  { value: "rapid_weight_loss", label: "Perte de poids rapide" },
  { value: "disordered_eating_concern", label: "Comportement alimentaire préoccupant" },
];

function toggleInArray(current: string[], value: string) {
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

function CsvField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        placeholder="Séparés par une virgule"
        defaultValue={value.join(", ")}
        onBlur={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean),
          )
        }
      />
    </div>
  );
}

export function OnboardingWizard({ defaultFirstName }: { defaultFirstName: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const step = ONBOARDING_STEPS[stepIndex];

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues, unknown, OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: defaultFirstName,
      sex: "male",
      sportLevel: "beginner",
      currentWeeklyFrequency: 0,
      desiredWeeklyFrequency: 3,
      availableDays: [],
      maxSessionMinutes: 60,
      trainingLocation: "gym",
      availableEquipment: [],
      primaryGoal: "maintain",
      secondaryGoals: [],
      acuteWarningFlags: [],
      dietType: "omnivore",
      allergies: [],
      intolerances: [],
      refusedFoods: [],
      preferredMealsCount: 3,
      cookingBudgetLevel: "medium",
      cookingTimeMinutes: 30,
      averageSleepQuality: 3,
      averageStress: 3,
      averageEnergy: 3,
      currentSupplements: [],
    },
  });

  const values = watch();

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, ONBOARDING_STEPS.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const onSubmit = async (data: OnboardingInput) => {
    setServerError(null);
    const result = await completeOnboarding(data);
    if (result?.error) setServerError(result.error);
  };

  const progressPct = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Progress value={progressPct} />
        <p className="text-sm text-muted-foreground">
          Étape {stepIndex + 1}/{ONBOARDING_STEPS.length} — {STEP_TITLES[step]}
        </p>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {step === "profile" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input id="birthDate" type="date" {...register("birthDate")} />
            {errors.birthDate && (
              <p className="text-sm text-destructive">{errors.birthDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Sexe physiologique (pour les calculs)</Label>
            <Select value={values.sex} onValueChange={(v) => setValue("sex", v as "male" | "female")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Homme</SelectItem>
                <SelectItem value="female">Femme</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heightCm">Taille (cm)</Label>
              <Input id="heightCm" type="number" {...register("heightCm")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentWeightKg">Poids actuel (kg)</Label>
              <Input id="currentWeightKg" type="number" step="0.1" {...register("currentWeightKg")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetWeightKg">Poids cible (kg, optionnel)</Label>
            <Input id="targetWeightKg" type="number" step="0.1" {...register("targetWeightKg")} />
          </div>
        </div>
      )}

      {step === "level" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Niveau sportif</Label>
            <Select
              value={values.sportLevel}
              onValueChange={(v) => setValue("sportLevel", v as OnboardingInput["sportLevel"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="advanced">Avancé</SelectItem>
                <SelectItem value="elite">Élite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentWeeklyFrequency">Séances/semaine actuelles</Label>
              <Input id="currentWeeklyFrequency" type="number" {...register("currentWeeklyFrequency")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredWeeklyFrequency">Séances/semaine souhaitées</Label>
              <Input id="desiredWeeklyFrequency" type="number" {...register("desiredWeeklyFrequency")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Jours disponibles</Label>
            <div className="flex flex-wrap gap-3">
              {DAYS.map((d) => (
                <label key={d.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={values.availableDays?.includes(d.value as never)}
                    onCheckedChange={() =>
                      setValue(
                        "availableDays",
                        toggleInArray(values.availableDays ?? [], d.value) as OnboardingInput["availableDays"],
                      )
                    }
                  />
                  {d.label}
                </label>
              ))}
            </div>
            {errors.availableDays && (
              <p className="text-sm text-destructive">Sélectionne au moins un jour.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxSessionMinutes">Durée max d&apos;une séance (min)</Label>
            <Input id="maxSessionMinutes" type="number" {...register("maxSessionMinutes")} />
          </div>
          <div className="space-y-2">
            <Label>Lieu d&apos;entraînement</Label>
            <Select
              value={values.trainingLocation}
              onValueChange={(v) => setValue("trainingLocation", v as OnboardingInput["trainingLocation"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Domicile</SelectItem>
                <SelectItem value="gym">Salle</SelectItem>
                <SelectItem value="both">Les deux</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CsvField
            label="Matériel disponible"
            value={values.availableEquipment ?? []}
            onChange={(v) => setValue("availableEquipment", v)}
          />
          <div className="space-y-2">
            <Label htmlFor="tennisLevel">Niveau de tennis (optionnel)</Label>
            <Input id="tennisLevel" {...register("tennisLevel")} />
          </div>
        </div>
      )}

      {step === "goals" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Objectif principal</Label>
            <Select
              value={values.primaryGoal}
              onValueChange={(v) => setValue("primaryGoal", v as OnboardingInput["primaryGoal"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bulk">Prise de masse</SelectItem>
                <SelectItem value="cut">Sèche / perte de graisse</SelectItem>
                <SelectItem value="recomp">Recomposition corporelle</SelectItem>
                <SelectItem value="maintain">Maintien</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Objectifs secondaires</Label>
            <div className="grid grid-cols-2 gap-2">
              {SECONDARY_GOALS.map((g) => (
                <label key={g.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={values.secondaryGoals?.includes(g.value as never)}
                    onCheckedChange={() =>
                      setValue(
                        "secondaryGoals",
                        toggleInArray(values.secondaryGoals ?? [], g.value) as OnboardingInput["secondaryGoals"],
                      )
                    }
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetDate">Date cible (optionnel)</Label>
            <Input id="targetDate" type="date" {...register("targetDate")} />
          </div>
        </div>
      )}

      {step === "health" && (
        <div className="space-y-4">
          <SafetyDisclaimer />
          <div className="space-y-2">
            <Label htmlFor="pastInjuries">Blessures passées</Label>
            <Textarea id="pastInjuries" {...register("pastInjuries")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentPain">Douleurs actuelles</Label>
            <Textarea id="currentPain" {...register("currentPain")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jointLimitations">Limitations articulaires</Label>
            <Textarea id="jointLimitations" {...register("jointLimitations")} />
          </div>
          <div className="space-y-2">
            <Label>As-tu actuellement l&apos;un de ces symptômes ?</Label>
            <div className="grid grid-cols-1 gap-2">
              {WARNING_FLAGS.map((f) => (
                <label key={f.value} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={values.acuteWarningFlags?.includes(f.value as never)}
                    onCheckedChange={() =>
                      setValue(
                        "acuteWarningFlags",
                        toggleInArray(values.acuteWarningFlags ?? [], f.value) as OnboardingInput["acuteWarningFlags"],
                      )
                    }
                  />
                  {f.label}
                </label>
              ))}
            </div>
            {(values.acuteWarningFlags?.length ?? 0) > 0 && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  Un ou plusieurs signaux nécessitent de la prudence. Consulte un
                  professionnel de santé avant de poursuivre un programme intensif.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}

      {step === "nutrition" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Régime alimentaire</Label>
            <Select
              value={values.dietType}
              onValueChange={(v) => setValue("dietType", v as OnboardingInput["dietType"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore</SelectItem>
                <SelectItem value="vegetarian">Végétarien</SelectItem>
                <SelectItem value="vegan">Végan</SelectItem>
                <SelectItem value="pescatarian">Pescétarien</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CsvField label="Allergies" value={values.allergies ?? []} onChange={(v) => setValue("allergies", v)} />
          <CsvField label="Intolérances" value={values.intolerances ?? []} onChange={(v) => setValue("intolerances", v)} />
          <CsvField label="Aliments refusés" value={values.refusedFoods ?? []} onChange={(v) => setValue("refusedFoods", v)} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredMealsCount">Repas par jour</Label>
              <Input id="preferredMealsCount" type="number" {...register("preferredMealsCount")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookingTimeMinutes">Temps de cuisine (min)</Label>
              <Input id="cookingTimeMinutes" type="number" {...register("cookingTimeMinutes")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Budget alimentaire</Label>
            <Select
              value={values.cookingBudgetLevel}
              onValueChange={(v) => setValue("cookingBudgetLevel", v as OnboardingInput["cookingBudgetLevel"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Serré</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="high">Confortable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === "lifestyle" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="averageSleepQuality">Sommeil (1-5)</Label>
              <Input id="averageSleepQuality" type="number" min={1} max={5} {...register("averageSleepQuality")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="averageStress">Stress (1-5)</Label>
              <Input id="averageStress" type="number" min={1} max={5} {...register("averageStress")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="averageEnergy">Énergie (1-5)</Label>
              <Input id="averageEnergy" type="number" min={1} max={5} {...register("averageEnergy")} />
            </div>
          </div>
          <CsvField
            label="Compléments déjà pris"
            value={values.currentSupplements ?? []}
            onChange={(v) => setValue("currentSupplements", v)}
          />
          <div className="space-y-2">
            <Label htmlFor="declaredTreatments">Traitements éventuels (optionnel)</Label>
            <Textarea id="declaredTreatments" {...register("declaredTreatments")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voluntaryHealthNotes">
              Données de santé que tu souhaites partager (optionnel)
            </Label>
            <Textarea id="voluntaryHealthNotes" {...register("voluntaryHealthNotes")} />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          Précédent
        </Button>
        {stepIndex < ONBOARDING_STEPS.length - 1 ? (
          <Button type="button" onClick={goNext}>
            Suivant
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Terminer"}
          </Button>
        )}
      </div>
    </form>
  );
}

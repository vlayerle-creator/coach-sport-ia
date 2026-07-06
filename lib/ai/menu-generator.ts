import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.AI_API_KEY });

// ─── Output types ────────────────────────────────────────────────────────────

export interface MenuFood {
  name: string;
  quantity_g: number;
  weight_note: "poids cru" | "poids cuit" | string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface MenuMeal {
  meal_type: string;
  name: string;
  suggested_time: string; // "07:30"
  prep_minutes: number;
  foods: MenuFood[];
  total_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  prep_notes: string;
  prep_steps: string[];
  meal_reason: string;
  substitutions: string[];
}

export interface SupplementRec {
  name: string;
  dose: string;
  timing: string;
  reason: string;
  effect: string;
  priority: "prioritaire" | "utile" | "facultatif";
  precautions: string;
}

export interface MenuDay {
  date: string;
  is_training_day: boolean;
  targets: {
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    water_ml: number;
  };
  meals: MenuMeal[];
  hydration_notes: string;
  supplements: SupplementRec[];
  daily_logic: string;
}

// ─── Input profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  first_name: string;
  // Anthropometrics
  birth_date: string | null;      // ISO date
  sex: "male" | "female" | null;
  height_cm: number | null;
  weight_kg: number | null;
  body_fat_pct: number | null;
  // Goal & training
  primary_goal: string;
  weekly_sessions: number | null;
  max_session_minutes: number | null;
  training_days_today: boolean;
  training_time_today: string | null; // "18:00" estimated
  // Lifestyle
  average_sleep_quality: number | null; // 1-5
  average_stress: number | null;        // 1-5
  average_energy: number | null;        // 1-5
  declared_treatments: string | null;
  voluntary_health_notes: string | null;
  past_injuries: string | null;
  joint_limitations: string | null;
  // Food preferences
  diet_type: string | null;
  allergies: string[];
  intolerances: string[];
  refused_foods: string[];
  preferred_meals_count: number;
  cooking_time_minutes: number | null;
  cooking_budget_level: string | null;
  // Nutrition targets (from nutrition_targets table)
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null;
  water_ml: number | null;
  // Active supplements
  supplements: { name: string; type: string; timing: string | null; dosage: number | null; unit: string | null }[];
  // Generation scope
  days: number;
  extra_inclusions: string | null;
  style_notes: string | null;
}

// ─── Goal labels ─────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  bulk: "prise de masse progressive (surplus ~5-10 % au-dessus de la maintenance, priorité glucides)",
  bulk_fast: "prise de masse plus rapide (surplus ~10-15 %, acceptation d'un peu plus de graisse)",
  cut: "perte de masse grasse (déficit ~10-20 %, protéines élevées, préservation musculaire)",
  lean_cut: "sèche avec préservation musculaire (déficit modéré, protéines très élevées, glucides autour des séances, aliments rassasiants)",
  recomp: "recomposition corporelle (maintenance ou léger déficit ~5-10 %, protéines élevées, entraînement progressif)",
  maintain: "maintien du poids (maintenance calorique, bonne qualité nutritionnelle, performance et récupération)",
  hypertrophy: "hypertrophie musculaire (proches de la maintenance ou léger surplus modéré, protéines suffisantes, entraînement progressif prioritaire)",
  performance: "amélioration des performances sportives (glucides périphéries d'entraînement, récupération, protéines suffisantes)",
  recovery: "récupération sportive (anti-inflammatoire, protéines, glucides post-effort, qualité du sommeil)",
};

// ─── Age calculation ──────────────────────────────────────────────────────────

function calcAge(birth_date: string | null): number | null {
  if (!birth_date) return null;
  const birth = new Date(birth_date);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ─── Meal slots ───────────────────────────────────────────────────────────────

function getMealSlots(count: number, hasTraining: boolean, trainingTime: string | null): string[] {
  const base: Record<number, string[]> = {
    3: ["breakfast", "lunch", "dinner"],
    4: ["breakfast", "lunch", "afternoon_snack", "dinner"],
    5: ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner"],
    6: ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner", "evening_snack"],
  };
  const slots = [...(base[Math.min(Math.max(count, 3), 6)] ?? base[4])];

  if (hasTraining) {
    // Insert pre/post workout based on training time
    const hour = trainingTime ? parseInt(trainingTime.split(":")[0], 10) : 18;
    if (hour < 12) {
      // Morning training: pre before breakfast or morning snack
      if (!slots.includes("pre_workout")) slots.splice(0, 0, "pre_workout");
      if (!slots.includes("post_workout")) {
        const lunchIdx = slots.indexOf("lunch");
        slots.splice(lunchIdx >= 0 ? lunchIdx : 1, 0, "post_workout");
      }
    } else {
      // Afternoon/evening training
      if (!slots.includes("pre_workout")) {
        const snackIdx = slots.indexOf("afternoon_snack");
        slots.splice(snackIdx >= 0 ? snackIdx : slots.length - 1, 0, "pre_workout");
      }
      if (!slots.includes("post_workout")) {
        const dinnerIdx = slots.indexOf("dinner");
        slots.splice(dinnerIdx >= 0 ? dinnerIdx : slots.length, 0, "post_workout");
      }
    }
  }
  return slots;
}

const MEAL_TYPE_FR: Record<string, string> = {
  breakfast: "Petit-déjeuner",
  morning_snack: "Collation matin",
  lunch: "Déjeuner",
  afternoon_snack: "Collation après-midi",
  pre_workout: "Repas pré-entraînement",
  post_workout: "Repas post-entraînement",
  dinner: "Dîner",
  evening_snack: "Collation soir",
};

// ─── Main generator ──────────────────────────────────────────────────────────

export async function generateMenu(profile: UserProfile): Promise<MenuDay[]> {
  const age = calcAge(profile.birth_date);
  const mealSlots = getMealSlots(
    profile.preferred_meals_count,
    profile.training_days_today,
    profile.training_time_today
  );

  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < profile.days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const goalLabel = GOAL_LABELS[profile.primary_goal] ?? profile.primary_goal;

  // Build supplement context so Claude knows what's already taken
  const activeSuppsText = profile.supplements.length > 0
    ? profile.supplements.map(s =>
        `- ${s.name} (type: ${s.type}${s.dosage ? `, ${s.dosage}${s.unit ?? ""}` : ""}${s.timing ? `, timing: ${s.timing}` : ""})`
      ).join("\n")
    : "aucun";

  const prompt = `Tu es un coach nutritioniste expert en nutrition sportive. Génère un plan alimentaire complet et personnalisé pour ${profile.first_name}.

═══════════════════════════════
PROFIL COMPLET DE L'UTILISATEUR
═══════════════════════════════

Données physiologiques :
- Âge : ${age != null ? `${age} ans` : "non renseigné"}
- Sexe (pour estimations physiologiques) : ${profile.sex === "male" ? "homme" : profile.sex === "female" ? "femme" : "non renseigné"}
- Taille : ${profile.height_cm ? `${profile.height_cm} cm` : "non renseignée"}
- Poids : ${profile.weight_kg ? `${profile.weight_kg} kg` : "non renseigné"}
- Taux de masse grasse : ${profile.body_fat_pct ? `${profile.body_fat_pct} %` : "non renseigné"}

Objectif principal : ${goalLabel}

Entraînement :
- Séances par semaine : ${profile.weekly_sessions ?? "non renseigné"}
- Durée max par séance : ${profile.max_session_minutes ? `${profile.max_session_minutes} min` : "non renseignée"}
- Entraînement aujourd'hui : ${profile.training_days_today ? `OUI${profile.training_time_today ? ` (environ ${profile.training_time_today})` : ""}` : "NON"}

Bien-être déclaré :
- Qualité du sommeil moyenne : ${profile.average_sleep_quality ? `${profile.average_sleep_quality}/5` : "non renseignée"}
- Niveau de stress moyen : ${profile.average_stress ? `${profile.average_stress}/5` : "non renseigné"}
- Niveau d'énergie moyen : ${profile.average_energy ? `${profile.average_energy}/5` : "non renseigné"}

Santé :
- Traitements médicaux déclarés : ${profile.declared_treatments || "aucun"}
- Notes de santé déclarées : ${profile.voluntary_health_notes || "aucune"}
- Blessures passées : ${profile.past_injuries || "aucune"}
- Limitations articulaires : ${profile.joint_limitations || "aucune"}

Préférences alimentaires :
- Régime : ${profile.diet_type ?? "omnivore"}
- Allergies : ${profile.allergies.length ? profile.allergies.join(", ") : "aucune"}
- Intolérances : ${profile.intolerances.length ? profile.intolerances.join(", ") : "aucune"}
- Aliments refusés : ${profile.refused_foods.length ? profile.refused_foods.join(", ") : "aucun"}
- Nombre de repas souhaité par jour : ${profile.preferred_meals_count}
- Temps de cuisine disponible par repas : ${profile.cooking_time_minutes ? `${profile.cooking_time_minutes} min max` : "non renseigné"}
- Budget cuisine : ${profile.cooking_budget_level === "low" ? "économique" : profile.cooking_budget_level === "high" ? "élevé" : "moyen"}

═══════════════════════════════
OBJECTIFS NUTRITIONNELS QUOTIDIENS
═══════════════════════════════

- Calories : environ ${profile.calories_kcal} kcal (estimation, pas une valeur exacte)
- Protéines : ${profile.protein_g} g
- Glucides : ${profile.carbs_g} g
- Lipides : ${profile.fat_g} g
- Fibres : ${profile.fiber_g ? `environ ${profile.fiber_g} g` : "environ 30-35 g"}
- Hydratation : ${profile.water_ml ? `environ ${Math.round(profile.water_ml / 1000 * 10) / 10} L` : "environ 2 à 2,5 L"}

Repas de la journée à générer : ${mealSlots.map(s => MEAL_TYPE_FR[s]).join(", ")}

Compléments déjà pris par l'utilisateur :
${activeSuppsText}

═══════════════════════════════
RÈGLES DE GÉNÉRATION OBLIGATOIRES
═══════════════════════════════

STRUCTURE DE CHAQUE REPAS :
- Une source identifiable de protéines (25-40 g par repas principal)
- Une source de glucides adaptée à l'objectif
- Au moins un légume ou un fruit
- Une source de lipides si nécessaire
- Une sauce, épices ou assaisonnement
- Des quantités précises en grammes (poids cru par défaut pour viandes, poissons, riz, pâtes, avoine ; indiquer "poids cuit" si c'est le cas ; unités courantes pour œufs, fruits, tranches)

RÈGLES PROTÉINES :
- Répartis les protéines sur tous les repas principaux (pas de concentration au dîner)
- Varie les sources de protéines sur la journée et la semaine
- En sèche : vise le haut de la fourchette (2,0-2,2 g/kg)
- En prise de masse ou maintien : milieu de la fourchette (1,6-2,0 g/kg)

RÈGLES GLUCIDES :
- Place plus de glucides autour de l'entraînement (pré et post)
- Ne réduis pas drastiquement les glucides les jours de repos
- Varie les sources (riz, pâtes, pommes de terre, avoine, quinoa, fruits, pain)

RÈGLES LIPIDES :
- Minimum ~0,7 g/kg/jour
- Varie les sources (huile d'olive, noix, avocat, œufs, poissons gras)
- Contrôle précisément en sèche (pas d'élimination)

FRUITS ET LÉGUMES OBLIGATOIRES :
- Minimum 2 portions de fruits par journée
- Plusieurs portions de légumes, de couleurs variées
- Vise 25-40 g de fibres par jour
- Ne place pas beaucoup de fibres juste avant une séance

PRÉ-ENTRAÎNEMENT (selon le délai) :
- 2-4h avant : repas complet (protéines + glucides modérés à importants + légumes)
- 1-2h avant : repas léger facile à digérer (skyr + fruit, sandwich léger, whey + fruit)
- < 1h avant : banane, compote, galettes de riz, petite dose de protéines ; évite les repas gras, volumineux, riches en fibres, légumineuses en grande quantité, aliments épicés

POST-ENTRAÎNEMENT :
- Protéines suffisantes + glucides adaptés + légumes ou fruit
- Pas besoin de panique sur la "fenêtre anabolique" de 30 min, mais propose un repas dans un délai raisonnable

JOURS DE REPOS vs ENTRAÎNEMENT :
- Conserve les protéines à niveau similaire
- Varie légèrement les glucides (+/- 10-15 %) selon le jour
- Ne réduis pas drastiquement les calories les jours sans entraînement

SUR PLUSIEURS JOURS :
- Varie les protéines, légumes, féculents
- Réutilise intelligemment certains ingrédients pour le budget
- Autorise 2-3 répétitions intelligentes mais pas la même journée répétée
- Prévois des repas plus rapides les jours chargés
- Ne génère pas chaque jour les mêmes associations

ADAPTATION À L'OBJECTIF :
${profile.primary_goal === "lean_cut" || profile.primary_goal === "cut" ? `
SÈCHE : privilégie les protéines maigres, légumes volumineux, pommes de terre, fruits, skyr, fromage blanc, soupes complètes, légumineuses si tolérées, sauces légères. Contrôle précisément les aliments très caloriques (huiles, noix, fromage). Ne supprime pas les glucides avant les séances.` : ""}
${profile.primary_goal === "bulk" || profile.primary_goal === "bulk_fast" ? `
PRISE DE MASSE : augmente progressivement riz, pâtes, pain, avoine, pommes de terre, fruits, produits laitiers, huiles, oléagineux. Si appétit insuffisant, propose des aliments plus denses. Un smoothie de prise de masse peut être proposé (lait/soja, banane, avoine, protéine, beurre de cacahuète). Ne crée pas des menus de 4000+ kcal sans rapport avec le profil.` : ""}

═══════════════════════════════
SECTION COMPLÉMENTS
═══════════════════════════════

Génère des recommandations de compléments UNIQUEMENT si elles sont pertinentes pour ce profil.
Ne recommande pas tous les compléments à tout le monde.

Priorités par ordre :
1. Créatine monohydrate (si musculation, force, puissance) : 3-5 g/jour tous les jours, moment secondaire
2. Protéines en poudre UNIQUEMENT si les apports alimentaires ne permettent pas d'atteindre la cible
3. Caféine UNIQUEMENT pour performance, prise en compte de toute la caféine journalière
4. Électrolytes si forte transpiration ou chaleur
5. Vitamine D si faible exposition solaire (mentionner bilan biologique)
6. Vitamine B12 si végétalien

Ne recommande JAMAIS : BCAA si protéines suffisantes, boosters de testostérone, brûleurs de graisse, détox, SARMs, stéroïdes, produits dopants.

Pour chaque supplément recommandé, indique : pourquoi, effet attendu, dose, moment, précautions, niveau de priorité.

═══════════════════════════════
FORMAT DE RÉPONSE OBLIGATOIRE
═══════════════════════════════

Réponds UNIQUEMENT avec un JSON valide (pas de markdown, pas de texte autour) dans ce format exact :

{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "is_training_day": true,
      "targets": {
        "kcal": 2400,
        "protein_g": 180,
        "carbs_g": 250,
        "fat_g": 75,
        "fiber_g": 32,
        "water_ml": 2500
      },
      "meals": [
        {
          "meal_type": "breakfast",
          "name": "Porridge protéiné aux fruits rouges",
          "suggested_time": "07:30",
          "prep_minutes": 10,
          "foods": [
            {
              "name": "Flocons d'avoine",
              "quantity_g": 80,
              "weight_note": "poids cru",
              "kcal": 300,
              "protein_g": 11,
              "carbs_g": 54,
              "fat_g": 6,
              "fiber_g": 7
            }
          ],
          "total_kcal": 520,
          "total_protein_g": 38,
          "total_carbs_g": 62,
          "total_fat_g": 12,
          "total_fiber_g": 9,
          "prep_notes": "Cuire l'avoine dans le lait 3-4 min, incorporer le skyr hors du feu, ajouter les fruits.",
          "prep_steps": ["Faire chauffer le lait", "Cuire l'avoine 3 min", "Incorporer le skyr hors feu", "Servir avec les fruits"],
          "meal_reason": "Repas riche en protéines au réveil pour stimuler la synthèse protéique, glucides complexes pour l'énergie matinale.",
          "substitutions": ["Remplacer le skyr par 150 g de fromage blanc 0% (~18 g protéines)", "Remplacer l'avoine par 60 g de muesli peu sucré"]
        }
      ],
      "hydration_notes": "Boire 500 ml d'eau au réveil, 500 ml avant la séance, 750 ml pendant, 500 ml après.",
      "supplements": [
        {
          "name": "Créatine monohydrate",
          "dose": "5 g",
          "timing": "Après la séance ou avec un repas, tous les jours",
          "reason": "Augmente la force et la puissance musculaire, favorise l'hypertrophie",
          "effect": "Gain de force progressif sur 4-8 semaines de prise régulière",
          "priority": "prioritaire",
          "precautions": "Augmentation légère du poids liée à la rétention d'eau intracellulaire musculaire (non de la graisse). Précaution si maladie rénale connue."
        }
      ],
      "daily_logic": "Ce menu apporte environ 2400 kcal en léger surplus pour soutenir la prise de masse. Les glucides sont concentrés autour de la séance (pré et post) pour maximiser la performance et la récupération. Les protéines sont réparties sur 5 prises pour assurer une synthèse protéique optimale tout au long de la journée. Les lipides restent à un niveau sain pour soutenir les fonctions hormonales."
    }
  ]
}

${profile.extra_inclusions ? `\nAliments à inclure impérativement (en plus du profil de base) : ${profile.extra_inclusions}` : ""}
${profile.style_notes ? `\nInstructions particulières de l'utilisateur : ${profile.style_notes}` : ""}

Génère exactement ${profile.days} journée(s) pour ces dates : ${dates.join(", ")}.
Assure-toi que les totaux de chaque repas sont cohérents avec les ingrédients listés.
Assure-toi que les totaux de la journée correspondent approximativement aux cibles.
Respecte ABSOLUMENT les allergies et aliments refusés : ${profile.allergies.join(", ") || "aucune"}, ${profile.refused_foods.join(", ") || "aucun"}.
`;

  const message = await client.messages.create({
    model: process.env.AI_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  let cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  // Extract the outermost JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Réponse IA invalide — aucun JSON trouvé");
  cleaned = cleaned.slice(start, end + 1);

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Last resort: try to fix common issues (trailing commas, etc.)
    try {
      parsed = JSON.parse(cleaned.replace(/,\s*([}\]])/g, "$1"));
    } catch {
      console.error("[menu-generator] JSON brut:\n", cleaned.slice(0, 500));
      throw new Error("Réponse IA invalide — JSON malformé");
    }
  }

  // Stamp actual dates
  return parsed.days.map((day: any, i: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return { ...day, date: d.toISOString().split("T")[0] };
  }) as MenuDay[];
}

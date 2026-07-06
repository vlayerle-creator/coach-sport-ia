"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const client = new Anthropic({ apiKey: process.env.AI_API_KEY });

async function buildUserContext(supabase: any, userId: string) {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  const [
    { data: profile },
    { data: goal },
    { data: settings },
    { data: target },
    { data: measurement },
    { data: supplements },
    { data: recent_sessions },
    { data: recent_prs },
    { data: checkin },
    { data: menu_plan },
  ] = await Promise.all([
    supabase.from("profiles").select("first_name, birth_date, sex, height_cm").eq("id", userId).single(),
    supabase.from("goals").select("primary_goal, target_weight_kg, weekly_sessions_target").eq("user_id", userId).eq("is_active", true).single(),
    supabase.from("user_settings").select("diet_type, allergies, preferred_meals_count, average_sleep_quality, average_stress, average_energy").eq("user_id", userId).single(),
    supabase.from("nutrition_targets").select("calories_kcal, protein_g, carbs_g, fat_g").eq("user_id", userId).order("effective_from", { ascending: false }).limit(1).single(),
    supabase.from("body_measurements").select("measured_at, weight_kg, body_fat_pct").eq("user_id", userId).order("measured_at", { ascending: false }).limit(1).single(),
    supabase.from("supplements").select("name, type, timing").eq("user_id", userId).eq("is_active", true),
    supabase.from("workout_sessions").select("started_at, status, program:programs(name), session_exercises(exercises(name))").eq("user_id", userId).gte("started_at", `${weekAgo}T00:00:00`).order("started_at", { ascending: false }).limit(5),
    supabase.from("personal_records").select("value, achieved_at, exercises(name)").eq("user_id", userId).eq("record_type", "max_weight").order("achieved_at", { ascending: false }).limit(5),
    supabase.from("daily_checkins").select("sleep_quality, sleep_hours, energy, stress, soreness, fatigue").eq("user_id", userId).eq("checkin_date", today).single(),
    supabase.from("menu_plans").select("days").eq("user_id", userId).eq("is_active", true).order("generated_at", { ascending: false }).limit(1).single(),
  ]);

  const age = profile?.birth_date
    ? Math.floor((Date.now() - new Date(profile.birth_date).getTime()) / (365.25 * 86400000))
    : null;

  const GOAL_LABELS: Record<string, string> = {
    bulk: "prise de masse progressive", bulk_fast: "prise de masse rapide",
    cut: "perte de masse grasse", lean_cut: "sèche avec préservation musculaire",
    recomp: "recomposition corporelle", maintain: "maintien",
    hypertrophy: "hypertrophie musculaire", performance: "amélioration des performances",
    recovery: "récupération sportive",
  };

  // Today's menu
  const todayMenu = (() => {
    if (!menu_plan?.days) return null;
    const days = menu_plan.days as any[];
    return days.find((d: any) => d.date === today) ?? days[0] ?? null;
  })();

  return `
═══════════════════════════════
PROFIL UTILISATEUR
═══════════════════════════════
Prénom : ${profile?.first_name ?? "?"}
Âge : ${age ?? "non renseigné"} ans
Sexe : ${profile?.sex === "male" ? "Homme" : profile?.sex === "female" ? "Femme" : "non renseigné"}
Taille : ${profile?.height_cm ?? "?"} cm
Poids actuel : ${measurement?.weight_kg ?? "?"} kg (mesuré le ${measurement?.measured_at ?? "?"})
Masse grasse : ${measurement?.body_fat_pct ?? "non renseignée"} %

Objectif : ${GOAL_LABELS[goal?.primary_goal ?? ""] ?? goal?.primary_goal ?? "non défini"}
Poids cible : ${goal?.target_weight_kg ?? "non défini"} kg
Séances par semaine visées : ${goal?.weekly_sessions_target ?? "non définies"}

Régime : ${settings?.diet_type ?? "omnivore"}
Allergies : ${settings?.allergies?.length ? settings.allergies.join(", ") : "aucune"}
Nombre de repas/jour : ${settings?.preferred_meals_count ?? 4}

Bien-être déclaré (baseline) :
- Qualité de sommeil moyenne : ${settings?.average_sleep_quality ?? "?"}/5
- Niveau de stress moyen : ${settings?.average_stress ?? "?"}/5
- Niveau d'énergie moyen : ${settings?.average_energy ?? "?"}/5

═══════════════════════════════
CHECK-IN DU JOUR
═══════════════════════════════
${checkin ? `
- Qualité de sommeil : ${checkin.sleep_quality ?? "?"}/5
- Heures de sommeil : ${checkin.sleep_hours ?? "?"} h
- Énergie : ${checkin.energy ?? "?"}/5
- Stress : ${checkin.stress ?? "?"}/5
- Courbatures : ${checkin.soreness ?? "?"}/5
- Fatigue : ${checkin.fatigue ?? "?"}/5
` : "Aucun check-in enregistré aujourd'hui."}

═══════════════════════════════
OBJECTIFS NUTRITIONNELS
═══════════════════════════════
${target ? `${target.calories_kcal} kcal · ${target.protein_g}g protéines · ${target.carbs_g}g glucides · ${target.fat_g}g lipides` : "Non définis"}

MENU DU JOUR (généré par IA) :
${todayMenu
  ? todayMenu.meals?.map((m: any) => `- ${m.name} (${Math.round(m.total_kcal)} kcal, ${Math.round(m.total_protein_g)}g P)`).join("\n")
  : "Aucun menu généré pour aujourd'hui."}

═══════════════════════════════
COMPLÉMENTS ACTIFS
═══════════════════════════════
${supplements?.length ? supplements.map((s: any) => `- ${s.name} (${s.timing ?? "sans timing précis"})`).join("\n") : "Aucun"}

═══════════════════════════════
SÉANCES RÉCENTES (7 derniers jours)
═══════════════════════════════
${recent_sessions?.length
  ? recent_sessions.map((s: any) => {
      const date = new Date(s.started_at).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
      const exos = s.session_exercises?.slice(0, 3).map((e: any) => e.exercises?.name).filter(Boolean).join(", ");
      return `- ${date} : ${s.program?.name ?? "Séance libre"} — ${s.status === "completed" ? "✓ terminée" : s.status}${exos ? ` (${exos}…)` : ""}`;
    }).join("\n")
  : "Aucune séance cette semaine."}

═══════════════════════════════
RECORDS PERSONNELS RÉCENTS
═══════════════════════════════
${recent_prs?.length
  ? recent_prs.map((pr: any) => `- ${pr.exercises?.name} : ${pr.value} kg (${new Date(pr.achieved_at).toLocaleDateString("fr-FR")})`).join("\n")
  : "Aucun record récent."}
`.trim();
}

export async function sendCoachMessage(
  conversation_id: string | null,
  message: string
): Promise<{ conversation_id: string; reply: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { conversation_id: "", reply: "", error: "Non authentifié" };

  // Get or create conversation
  let convId = conversation_id;
  if (!convId) {
    const { data: conv } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select("id")
      .single();
    convId = conv?.id ?? "";
  }

  // Load conversation history
  const { data: history } = await supabase
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true })
    .limit(20);

  // Build context
  const userContext = await buildUserContext(supabase, user.id);

  const systemPrompt = `Tu es le coach sportif et nutritioniste personnel de l'utilisateur. Tu as accès à toutes ses données en temps réel.

Tu peux l'aider à :
- Analyser ses progrès et résultats
- Ajuster son programme d'entraînement
- Optimiser sa nutrition et ses menus
- Gérer sa récupération
- Planifier sa semaine
- Répondre à ses questions sur l'entraînement, la nutrition, les compléments
- Le motiver et l'orienter vers ses objectifs

RÈGLES IMPORTANTES :
- Réponds toujours en français
- Sois direct, précis et pratique — pas de discours générique
- Utilise les données réelles de l'utilisateur pour personnaliser tes réponses
- Si tu proposes des changements de programme ou de nutrition, explique pourquoi
- Ne donne pas de conseils médicaux, renvoie vers un professionnel si nécessaire
- Tu n'es pas un chatbot générique — tu connais cet utilisateur en détail

DONNÉES ACTUELLES DE L'UTILISATEUR :
${userContext}`;

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...(history ?? [])
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: message },
  ];

  let reply = "";
  try {
    const response = await client.messages.create({
      model: process.env.AI_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });
    reply = response.content[0].type === "text" ? response.content[0].text : "";
  } catch (err: any) {
    return { conversation_id: convId, reply: "", error: err.message ?? "Erreur IA" };
  }

  // Save both messages
  await supabase.from("ai_messages").insert([
    { conversation_id: convId, user_id: user.id, role: "user", content: message },
    { conversation_id: convId, user_id: user.id, role: "assistant", content: reply },
  ]);

  await supabase.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);

  revalidatePath("/coach");
  return { conversation_id: convId, reply };
}

export async function getOrCreateConversation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: conv } = await supabase
    .from("ai_conversations")
    .select("id, title, updated_at, ai_messages(role, content, created_at)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  return conv;
}

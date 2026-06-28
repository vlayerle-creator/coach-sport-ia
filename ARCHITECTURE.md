# Coach Sport IA — Architecture

Stack : Next.js (App Router) · TypeScript · React · Tailwind CSS · shadcn/ui ·
Supabase (PostgreSQL, Auth, Storage, RLS) · Vercel · Recharts · React Hook Form ·
Zod · IA appelée uniquement côté serveur.

Statut de ce document : socle d'architecture (phase 0). Le code applicatif
(pages, composants métier, server actions) sera construit phase par phase —
voir §12. Ce qui est déjà en place dans le dépôt :

- projet Next.js + TypeScript + Tailwind scaffoldé (`create-next-app`)
- shadcn/ui initialisé avec le jeu de composants de base
- clients Supabase (browser / server / admin) + middleware de session
- schéma SQL complet + RLS + storage (`supabase/migrations/0001..0012`)
- arborescence de dossiers pour toutes les phases à venir

## 1. Arborescence du projet

```
coach-sport-ia/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── reset-password/
│   │   └── onboarding/
│   ├── (app)/                         # zone authentifiée, layout avec nav
│   │   ├── dashboard/
│   │   ├── planning/
│   │   ├── training/
│   │   │   ├── programs/[programId]/
│   │   │   ├── session/[sessionId]/
│   │   │   ├── exercises/[exerciseId]/
│   │   │   ├── history/
│   │   │   └── records/
│   │   ├── tennis/
│   │   │   ├── sessions/
│   │   │   ├── stats/
│   │   │   └── plans/
│   │   ├── nutrition/
│   │   │   ├── journal/
│   │   │   ├── menus/
│   │   │   ├── recipes/[recipeId]/
│   │   │   ├── shopping-list/
│   │   │   └── targets/
│   │   ├── progress/
│   │   │   ├── measurements/
│   │   │   ├── photos/
│   │   │   └── reports/
│   │   ├── recovery/
│   │   │   ├── checkin/
│   │   │   └── pain/
│   │   ├── supplements/
│   │   ├── coach/
│   │   ├── profile/
│   │   └── settings/
│   └── api/
│       ├── ai/{coach,recommendations,actions,reports}/
│       ├── cron/{weekly-report,monthly-report,reminders}/
│       └── webhooks/
├── components/
│   ├── ui/                            # shadcn/ui (généré)
│   ├── layout/                        # shell, bottom-nav, top-nav, header
│   ├── onboarding/
│   ├── dashboard/
│   ├── planning/
│   ├── training/
│   ├── tennis/
│   ├── nutrition/
│   ├── progress/
│   ├── recovery/
│   ├── supplements/
│   ├── coach/
│   └── shared/                        # empty states, confirmations, charts wrappers
├── lib/
│   ├── supabase/{client,server,admin,middleware}.ts
│   ├── ai/                            # service IA centralisé, agents par domaine
│   ├── calculations/                  # moyennes, tendances, records, calories, volume
│   ├── validations/                   # schémas Zod par domaine
│   ├── types/                         # database.ts (généré) + types métier
│   ├── constants/
│   └── hooks/
├── supabase/
│   ├── migrations/                    # 0001..0012 (voir §3)
│   └── functions/                     # Edge Functions futures
├── tests/{unit,integration,e2e}/
├── scripts/                           # seed, génération de types
├── public/icons/                     # PWA icons + manifest
├── middleware.ts
├── .env.example
└── components.json
```

## 2. Modèle de données — vue d'ensemble

Domaines et tables (détail complet dans les migrations) :

- **Identité / profil** : `profiles`, `user_settings`, `goals`
- **Suivi physique** : `body_measurements`, `progress_photos`
- **Forme du jour** : `daily_checkins`, `pain_logs`, `habits`, `habit_logs`
- **Musculation** : `exercises`, `exercise_variations`, `workout_programs`,
  `workout_program_days`, `workout_program_exercises`, `workout_sessions`,
  `workout_session_exercises`, `workout_sets`, `personal_records`
- **Tennis** : `tennis_sessions`, `tennis_drills`
- **Nutrition** : `nutrition_targets`, `food_items`, `meals`, `meal_items`,
  `recipes`, `recipe_ingredients`, `meal_plans`, `meal_plan_days`,
  `shopping_lists`, `shopping_list_items`
- **Compléments** : `supplements`, `supplement_logs`
- **Planning** : `calendar_events`, `reminders`
- **Coach IA** : `ai_conversations`, `ai_messages`, `ai_recommendations`,
  `ai_actions`
- **Notifications & rapports** : `notifications`, `weekly_reports`,
  `monthly_reports`

### Relations clés

- `profiles.id` = `auth.users.id` (1:1, créé par trigger `handle_new_user`).
- `goals`, `body_measurements`, ... → `user_id → profiles.id`, cascade au
  niveau utilisateur uniquement (jamais de cascade qui supprimerait des
  données d'un autre utilisateur).
- `exercises` est une bibliothèque globale (pas de `user_id`) : lecture
  publique, écriture réservée au `service_role` (admin/seed).
- `workout_programs` → `workout_program_days` → `workout_program_exercises`
  → `exercises` : structure d'un programme.
- `workout_sessions` → `workout_session_exercises` → `workout_sets` :
  exécution réelle d'une séance (peut diverger du programme : exercice
  remplacé, série ajoutée, etc. via `replaced_program_exercise_id`).
- `personal_records` référence `workout_sets` pour tracer la preuve d'un
  record.
- `meals` → `meal_items` → `food_items` ou `recipes` : un repas est composé
  d'aliments bruts ou de recettes.
- `meal_plans` → `meal_plan_days` : planification multi-jours, source pour
  `shopping_lists` → `shopping_list_items`.
- `ai_actions` est la seule table par laquelle l'IA peut proposer une
  modification structurée (cf. §22 du cahier des charges) ; rien n'est
  appliqué sans passage par un statut `approved` puis `applied`.

### Enums

`sex_type`, `sport_level`, `primary_goal`, `secondary_goal`,
`training_location`, `muscle_group`, `movement_type`, `set_type`,
`program_split`, `session_status`, `pain_side`, `meal_type`, `diet_type`,
`supplement_type`, `calendar_event_type`, `ai_action_type`,
`ai_action_status`, `report_period` — définis dans `0001_extensions_enums.sql`.

## 3. Migrations SQL (`supabase/migrations/`)

| Fichier | Contenu |
|---|---|
| `0001_extensions_enums.sql` | extensions (`pgcrypto`, `pg_trgm`), tous les enums |
| `0002_core_user_tables.sql` | profils, settings, goals, mesures, photos, check-ins, douleurs, habitudes |
| `0003_training_tables.sql` | bibliothèque d'exercices, programmes, séances, séries, records |
| `0004_tennis_tables.sql` | séances tennis, drills |
| `0005_nutrition_tables.sql` | objectifs, aliments, repas, recettes, menus, listes de courses |
| `0006_supplements_tables.sql` | compléments et logs de prise |
| `0007_calendar_tables.sql` | événements calendrier, rappels |
| `0008_ai_tables.sql` | conversations, messages, recommandations, actions structurées |
| `0009_notifications_reports.sql` | notifications, rapports hebdo/mensuels |
| `0010_functions_triggers.sql` | trigger `updated_at`, création auto du profil au signup |
| `0011_rls.sql` | RLS sur toutes les tables utilisateur + fonctions `owns_*` pour les tables enfants |
| `0012_storage.sql` | buckets Storage + policies |

Appliquer dans l'ordre via `supabase db push` ou la CLI (`supabase migration up`).

## 4. Row Level Security — principe

- Toute table avec `user_id` : policies `select/insert/update/delete` avec
  `using/with check (user_id = auth.uid())`.
- Tables enfants sans `user_id` direct (`workout_sets`,
  `workout_program_exercises`, `meal_items`, etc.) : policy basée sur une
  fonction `owns_*` (`security definer`) qui remonte à la table parente
  possédant `user_id`.
- `exercises` / `exercise_variations` : lecture publique, écriture
  service-role uniquement (RLS actif mais aucune policy d'écriture pour le
  rôle `authenticated`).
- `food_items` : lecture des lignes système (`user_id is null`) +
  lecture/écriture de ses propres aliments custom.
- Aucune policy ne s'appuie sur une donnée envoyée par le client autre que
  le JWT (`auth.uid()`).

## 5. Storage

| Bucket | Public | Règle d'accès |
|---|---|---|
| `progress-photos` | non | lecture/écriture/suppression réservées au propriétaire (`<user_id>/...`), URL signées générées côté serveur pour l'affichage |
| `exercise-media` | oui | lecture publique, écriture service-role (admin/seed) |
| `recipe-images` | oui | lecture publique, écriture par le propriétaire (`<user_id>/...`) |
| `avatars` | oui | lecture publique, écriture par le propriétaire (`<user_id>/...`) |

Toute lecture de `progress-photos` côté app passe par
`supabase.storage.from('progress-photos').createSignedUrl(...)` exécuté côté
serveur (jamais d'URL publique pour ce bucket).

## 6. Pages (App Router)

### Auth / onboarding — `app/(auth)/`
- `/login`, `/signup`, `/reset-password`
- `/onboarding` (wizard multi-étapes : profil, objectifs, disponibilités,
  contraintes médicales, préférences alimentaires, sommeil/stress, compléments)

### Zone applicative — `app/(app)/` (layout avec bottom-nav mobile + sidebar desktop)
- `/dashboard`
- `/planning` (vues jour/semaine/mois/agenda)
- `/training/programs`, `/training/programs/[programId]`,
  `/training/session/[sessionId]`, `/training/exercises`,
  `/training/exercises/[exerciseId]`, `/training/history`, `/training/records`
- `/tennis/sessions`, `/tennis/stats`, `/tennis/plans`
- `/nutrition/journal`, `/nutrition/menus`, `/nutrition/recipes`,
  `/nutrition/recipes/[recipeId]`, `/nutrition/shopping-list`,
  `/nutrition/targets`
- `/progress/measurements`, `/progress/photos`, `/progress/reports`
- `/recovery/checkin`, `/recovery/pain`
- `/supplements`
- `/coach` (conversation IA)
- `/profile`, `/settings`

### API (Route Handlers, jamais appelées directement avec des clés sensibles côté client)
- `POST /api/ai/coach` — conversation libre, construit le contexte serveur
- `POST /api/ai/recommendations` — génère une recommandation pour un domaine
- `POST /api/ai/actions` — propose une action structurée (jamais d'écriture
  directe : statut `proposed` → validation utilisateur → `applied`)
- `POST /api/ai/reports` — génère un rapport hebdo/mensuel
- `GET /api/cron/weekly-report`, `/monthly-report`, `/reminders` — protégés
  par `CRON_SECRET`, déclenchés par Vercel Cron
- `app/api/webhooks/` — réservé (ex. provider IA, paiement futur)

## 7. Composants principaux

- `components/layout/` : `AppShell`, `BottomNav`, `Sidebar`, `TopBar`,
  `ThemeToggle`
- `components/onboarding/` : `OnboardingWizard`, un composant par étape,
  `SafetyDisclaimer`
- `components/dashboard/` : `TodaySessionCard`, `ReadinessScoreCard`,
  `AiDailySummary`, `NutritionSummaryCard`, `WeightTrendCard`,
  `UpcomingRemindersList`
- `components/planning/` : `CalendarView` (jour/semaine/mois/agenda),
  `EventCard`, `DragDropScheduler`, `MissedSessionBanner`
- `components/training/` : `ExerciseLibraryList`, `ExerciseCard`,
  `ProgramBuilder`, `ProgramDayEditor`, `SessionRunner` (écran de séance),
  `SetLogger`, `RestTimer`, `ProgressionSuggestionCard`, `PrBadge`
- `components/tennis/` : `TennisSessionForm`, `TennisStatsCharts`,
  `TennisPlanCard`
- `components/nutrition/` : `MealLogger`, `NaturalLanguageFoodInput`,
  `MacroProgressRings`, `RecipeCard`, `MenuPlannerGrid`, `ShoppingListView`
- `components/progress/` : `WeightChart`, `MeasurementChart`,
  `ProgressPhotoComparator`, `VolumeChart`, `ReportSummary`
- `components/recovery/` : `DailyCheckinForm`, `BodyPainMap`, `PainLogForm`
- `components/supplements/` : `SupplementCard`, `SupplementAlertBanner`
- `components/coach/` : `ChatThread`, `AiActionCard` (proposer / valider /
  rejeter), `AiMessageBubble`
- `components/shared/` : `EmptyState`, `ConfirmDialog`, `LoadingSkeletons`,
  `ChartContainer` (wrapper Recharts thémé clair/sombre)

## 8. Variables d'environnement (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # serveur uniquement
NEXT_PUBLIC_APP_URL=http://localhost:3000
AI_API_KEY=                       # serveur uniquement
AI_MODEL=claude-sonnet-4-6
CRON_SECRET=                      # protège /api/cron/*
```

Règles : jamais de secret préfixé `NEXT_PUBLIC_`, jamais de
`SUPABASE_SERVICE_ROLE_KEY` ou `AI_API_KEY` importés depuis un Client
Component.

## 9. Configuration Supabase

1. Créer un projet Supabase (région proche des utilisateurs).
2. Récupérer `Project URL` et `anon key` → `.env.local`.
3. Récupérer la `service_role key` → `.env.local` (jamais commit, jamais
   côté client).
4. Lier le projet : `npx supabase link --project-ref <ref>`.
5. Appliquer les migrations : `npx supabase db push` (ou `migration up` en
   local avec `supabase start`).
6. Vérifier que RLS est actif sur toutes les tables (`supabase db lint`
   ou requête `pg_tables` / `pg_policies`).
7. Activer Auth : email/password + magic link dans le dashboard Auth ;
   configurer les templates d'e-mail (confirmation, reset password) en
   français.
8. Activer Storage et vérifier la création des 4 buckets par la migration
   `0012_storage.sql`.
9. Générer les types TypeScript :
   `npx supabase gen types typescript --project-id <ref> --schema public > lib/types/database.ts`.
10. (Plus tard) configurer Realtime sur les tables qui en ont besoin
    (ex. `notifications`) et les Edge Functions si nécessaire.

## 10. Configuration Vercel

1. Importer le repo GitHub dans Vercel.
2. Renseigner les variables d'environnement pour chaque environnement
   (Development / Preview / Production) — ne jamais réutiliser la
   `service_role key` de prod en preview si un projet Supabase de staging
   existe.
3. Activer les Preview Deployments automatiques sur chaque PR.
4. Configurer un domaine personnalisé en production.
5. Activer Vercel Analytics + Monitoring des erreurs.
6. Déclarer les Cron Jobs dans `vercel.json` (rapports hebdo/mensuels,
   rappels) pointant vers `app/api/cron/*`, protégés par `CRON_SECRET`.
7. Vérifier que les fonctions serverless respectent les limites de durée
   (les appels IA longs doivent streamer ou être asynchrones).

## 11. Service IA côté serveur

- Toutes les requêtes passent par `lib/ai/` (jamais d'appel direct depuis le
  client).
- Un agent par domaine : `lib/ai/agents/{strength,tennis,nutrition,
  recovery,progress,planner,recipe,report}.ts`.
- Chaque agent : construit un contexte minimal et pertinent (pas tout
  l'historique), demande une sortie JSON, valide la sortie avec un schéma
  Zod dédié avant de l'utiliser ou de la stocker.
- Les calculs critiques (moyennes, tendances, volume, charge, objectifs
  nutritionnels, records) sont faits par `lib/calculations/`, jamais par
  l'IA — l'IA reçoit des résultats déjà calculés et les commente.
- Toute action proposée par l'IA passe par `ai_actions` avec statut
  `proposed`, n'est jamais appliquée directement ; l'application réelle
  (écriture dans `workout_sessions`, `nutrition_targets`, etc.) se fait via
  une Server Action déclenchée par la validation explicite de
  l'utilisateur, qui passe le statut à `applied`.

## 12. Plan de développement par phases

| Phase | Contenu |
|---|---|
| 1 | Structure projet, Supabase, auth, profil, onboarding, navigation, dashboard vide, DB + RLS *(en cours — socle posé)* |
| 2 | Exercices, programmes, séances, séries, minuteur, historique, progression auto simple |
| 3 | Poids, mensurations, photos, graphiques, check-ins, récupération |
| 4 | Nutrition, repas, recettes, objectifs, menus, listes de courses |
| 5 | Tennis, planning, calendrier, rappels |
| 6 | Coach IA, recommandations, actions structurées, rapports automatiques |
| 7 | PWA, offline, notifications, optimisation, tests, déploiement Vercel |

Chaque phase suivante : migrations dédiées si besoin, types, pages,
composants, fonctions serveur, tests, vérification RLS, commandes à
exécuter — fournis au moment d'attaquer la phase.

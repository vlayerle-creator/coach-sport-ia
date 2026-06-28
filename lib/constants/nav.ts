import type { LucideIcon } from "lucide-react";
import {
  Home, CalendarDays, Dumbbell, Apple, LineChart, Bot,
  Trophy, HeartPulse, Pill, BookOpen, History, User, Settings,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/planning", label: "Planning", icon: CalendarDays },
  { href: "/training", label: "Entraînement", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/progress", label: "Progrès", icon: LineChart },
  { href: "/coach", label: "Coach IA", icon: Bot },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/tennis", label: "Tennis", icon: Trophy },
  { href: "/recovery", label: "Récupération", icon: HeartPulse },
  { href: "/supplements", label: "Compléments", icon: Pill },
  { href: "/nutrition/recipes", label: "Recettes", icon: BookOpen },
  { href: "/training/history", label: "Historique", icon: History },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

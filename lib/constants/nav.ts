import type { LucideIcon } from "lucide-react";
import {
  Home, CalendarDays, Dumbbell, Apple, LineChart, Bot,
  HeartPulse, BookOpen, History, User, Settings,
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
  { href: "/recovery", label: "Récupération", icon: HeartPulse },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/profile", label: "Profil", icon: User },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

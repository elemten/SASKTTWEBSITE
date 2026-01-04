import {
  LayoutDashboard,
  Users,
  Trophy,
  Activity,
  DollarSign
} from "lucide-react";

export interface AdminNavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin"
  },
  {
    id: "members",
    label: "Memberships",
    icon: Users,
    href: "/admin/members"
  },
  {
    id: "tournaments",
    label: "Tournaments",
    icon: Trophy,
    href: "/admin/tournaments"
  },
  {
    id: "sped",
    label: "SPED",
    icon: Activity,
    href: "/admin/sped"
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    href: "/admin/finance"
  }
];

export type AdminSection =
  | "dashboard"
  | "members"
  | "memberships"
  | "clubs"
  | "clinics"
  | "sped"
  | "tournaments"
  | "finance"
  | "map-grants"
  | "reports";
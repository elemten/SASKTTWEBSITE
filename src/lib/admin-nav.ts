import {
  LayoutDashboard,
  Users,
  Building2,
  Trophy,
  Calendar,
  BarChart3,
  DollarSign,
  Award,
  UserCheck,
  Activity
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
    label: "Members",
    icon: Users,
    href: "/admin/members"
  },
  {
    id: "memberships",
    label: "Memberships",
    icon: UserCheck,
    href: "/admin/memberships"
  },
  {
    id: "clubs",
    label: "Clubs",
    icon: Building2,
    href: "/admin/clubs"
  },
  {
    id: "clinics",
    label: "Clinics",
    icon: Calendar,
    href: "/admin/clinics"
  },
  {
    id: "sped",
    label: "SPED",
    icon: Activity,
    href: "/admin/sped"
  },
  {
    id: "tournaments",
    label: "Tournaments",
    icon: Trophy,
    href: "/admin/tournaments"
  },
  {
    id: "finance",
    label: "Finance",
    icon: DollarSign,
    href: "/admin/finance"
  },
  {
    id: "map-grants",
    label: "MAP Grants",
    icon: Award,
    href: "/admin/map-grants"
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    href: "/admin/reports"
  },
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
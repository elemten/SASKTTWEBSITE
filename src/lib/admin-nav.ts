import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Calendar,
  Receipt,
  BarChart3,
  Shield,
  Trophy
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
    id: "membership",
    label: "Membership Analytics",
    icon: Users,
    href: "/admin/membership"
  },
  {
    id: "clubs",
    label: "Clubs",
    icon: Building2,
    href: "/admin/clubs"
  },
  {
    id: "invoices",
    label: "Invoices & Payments",
    icon: FileText,
    href: "/admin/billing"
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    href: "/admin/events"
  },
  {
    id: "tournaments",
    label: "Tournaments",
    icon: Trophy,
    href: "/admin/tournaments"
  },
  {
    id: "expenses",
    label: "Expenses",
    icon: Receipt,
    href: "/admin/expenses"
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    href: "/admin/reports"
  },
  {
    id: "admins",
    label: "Admins & Logs",
    icon: Shield,
    href: "/admin/admins"
  },
];

export type AdminSection =
  | "dashboard"
  | "members"
  | "membership"
  | "clubs"
  | "invoices"
  | "events"
  | "tournaments"
  | "expenses"
  | "reports"
  | "admins";

import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Calendar,
  Receipt,
  BarChart3,
  Shield
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
  | "clubs"
  | "invoices"
  | "events"
  | "expenses"
  | "reports"
  | "admins";

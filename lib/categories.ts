import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Lightbulb,
  HeartPulse,
  GraduationCap,
  Package,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgLight: string;
  borderColor: string;
  textBadge: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "Food",
    name: "Food & Dining",
    icon: Utensils,
    color: "#EA580C", // Orange
    bgLight: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800/40",
    textBadge: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    id: "Transport",
    name: "Transport",
    icon: Car,
    color: "#2563EB", // Blue
    bgLight: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800/40",
    textBadge: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "Shopping",
    name: "Shopping",
    icon: ShoppingBag,
    color: "#9333EA", // Purple
    bgLight: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800/40",
    textBadge: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "Entertainment",
    name: "Entertainment",
    icon: Film,
    color: "#EC4899", // Pink
    bgLight: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
    borderColor: "border-pink-200 dark:border-pink-800/40",
    textBadge: "bg-pink-100 text-pink-800 border-pink-200",
  },
  {
    id: "Bills & Utilities",
    name: "Bills & Utilities",
    icon: Lightbulb,
    color: "#EAB308", // Amber/Yellow
    bgLight: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    textBadge: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "Health",
    name: "Health & Medical",
    icon: HeartPulse,
    color: "#10B981", // Emerald
    bgLight: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800/40",
    textBadge: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "Education",
    name: "Education",
    icon: GraduationCap,
    color: "#06B6D4", // Cyan
    bgLight: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
    borderColor: "border-cyan-200 dark:border-cyan-800/40",
    textBadge: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  {
    id: "Others",
    name: "Others",
    icon: Package,
    color: "#64748B", // Slate
    bgLight: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    borderColor: "border-slate-200 dark:border-slate-700",
    textBadge: "bg-slate-100 text-slate-800 border-slate-200",
  },
];

export function getCategoryConfig(categoryName: string): CategoryConfig {
  const found = CATEGORIES.find(
    (c) =>
      c.id.toLowerCase() === categoryName.toLowerCase() ||
      c.name.toLowerCase() === categoryName.toLowerCase()
  );
  return (
    found || {
      id: categoryName,
      name: categoryName,
      icon: Tag,
      color: "#64748B",
      bgLight: "bg-slate-100 text-slate-700",
      borderColor: "border-slate-200",
      textBadge: "bg-slate-100 text-slate-800 border-slate-200",
    }
  );
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

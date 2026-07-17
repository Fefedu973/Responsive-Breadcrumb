import {
  BadgeCheck,
  Boxes,
  Building2,
  CreditCard,
  FileText,
  Flag,
  Folder,
  Globe,
  Landmark,
  Laptop,
  MapPin,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type {
  BreadcrumbData,
  SeparatorNavItem,
} from "@/components/responsive/ResponsiveBreadcrumb";

/** Shared click handler: demo items never navigate, they toast instead. */
export function notifyClick(item: BreadcrumbData | SeparatorNavItem) {
  const label =
    typeof item.label === "string" || typeof item.label === "number"
      ? String(item.label)
      : item.key;
  toast(`Navigate to “${label}”`, {
    description: item.href ?? undefined,
  });
}

const icon = {
  settings: <Settings className="size-4 shrink-0" aria-hidden />,
  users: <Users className="size-4 shrink-0" aria-hidden />,
  shield: <ShieldCheck className="size-4 shrink-0" aria-hidden />,
  folder: <Folder className="size-4 shrink-0" aria-hidden />,
  file: <FileText className="size-4 shrink-0" aria-hidden />,
  globe: <Globe className="size-4 shrink-0" aria-hidden />,
  map: <MapPin className="size-4 shrink-0" aria-hidden />,
  building: <Building2 className="size-4 shrink-0" aria-hidden />,
  landmark: <Landmark className="size-4 shrink-0" aria-hidden />,
  flag: <Flag className="size-4 shrink-0" aria-hidden />,
  shop: <ShoppingBag className="size-4 shrink-0" aria-hidden />,
  laptop: <Laptop className="size-4 shrink-0" aria-hidden />,
  boxes: <Boxes className="size-4 shrink-0" aria-hidden />,
  card: <CreditCard className="size-4 shrink-0" aria-hidden />,
  check: <BadgeCheck className="size-4 shrink-0" aria-hidden />,
};

/** Playground: a deep admin path with mixed label lengths. */
export const adminPath: BreadcrumbData[] = [
  { key: "dashboard", label: "Dashboard", clickable: true },
  { key: "admin", label: "Administration", clickable: true, icon: icon.settings },
  { key: "iam", label: "Identity & Access Management", clickable: true, icon: icon.users },
  { key: "roles", label: "Roles & Permissions", clickable: true },
  { key: "policies", label: "Security Policies", clickable: true, icon: icon.shield },
  { key: "acl", label: "Access Control Lists", clickable: true },
  { key: "edit", label: "Edit Super Admin Role" },
];

/** Sibling menus for the playground separators (keyed by the item on the right). */
export const adminSeparatorNav: Record<string, SeparatorNavItem[]> = {
  iam: [
    { key: "audit", label: "Audit Logs", clickable: true, icon: icon.file },
    { key: "billing", label: "Billing", clickable: true, icon: icon.card },
    { key: "compliance", label: "Compliance", clickable: true, icon: icon.check },
  ],
  roles: [
    { key: "groups", label: "User Groups", clickable: true, icon: icon.users },
    { key: "invitations", label: "Invitations", clickable: true },
  ],
};

/** Forward navigation entries shown by the next-page arrow. */
export const adminNextItems: SeparatorNavItem[] = [
  { key: "general", label: "General Settings", clickable: true, icon: icon.settings },
  { key: "members", label: "Members", clickable: true, icon: icon.users },
  { key: "security", label: "Security", clickable: true, icon: icon.shield },
  { key: "billing", label: "Billing", clickable: true, icon: icon.card },
];

/** E-commerce path with very long labels — ideal for truncation. */
export const productPath: BreadcrumbData[] = [
  { key: "shop", label: "Shop", clickable: true, icon: icon.shop },
  { key: "electronics", label: "Electronics & Accessories", clickable: true },
  { key: "laptops", label: "Gaming Laptops with Dedicated Graphics", clickable: true, icon: icon.laptop },
  { key: "collection", label: "Limited Edition Premium Collection", clickable: true },
  { key: "product", label: "ASUS ROG Strix G15 Advantage Edition (2026)" },
];

/** Geographic tree used by the separator-menu demo. */
export const geoPath: BreadcrumbData[] = [
  { key: "world", label: "World", clickable: true, icon: icon.globe },
  { key: "north-america", label: "North America", clickable: true },
  { key: "united-states", label: "United States", clickable: true },
  { key: "california", label: "California", clickable: true },
  { key: "san-francisco", label: "San Francisco" },
];

export const geoSeparatorNav: Record<string, SeparatorNavItem[]> = {
  "north-america": [
    { key: "europe", label: "Europe", clickable: true, icon: icon.globe },
    { key: "asia-pacific", label: "Asia Pacific", clickable: true, icon: icon.globe },
    { key: "south-america", label: "South America", clickable: true, icon: icon.globe },
  ],
  "united-states": [
    { key: "canada", label: "Canada", clickable: true, icon: icon.flag },
    { key: "mexico", label: "Mexico", clickable: true, icon: icon.flag },
  ],
  california: [
    { key: "new-york", label: "New York", clickable: true, icon: icon.landmark },
    { key: "texas", label: "Texas", clickable: true, icon: icon.landmark },
    { key: "washington", label: "Washington", clickable: true, icon: icon.landmark },
  ],
  "san-francisco": [
    { key: "los-angeles", label: "Los Angeles", clickable: true, icon: icon.building },
    { key: "san-diego", label: "San Diego", clickable: true, icon: icon.building },
    { key: "san-jose", label: "San Jose", clickable: true, icon: icon.building },
  ],
};

/** Docs path with a pinned middle release — shows multiple ellipses. */
export const docsPath: BreadcrumbData[] = [
  { key: "docs", label: "Docs", clickable: true },
  { key: "framework", label: "Framework Guides", clickable: true },
  { key: "release", label: "v4.2", clickable: true, canCollapse: false },
  { key: "components", label: "Component Library", clickable: true },
  { key: "navigation", label: "Navigation Patterns", clickable: true },
  { key: "breadcrumb", label: "Breadcrumb" },
];

/** File-system path used by the fallback and loading demos. */
export const filePath: BreadcrumbData[] = [
  { key: "documents", label: "Documents", clickable: true },
  { key: "projects", label: "Projects", clickable: true, icon: icon.folder },
  { key: "2026", label: "2026", clickable: true },
  { key: "q3", label: "Q3 Reports", clickable: true },
  { key: "report", label: "Quarterly_Financial_Report_final_v3.pdf", icon: icon.file },
];

/** Sprint path for pinning / priority demos. */
export const sprintPath: BreadcrumbData[] = [
  { key: "home", label: "Home", clickable: true },
  { key: "team", label: "Platform Team", clickable: true },
  { key: "projects", label: "Projects", clickable: true },
  { key: "apollo", label: "Apollo", clickable: true },
  { key: "sprints", label: "Sprints", clickable: true },
  { key: "sprint-42", label: "Sprint 42", clickable: true },
  { key: "retro", label: "Retrospective" },
];

/** Archive path for the forceCollapse demo. */
export const archivePath: BreadcrumbData[] = [
  { key: "home", label: "Home", clickable: true },
  { key: "archive-2023", label: "Archive 2023", clickable: true },
  { key: "archive-2024", label: "Archive 2024", clickable: true },
  { key: "archive-2025", label: "Archive 2025", clickable: true },
  { key: "reports", label: "Reports", clickable: true },
  { key: "summary", label: "Annual Summary" },
];

/** Arabic path for the RTL demo. */
export const arabicPath: BreadcrumbData[] = [
  { key: "home", label: "الرئيسية", clickable: true },
  { key: "store", label: "المتجر", clickable: true, icon: icon.shop },
  { key: "electronics", label: "الإلكترونيات", clickable: true },
  { key: "laptops", label: "أجهزة الحاسوب المحمولة", clickable: true },
  { key: "product", label: "ماك بوك برو ١٦ بوصة" },
];

export const arabicStrings = {
  navigateTo: (label: string) => `الانتقال إلى ${label}`,
  showCollapsedItems: (count: number) => `عرض ${count} عناصر مخفية`,
  moreOptions: "المزيد من الخيارات",
  nextItems: "العناصر التالية",
  showSiblingItems: (label: string) => `عرض خيارات ${label}`,
  noItemsAvailable: "لا توجد عناصر",
  itemLabelFallback: "عنصر",
};

/** Deployment path for the custom-rendering demo. */
export const deployPath: BreadcrumbData[] = [
  { key: "deployments", label: "Deployments", clickable: true },
  { key: "region", label: "us-east-1", clickable: true },
  { key: "env", label: "production", clickable: true },
  { key: "service", label: "web-frontend", clickable: true },
  { key: "version", label: "v2.14.3" },
];

/** Marketing site path with real hrefs for the SEO / focus demo. */
export const seoPath: BreadcrumbData[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "docs", label: "Documentation", href: "/docs" },
  { key: "components", label: "Components", href: "/docs/components" },
  { key: "navigation", label: "Navigation", href: "/docs/components/navigation" },
  { key: "breadcrumb", label: "Responsive Breadcrumb" },
];

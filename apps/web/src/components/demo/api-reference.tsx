interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

interface PropGroup {
  title: string;
  rows: PropRow[];
}

const GROUPS: PropGroup[] = [
  {
    title: "Data",
    rows: [
      { name: "items", type: "BreadcrumbData[]", description: "Ordered crumbs from root to current page." },
      { name: "separatorNavItems", type: "Record<string, SeparatorNavItem[]>", description: "Sibling menus per separator, keyed by item key or \"prev:next\" pair." },
      { name: "nextItems", type: "SeparatorNavItem[]", defaultValue: "[]", description: "Pages one level deeper, shown by the next-page arrow." },
      { name: "onItemClick", type: "(item) => void", description: "Fires for crumbs and menu entries." },
    ],
  },
  {
    title: "Item shape (BreadcrumbData)",
    rows: [
      { name: "key / label / href", type: "string / ReactNode / string?", description: "Identity, content, and optional link target." },
      { name: "clickable / disabled", type: "boolean", description: "Interactive without a link / grayed out." },
      { name: "canCollapse", type: "boolean", defaultValue: "true (edges: false)", description: "Whether the solver may hide this crumb." },
      { name: "canTruncate", type: "boolean", defaultValue: "true (last: false)", description: "Whether truncation may shrink this crumb." },
      { name: "icon / customElement", type: "ReactNode", description: "Leading icon, or full custom content." },
      { name: "measureElement", type: "ReactNode", description: "Lightweight stand-in rendered in the hidden measurement tree." },
    ],
  },
  {
    title: "Collapse",
    rows: [
      { name: "strategy", type: "\"start\" | \"center\" | \"end\" | \"none\"", defaultValue: "\"start\"", description: "Where the collapsed range is placed." },
      { name: "preference", type: "\"minimize-count\" | \"minimize-visibility\" | \"none\"", defaultValue: "\"none\"", description: "Tie-breaker between fitting layouts." },
      { name: "alwaysShow", type: "{ head?, tail? }", defaultValue: "{ head: 1, tail: 1 }", description: "Crumbs pinned at each end." },
      { name: "forceCollapse", type: "(item, index) => boolean", description: "Pre-collapses matching crumbs even when everything fits." },
      { name: "itemPriority", type: "(item, index) => number", description: "Lower values collapse earlier." },
      { name: "allowMultipleEllipses", type: "boolean", defaultValue: "false", description: "Allow several collapsed groups. Requires grouping ≠ \"contiguous\"." },
      { name: "grouping", type: "\"contiguous\" | \"smart\" | \"free\"", defaultValue: "\"contiguous\"", description: "How collapsed groups may form." },
      { name: "overflowBehavior", type: "\"collapse\" | \"scroll\" | \"wrap\"", defaultValue: "\"collapse\"", description: "Solver-driven collapse, or native scroll / wrap." },
    ],
  },
  {
    title: "Truncation",
    rows: [
      { name: "enableTruncation", type: "boolean", defaultValue: "false", description: "Shrink wide labels before collapsing." },
      { name: "truncateMinWidth / truncateMaxWidth", type: "number", defaultValue: "60 / 200", description: "Bounds for a truncated label's width (px)." },
      { name: "truncateThreshold", type: "number", defaultValue: "100", description: "Only labels wider than this are candidates." },
      { name: "truncateOrder", type: "\"biggest-first\" | \"smallest-first\"", defaultValue: "\"biggest-first\"", description: "Which candidates shrink first." },
      { name: "showTooltipOnTruncate", type: "boolean", defaultValue: "true", description: "Full label in a tooltip when truncated." },
    ],
  },
  {
    title: "Fallbacks & loading",
    rows: [
      { name: "titleOnlyFallback", type: "ReactNode", defaultValue: "last item label", description: "Content of the title-only fallback." },
      { name: "titleOnlyIcon / titleOnlyCustomElement", type: "ReactNode", description: "Icon or full custom title-only content." },
      { name: "fallbackAtWidth", type: "number", description: "Force title-only at or below this container width." },
      { name: "isLoading", type: "boolean", defaultValue: "false", description: "Switches to the loading fallback." },
      { name: "loadingFallback", type: "\"title\" | \"custom\" | \"none\"", defaultValue: "\"none\"", description: "What renders while loading." },
      { name: "customLoadingFallback", type: "ReactNode", description: "Custom loading content (e.g. a skeleton)." },
    ],
  },
  {
    title: "Menus & overlays",
    rows: [
      { name: "separatorNavSide", type: "\"right\" | \"left\"", defaultValue: "\"right\"", description: "Which neighbor a separator menu belongs to." },
      { name: "showCurrentInNav", type: "\"never\" | \"with-others\" | \"always\"", defaultValue: "\"never\"", description: "Include the anchor item in its own menu." },
      { name: "clickableLeftOfEllipsis", type: "boolean", defaultValue: "false", description: "Keep the separator before an ellipsis interactive." },
      { name: "showNextArrow", type: "boolean", defaultValue: "false", description: "Forward arrow after the current page." },
      { name: "showCollapsedCount", type: "boolean", defaultValue: "false", description: "Badge with the number of hidden crumbs." },
      { name: "collapsedCountPlacement", type: "\"inline\" | \"outside\"", defaultValue: "\"outside\"", description: "Place the count inside the ellipsis button or floating beside it." },
      { name: "customEllipsisElement", type: "ReactNode", description: "Custom ellipsis trigger content." },
      { name: "lockOnOverlayOpen", type: "boolean", defaultValue: "true", description: "Freeze measurements while a popover/drawer is open." },
    ],
  },
  {
    title: "Rendering",
    rows: [
      { name: "renderItem", type: "(ctx) => ReactNode", description: "Custom crumb content — receives mode: visible | measure | menu." },
      { name: "renderSeparator", type: "(prevKey, nextKey) => ReactNode", description: "Custom decorative separator." },
      { name: "renderEllipsis / renderTitleOnly", type: "(ctx) => ReactNode", description: "Custom ellipsis trigger / title-only content." },
      { name: "renderMenuItem", type: "(ctx) => ReactNode", description: "Custom overlay menu rows." },
      { name: "renderItemLink / renderMenuLink", type: "(ctx) => ReactNode", description: "Wrap links with your router's Link component." },
      { name: "showHomeIcon", type: "boolean", defaultValue: "true", description: "Home icon on the first crumb." },
      { name: "lastItemClickable", type: "boolean", defaultValue: "false", description: "Make the current page interactive." },
    ],
  },
  {
    title: "Accessibility, i18n & SEO",
    rows: [
      { name: "strings", type: "Partial<ResponsiveBreadcrumbStrings>", description: "Localize every visible and ARIA label." },
      { name: "direction", type: "\"ltr\" | \"rtl\" | \"auto\"", defaultValue: "\"auto\"", description: "Layout direction; auto reads the document." },
      { name: "focusRing", type: "\"inset\" | \"outer\" | \"clip-margin\" | \"none\"", defaultValue: "\"inset\" in collapse mode", description: "Focus style that survives clipped containers." },
      { name: "schema", type: "\"json-ld\" | \"microdata\" | \"none\"", defaultValue: "\"json-ld\"", description: "Schema.org BreadcrumbList output." },
    ],
  },
  {
    title: "Debugging",
    rows: [
      { name: "debug", type: "boolean", defaultValue: "false", description: "Draw measurement outlines." },
      { name: "onDebugStateChange", type: "(state: BreadcrumbDebugState) => void", description: "Stream solver internals: widths, ranges, remaining space…" },
    ],
  },
];

export function ApiReference() {
  return (
    <div className="space-y-8">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="mb-3 text-sm font-semibold tracking-tight">{group.title}</h3>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Prop</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Default</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.name} className="border-b last:border-b-0">
                    <td className="px-4 py-2.5 align-top font-mono text-xs whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-4 py-2.5 align-top font-mono text-xs text-muted-foreground">
                      {row.type}
                    </td>
                    <td className="px-4 py-2.5 align-top font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {row.defaultValue ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 align-top text-xs text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

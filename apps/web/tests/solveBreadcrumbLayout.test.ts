import assert from "node:assert/strict";
import {
  getLayoutRange,
  getLayoutRanges,
  solveBreadcrumbLayout,
} from "../src/components/responsive/solveBreadcrumbLayout";
import type { CollapsePreference, CollapseStrategy } from "../src/components/responsive/types";

function solve({
  availableWidth,
  strategy = "center",
  preference = "minimize-count",
  itemWidths = [40, 50, 60, 70],
  separatorWidths = [10, 10, 10],
  canCollapse = [false, true, true, false],
  forcedCollapsed,
}: {
  availableWidth: number;
  strategy?: CollapseStrategy;
  preference?: CollapsePreference;
  itemWidths?: number[];
  separatorWidths?: number[];
  canCollapse?: boolean[];
  forcedCollapsed?: boolean[];
}) {
  return solveBreadcrumbLayout({
    availableWidth,
    itemWidths,
    separatorWidths,
    ellipsisWidth: 20,
    nextArrowWidth: 0,
    titleOnlyWidth: 35,
    gapWidth: 0,
    options: {
      strategy,
      preference,
      canCollapse,
      forcedCollapsed,
      alwaysShowHead: 1,
      alwaysShowTail: 1,
      allowTitleOnly: true,
    },
  });
}

assert.equal(
  solve({ availableWidth: 250 }).filter((node) => node.type === "item").length,
  4,
  "shows all items when they fit",
);

assert.deepEqual(
  getLayoutRange(solve({ availableWidth: 190, strategy: "center" })),
  { a: 1, b: 2 },
  "collapses a contiguous center range when needed",
);

assert.deepEqual(
  getLayoutRange(solve({ availableWidth: 220, strategy: "start" })),
  { a: 1, b: 1 },
  "start strategy collapses from the first collapsible item",
);

assert.equal(
  getLayoutRange(
    solve({
      availableWidth: 255,
      itemWidths: [40, 50, 60, 50, 40],
      separatorWidths: [10, 10, 10, 10],
      canCollapse: [false, true, false, true, false],
      strategy: "start",
    }),
  )?.b,
  1,
  "does not cross non-collapsible items",
);

assert.deepEqual(
  solve({ availableWidth: 20 }).map((node) => node.type),
  ["title-only"],
  "falls back to title-only when no collapsed range fits",
);

assert.deepEqual(
  getLayoutRange(
    solve({
      availableWidth: 1_000,
      itemWidths: [40, 40, 40, 40],
      separatorWidths: [5, 5, 5],
      forcedCollapsed: [false, false, true, false],
    }),
  ),
  { a: 2, b: 2 },
  "forceCollapse pre-collapses matching items even when the full breadcrumb fits",
);

assert.deepEqual(
  solve({ availableWidth: 190, strategy: "none" }).map((node) => node.type),
  ["title-only"],
  "strategy=none does not collapse when the full breadcrumb overflows",
);

const multiEllipsis = solveBreadcrumbLayout({
  availableWidth: 235,
  itemWidths: [40, 70, 40, 70, 40],
  separatorWidths: [10, 10, 10, 10],
  ellipsisWidth: 20,
  nextArrowWidth: 0,
  titleOnlyWidth: 35,
  gapWidth: 0,
  options: {
    strategy: "center",
    preference: "minimize-count",
    canCollapse: [false, true, false, true, false],
    alwaysShowHead: 1,
    alwaysShowTail: 1,
    allowTitleOnly: true,
    allowMultipleEllipses: true,
    grouping: "free",
  },
});

assert.deepEqual(
  getLayoutRanges(multiEllipsis),
  [
    { a: 1, b: 1 },
    { a: 3, b: 3 },
  ],
  "allowMultipleEllipses can collapse separated collapsible items without crossing fixed items",
);

const forcedMultiEllipsis = solveBreadcrumbLayout({
  availableWidth: 1_000,
  itemWidths: [40, 40, 40, 40, 40],
  separatorWidths: [5, 5, 5, 5],
  ellipsisWidth: 20,
  nextArrowWidth: 0,
  titleOnlyWidth: 35,
  gapWidth: 0,
  options: {
    strategy: "center",
    preference: "minimize-count",
    canCollapse: [false, true, true, true, false],
    forcedCollapsed: [false, true, false, true, false],
    alwaysShowHead: 1,
    alwaysShowTail: 1,
    allowTitleOnly: true,
    allowMultipleEllipses: true,
    grouping: "free",
  },
});

assert.deepEqual(
  getLayoutRanges(forcedMultiEllipsis),
  [
    { a: 1, b: 1 },
    { a: 3, b: 3 },
  ],
  "forceCollapse keeps non-contiguous forced items as separate ellipses when multi-ellipsis is enabled",
);

console.log("solveBreadcrumbLayout tests passed");

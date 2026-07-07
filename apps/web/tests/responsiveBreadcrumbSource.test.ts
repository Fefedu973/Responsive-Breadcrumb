import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const responsiveDir = new URL("../src/components/responsive/", import.meta.url);

function readSource(fileName: string) {
  return readFileSync(new URL(fileName, responsiveDir), "utf8");
}

const renderer = readSource("BreadcrumbRenderer.tsx");
const component = readSource("ResponsiveBreadcrumb.tsx");
const measurements = readSource("useBreadcrumbMeasurements.ts");
const types = readSource("types.ts");

assert.match(
  component,
  /mode="measure"[\s\S]*layout=\{fullMeasurementLayout\}[\s\S]*measurementScope="full"/,
  "full measurement layout is rendered by BreadcrumbRenderer",
);

assert.match(
  component,
  /mode="measure"[\s\S]*layout=\{ellipsisMeasurementLayout\}[\s\S]*measurementScope="ellipsis"/,
  "ellipsis measurement layout is rendered by BreadcrumbRenderer",
);

assert.match(
  component,
  /mode="measure"[\s\S]*layout=\{titleOnlyMeasurementLayout\}[\s\S]*measurementScope="title-only"/,
  "title-only measurement layout is rendered by BreadcrumbRenderer",
);

assert.match(
  component,
  /mode="measure"[\s\S]*layout=\{fullMeasurementLayout\}[\s\S]*measurementScope="compact"/,
  "compact token measurement layout is rendered by BreadcrumbRenderer",
);

assert.match(
  measurements,
  /querySelector<HTMLElement>\('\[data-measure-list="full"\]'\)/,
  "measurement gap is read from the full BreadcrumbList",
);

assert.match(
  renderer,
  /data-measure-item=\{\s*isMeasure && measurementScope === "full" \? index : undefined\s*\}/,
  "item measurements are scoped to the full measurement layout",
);

assert.match(
  renderer,
  /data-measure-ellipsis=\{\s*isMeasure && measurementScope === "ellipsis" \? "" : undefined\s*\}/,
  "ellipsis measurement is scoped to the ellipsis measurement layout",
);

assert.match(
  renderer,
  /data-measure-next=\{\s*isMeasure && measurementScope === "full" \? "" : undefined\s*\}/,
  "next-arrow measurement is scoped to the full measurement layout",
);

assert.match(
  renderer,
  /data-measure-title-only=\{\s*isMeasure && measurementScope === "title-only" \? "" : undefined\s*\}/,
  "title-only measurement is scoped to the title-only measurement layout",
);

assert.match(
  renderer,
  /data-measure-compact-token=\{\s*isMeasure && measurementScope === "compact" \? index : undefined\s*\}/,
  "compact token measurements are scoped to the compact measurement layout",
);

assert.match(
  measurements,
  /const compactTokenWidths = readIndexedWidths\(\s*measureRoot,\s*"measureCompactToken",\s*\);/,
  "compact token widths are measured from real renderer output",
);

assert.match(
  component,
  /const validOverlayIds = React\.useMemo/,
  "valid overlay ids are derived from the current layout",
);

assert.match(
  component,
  /if \(openOverlay && !validOverlayIds\.has\(openOverlay\)\) \{\s*setOpenOverlay\(null\);/,
  "stale overlay ids are cleared when the layout changes",
);

assert.match(
  component,
  /getLayoutWidth\(untruncatedFullLayout, measurements\.gap\) >\s*measurements\.containerWidth/,
  "truncation is attempted before collapse when the full layout overflows",
);

assert.doesNotMatch(
  component,
  /untruncatedLayout\.some\(\(node\) => node\.type === "title-only"\)/,
  "truncation is not delayed until after title-only fallback",
);

assert.match(types, /renderMenuItem\?:/, "renderMenuItem is part of the public API");
assert.match(
  renderer,
  /renderMenuItem\?\.\(\{ item, mode: "menu", disabled \}\)/,
  "menu overlays use renderMenuItem when provided",
);

assert.match(types, /truncationMode\?: BreadcrumbTruncationMode;/, "truncationMode is public API");
assert.match(types, /compactReveal\?: BreadcrumbCompactRevealOptions;/, "compactReveal is public API");
assert.match(types, /selectedRing\?: BreadcrumbSelectedRing;/, "selectedRing is public API");
assert.match(types, /animateLayout\?: BreadcrumbAnimation;/, "animateLayout is public API");
assert.match(
  renderer,
  /function PathStartEndLabel/,
  "path-start-end labels are rendered by the renderer",
);
assert.match(
  renderer,
  /function CompactItemContent/,
  "compact reveal tokens are rendered by the renderer",
);

assert.match(
  renderer,
  /function useAnimatedBreadcrumbNodes/,
  "animateLayout presence keeps removed layout nodes rendered during exit",
);

assert.match(
  renderer,
  /function getLayoutNodeKey/,
  "animated layout nodes use stable keys",
);

assert.match(
  renderer,
  /animatePresence && "\[gap:0\]"/,
  "presence animation disables parent flex gap",
);

assert.match(
  renderer,
  /marginInlineEnd: isLast \|\| inactive \? 0 : gapWidth/,
  "presence animation animates node spacing instead of snapping flex gap",
);

assert.match(
  renderer,
  /phase: "exiting",\s*width: 0/,
  "removed nodes shrink to zero before unmount",
);

assert.match(
  component,
  /gapWidth=\{measurements\.gap\}/,
  "renderer receives the measured gap for animated spacing",
);

assert.match(
  renderer,
  /const revealIndex = node\.after;/,
  "separator compact reveal targets the item to the left of the separator",
);

assert.match(
  renderer,
  /data-compact-reveal-target=\{revealIndex\}/,
  "separators expose the compact reveal target index",
);

assert.match(
  renderer,
  /renderDecorativeSeparator\(\{[\s\S]*revealProps,/,
  "decorative separators receive compact reveal handlers",
);

assert.match(
  renderer,
  /function composeHandlers/,
  "custom separator handlers are composed instead of replaced",
);

assert.match(
  renderer,
  /window\.setTimeout\(\(\) => \{[\s\S]*onCompactRevealIndexChange\(null\);[\s\S]*\}, 60\)/,
  "compact reveal clear is delayed to avoid item-to-separator flicker",
);

assert.match(
  component,
  /const protectedRevealIndex =\s*truncationMode === "compact-reveal" \? compactRevealIndex : null;/,
  "compact reveal computes a protected layout index",
);

assert.match(
  component,
  /if \(index === protectedRevealIndex\) \{\s*return false;\s*\}[\s\S]*return getCanCollapse/,
  "compact reveal target is temporarily non-collapsible",
);

assert.match(
  component,
  /if \(index === protectedRevealIndex\) \{\s*return false;\s*\}[\s\S]*return forceCollapse\?\.\(item, index\) \?\? false;/,
  "compact reveal target cannot be force-collapsed while revealed",
);

assert.match(
  component,
  /data-breadcrumb-renderer="visible"[\s\S]*data-breadcrumb-item-index/,
  "selected overlay ring tracks visible breadcrumb items outside the clipped list",
);

console.log("responsive breadcrumb source tests passed");

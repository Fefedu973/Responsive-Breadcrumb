"use client";

import * as React from "react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { cn } from "@/lib/utils";
import { BreadcrumbRenderer } from "./BreadcrumbRenderer";
import {
  getLayoutRange,
  getLayoutRanges,
  getLayoutWidth,
  solveBreadcrumbLayout,
} from "./solveBreadcrumbLayout";
import type {
  BreadcrumbData,
  BreadcrumbDebugState,
  LayoutNode,
  ResponsiveBreadcrumbProps,
  ResponsiveBreadcrumbStrings,
} from "./types";
import { useBreadcrumbMeasurements } from "./useBreadcrumbMeasurements";

const DEFAULT_STRINGS: ResponsiveBreadcrumbStrings = {
  navigateTo: (label) => `Navigate to ${label}`,
  showCollapsedItems: (count) =>
    count === 1
      ? "Show collapsed breadcrumb item"
      : `Show ${count} collapsed breadcrumb items`,
  moreOptions: "More options",
  nextItems: "Next items",
  showSiblingItems: (label) => `Show navigation options for ${label}`,
  noItemsAvailable: "No items available",
  itemLabelFallback: "item",
  truncatedItemTooltip: (label) => label,
  measureEllipsis: "Measure ellipsis",
  measureNextItems: "Measure next items",
};

export function ResponsiveBreadcrumb({
  items,
  renderSeparator,
  renderItem,
  renderEllipsis,
  renderTitleOnly,
  strategy = "start",
  preference = "none",
  showHomeIcon = true,
  showNextArrow = false,
  nextItems = [],
  separatorNavItems = {},
  onItemClick,
  className,
  titleOnlyFallback,
  titleOnlyIcon,
  titleOnlyCustomElement,
  debug = false,
  onDebugStateChange,
  enableTruncation = false,
  truncateMinWidth = 60,
  truncateMaxWidth = 200,
  truncateThreshold = 100,
  truncateOrder = "biggest-first",
  showTooltipOnTruncate = true,
  allowMultipleEllipses = false,
  grouping = "contiguous",
  showCurrentInNav = "never",
  loadingFallback = "none",
  customLoadingFallback,
  customEllipsisElement,
  isLoading = false,
  lockOnOverlayOpen = true,
  overflowBehavior = "collapse",
  fallbackAtWidth,
  lastItemClickable = false,
  schema = "json-ld",
  showCollapsedCount = false,
  strings,
  clickableLeftOfEllipsis = false,
  separatorNavSide = "right",
  forceCollapse,
  itemPriority,
  direction = "auto",
  alwaysShow,
}: ResponsiveBreadcrumbProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const measureRef = React.useRef<HTMLOListElement | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [openOverlay, setOpenOverlay] = React.useState<string | null>(null);
  const [detectedDirection, setDetectedDirection] = React.useState<"ltr" | "rtl">(
    "ltr",
  );

  const measurementLocked = lockOnOverlayOpen && openOverlay !== null;
  const isRtl =
    direction === "rtl" || (direction === "auto" && detectedDirection === "rtl");
  const headCount = alwaysShow?.head ?? 1;
  const tailCount = alwaysShow?.tail ?? 1;
  const includeNextArrow = showNextArrow && nextItems.length > 0;
  const resolvedStrings = React.useMemo(
    () => ({ ...DEFAULT_STRINGS, ...strings }),
    [strings],
  );
  const resolvedTitleOnlyFallback = React.useMemo(() => {
    if (isLoading && loadingFallback === "custom" && customLoadingFallback) {
      return customLoadingFallback;
    }

    if (isLoading && loadingFallback === "title") {
      return titleOnlyFallback ?? items.at(-1)?.label ?? "";
    }

    return titleOnlyFallback ?? items.at(-1)?.label ?? "";
  }, [
    customLoadingFallback,
    isLoading,
    items,
    loadingFallback,
    titleOnlyFallback,
  ]);
  const measurements = useBreadcrumbMeasurements({
    containerRef,
    measureRef,
    locked: measurementLocked,
  });
  const itemWidths = React.useMemo(
    () => normalizeMeasuredWidths(measurements.itemWidths, items.length),
    [items.length, measurements.itemWidths],
  );
  const separatorWidths = React.useMemo(
    () =>
      normalizeMeasuredWidths(
        measurements.separatorWidths,
        Math.max(0, items.length - 1),
      ),
    [items.length, measurements.separatorWidths],
  );
  const hasCurrentMeasurements =
    measurements.ready &&
    measurements.itemWidths.length === items.length &&
    measurements.separatorWidths.length === Math.max(0, items.length - 1);

  React.useEffect(() => {
    if (direction !== "auto") {
      return;
    }

    const root = document.documentElement;
    const computedDirection = window.getComputedStyle(root).direction;
    setDetectedDirection(computedDirection === "rtl" ? "rtl" : "ltr");
  }, [direction]);

  const untruncatedFullLayout = React.useMemo(
    () =>
      buildFullLayout({
        items,
        itemWidths,
        separatorWidths,
        includeNextArrow,
        nextArrowWidth: measurements.nextArrowWidth,
      }),
    [
      includeNextArrow,
      items,
      itemWidths,
      measurements.nextArrowWidth,
      separatorWidths,
    ],
  );

  const buildLayoutForWidths = React.useCallback(
    (itemWidths: number[], fullLayoutForWidths: LayoutNode[]) => {
      if (items.length === 0) {
        return [];
      }

      if (isLoading && loadingFallback === "custom" && customLoadingFallback) {
        return titleOnlyLayout(measurements.titleOnlyWidth);
      }

      if (isLoading && loadingFallback === "title") {
        return titleOnlyLayout(measurements.titleOnlyWidth);
      }

      if (overflowBehavior !== "collapse") {
        return fullLayoutForWidths;
      }

      if (!hasCurrentMeasurements) {
        return titleOnlyLayout(measurements.titleOnlyWidth);
      }

      if (
        typeof fallbackAtWidth === "number" &&
        measurements.containerWidth <= fallbackAtWidth
      ) {
        return titleOnlyLayout(measurements.titleOnlyWidth);
      }

      return solveBreadcrumbLayout({
        availableWidth: measurements.containerWidth,
        itemWidths,
        separatorWidths,
        ellipsisWidth: measurements.ellipsisWidth,
        nextArrowWidth: measurements.nextArrowWidth,
        titleOnlyWidth: measurements.titleOnlyWidth,
        gapWidth: measurements.gap,
        includeNextArrow,
        options: {
          strategy,
          preference,
          canCollapse: items.map((item, index) =>
            getCanCollapse(item, index, items.length),
          ),
          forcedCollapsed: items.map((item, index) =>
            forceCollapse?.(item, index) ?? false,
          ),
          itemPriority: itemPriority
            ? items.map((item, index) => itemPriority(item, index))
            : undefined,
          alwaysShowHead: headCount,
          alwaysShowTail: tailCount,
          allowTitleOnly: true,
          allowMultipleEllipses,
          grouping,
        },
      });
    },
    [
      allowMultipleEllipses,
      customLoadingFallback,
      fallbackAtWidth,
      forceCollapse,
      grouping,
      hasCurrentMeasurements,
      headCount,
      includeNextArrow,
      isLoading,
      itemPriority,
      items,
      loadingFallback,
      measurements.containerWidth,
      measurements.ellipsisWidth,
      measurements.gap,
      measurements.nextArrowWidth,
      measurements.titleOnlyWidth,
      overflowBehavior,
      preference,
      separatorWidths,
      strategy,
      tailCount,
    ],
  );

  const untruncatedLayout = React.useMemo(
    () => buildLayoutForWidths(itemWidths, untruncatedFullLayout),
    [buildLayoutForWidths, itemWidths, untruncatedFullLayout],
  );

  const titleOnlyForcedByLoading =
    isLoading &&
    (loadingFallback === "title" ||
      (loadingFallback === "custom" && Boolean(customLoadingFallback)));
  const titleOnlyForcedByWidth =
    typeof fallbackAtWidth === "number" &&
    measurements.containerWidth <= fallbackAtWidth;
  const shouldTryTruncation =
    enableTruncation &&
    overflowBehavior === "collapse" &&
    hasCurrentMeasurements &&
    !titleOnlyForcedByLoading &&
    !titleOnlyForcedByWidth &&
    untruncatedLayout.some((node) => node.type === "title-only");

  const truncation = React.useMemo(
    () =>
      computeTruncation({
        items,
        itemWidths,
        separatorWidths,
        availableWidth: measurements.containerWidth,
        gapWidth: measurements.gap,
        includeNextArrow,
        nextArrowWidth: measurements.nextArrowWidth,
        enabled: shouldTryTruncation,
        truncateMinWidth,
        truncateMaxWidth,
        truncateThreshold,
        truncateOrder,
      }),
    [
      includeNextArrow,
      items,
      itemWidths,
      measurements.containerWidth,
      measurements.gap,
      measurements.nextArrowWidth,
      separatorWidths,
      shouldTryTruncation,
      truncateMaxWidth,
      truncateMinWidth,
      truncateOrder,
      truncateThreshold,
    ],
  );

  const fullLayout = React.useMemo(
    () =>
      buildFullLayout({
        items,
        itemWidths: truncation.itemWidths,
        separatorWidths,
        includeNextArrow,
        nextArrowWidth: measurements.nextArrowWidth,
      }),
    [
      includeNextArrow,
      items,
      measurements.nextArrowWidth,
      separatorWidths,
      truncation.itemWidths,
    ],
  );

  const hasTruncatedItems = Object.keys(truncation.truncatedWidths).length > 0;
  const layout = React.useMemo<LayoutNode[]>(() => {
    if (!shouldTryTruncation || !hasTruncatedItems) {
      return untruncatedLayout;
    }

    return buildLayoutForWidths(truncation.itemWidths, fullLayout);
  }, [
    buildLayoutForWidths,
    fullLayout,
    hasTruncatedItems,
    shouldTryTruncation,
    truncation.itemWidths,
    untruncatedLayout,
  ]);

  const schemaJson = React.useMemo(() => {
    if (schema !== "json-ld") {
      return null;
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: primitiveLabel(item.label) || item.key,
        item: item.href,
      })),
    };

    return JSON.stringify(schemaData).replace(/</g, "\\u003c");
  }, [items, schema]);

  React.useEffect(() => {
    if (!debug || !onDebugStateChange) {
      return;
    }

    const collapsedRange = getLayoutRange(layout);
    const collapsedGroups = getLayoutRanges(layout);
    const usedWidth = getLayoutWidth(layout, measurements.gap);
    const visibleItemsCount = layout.filter((node) => node.type === "item").length;
    const collapsedItemsCount = collapsedGroups.reduce(
      (sum, range) => sum + range.b - range.a + 1,
      0,
    );
    const debugState: BreadcrumbDebugState = {
      containerWidth: measurements.containerWidth,
      availableWidth: measurements.containerWidth,
      usedWidth,
      remainingSpace: measurements.containerWidth - usedWidth,
      itemWidths,
      separatorWidths,
      ellipsisWidth: measurements.ellipsisWidth,
      nextArrowWidth: measurements.nextArrowWidth,
      titleOnlyWidth: measurements.titleOnlyWidth,
      gap: measurements.gap,
      collapsedRange,
      collapsedGroups,
      showTitleOnly: layout.some((node) => node.type === "title-only"),
      strategy,
      preference,
      totalItemsCount: items.length,
      visibleItemsCount,
      collapsedItemsCount,
      measurementLocked,
      truncatedItems: truncation.truncatedWidths,
      truncationEnabled: enableTruncation,
    };

    onDebugStateChange(debugState);
  }, [
    debug,
    enableTruncation,
    items.length,
    itemWidths,
    layout,
    measurementLocked,
    measurements.containerWidth,
    measurements.ellipsisWidth,
    measurements.gap,
    measurements.nextArrowWidth,
    measurements.titleOnlyWidth,
    onDebugStateChange,
    preference,
    separatorWidths,
    strategy,
    truncation.truncatedWidths,
  ]);

  const breadcrumb = (
    <BreadcrumbRenderer
      items={items}
      layout={layout}
      mode="visible"
      isMobile={isMobile}
      openOverlay={openOverlay}
      onOpenOverlayChange={setOpenOverlay}
      renderSeparator={renderSeparator}
      renderItem={renderItem}
      renderEllipsis={renderEllipsis}
      renderTitleOnly={renderTitleOnly}
      showHomeIcon={showHomeIcon}
      showNextArrow={showNextArrow}
      nextItems={nextItems}
      separatorNavItems={separatorNavItems}
      onItemClick={onItemClick}
      titleOnlyFallback={resolvedTitleOnlyFallback}
      titleOnlyIcon={titleOnlyIcon}
      titleOnlyCustomElement={titleOnlyCustomElement}
      customEllipsisElement={customEllipsisElement}
      lastItemClickable={lastItemClickable}
      showCollapsedCount={showCollapsedCount}
      strings={resolvedStrings}
      clickableLeftOfEllipsis={clickableLeftOfEllipsis}
      separatorNavSide={separatorNavSide}
      overflowBehavior={overflowBehavior}
      truncatedWidths={truncation.truncatedWidths}
      showTooltipOnTruncate={showTooltipOnTruncate}
      schema={schema}
      showCurrentInNav={showCurrentInNav}
      debug={debug}
      isRtl={isRtl}
    />
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative min-w-0 max-w-full", className)}
      data-responsive-breadcrumb=""
    >
      {schemaJson ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
      ) : null}
      {isLoading && loadingFallback === "none" ? null : overflowBehavior === "scroll" ? (
        <div className="max-w-full overflow-x-auto overflow-y-hidden">
          <div className="min-w-max">{breadcrumb}</div>
        </div>
      ) : (
        breadcrumb
      )}
      <MeasurementTree
        ref={measureRef}
        items={items}
        renderSeparator={renderSeparator}
        renderItem={renderItem}
        renderEllipsis={renderEllipsis}
        renderTitleOnly={renderTitleOnly}
        showHomeIcon={showHomeIcon}
        showNextArrow={showNextArrow}
        nextItemsCount={nextItems.length}
        separatorNavItems={separatorNavItems}
        separatorNavSide={separatorNavSide}
        showCurrentInNav={showCurrentInNav}
        titleOnlyFallback={resolvedTitleOnlyFallback}
        titleOnlyIcon={titleOnlyIcon}
        titleOnlyCustomElement={titleOnlyCustomElement}
        customEllipsisElement={customEllipsisElement}
        showCollapsedCount={showCollapsedCount}
        strings={resolvedStrings}
        isRtl={isRtl}
      />
    </div>
  );
}

export const FinalResponsiveBreadcrumb = ResponsiveBreadcrumb;
export default ResponsiveBreadcrumb;
export type {
  BreadcrumbData,
  BreadcrumbDebugState,
  CollapsePreference,
  CollapseStrategy,
  LayoutNode,
  ResponsiveBreadcrumbProps,
  SeparatorNavItem,
} from "./types";

const MeasurementTree = React.forwardRef<
  HTMLOListElement,
  {
    items: BreadcrumbData[];
    renderSeparator?: ResponsiveBreadcrumbProps["renderSeparator"];
    renderItem?: ResponsiveBreadcrumbProps["renderItem"];
    renderEllipsis?: ResponsiveBreadcrumbProps["renderEllipsis"];
    renderTitleOnly?: ResponsiveBreadcrumbProps["renderTitleOnly"];
    showHomeIcon: boolean;
    showNextArrow: boolean;
    nextItemsCount: number;
    separatorNavItems: NonNullable<ResponsiveBreadcrumbProps["separatorNavItems"]>;
    separatorNavSide: NonNullable<ResponsiveBreadcrumbProps["separatorNavSide"]>;
    showCurrentInNav: NonNullable<ResponsiveBreadcrumbProps["showCurrentInNav"]>;
    titleOnlyFallback: React.ReactNode;
    titleOnlyIcon?: React.ReactNode;
    titleOnlyCustomElement?: React.ReactNode;
    customEllipsisElement?: React.ReactNode;
    showCollapsedCount: boolean;
    strings: ResponsiveBreadcrumbStrings;
    isRtl: boolean;
  }
>(function MeasurementTree(
  {
    items,
    renderSeparator,
    renderItem,
    renderEllipsis,
    renderTitleOnly,
    showHomeIcon,
    showNextArrow,
    nextItemsCount,
    separatorNavItems,
    separatorNavSide,
    showCurrentInNav,
    titleOnlyFallback,
    titleOnlyIcon,
    titleOnlyCustomElement,
    customEllipsisElement,
    showCollapsedCount,
    strings,
    isRtl,
  },
  ref,
) {
  const lastItem = items.at(-1);
  const ellipsisItems = items.slice(1, Math.max(1, items.length - 1));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 -z-10 h-0 max-w-none overflow-hidden opacity-0"
      style={{ contain: "layout style", visibility: "hidden" }}
    >
      <Breadcrumb dir={isRtl ? "rtl" : "ltr"}>
        <BreadcrumbList ref={ref} className="!flex-nowrap whitespace-nowrap">
          {items.map((item, index) => (
            <React.Fragment key={item.key}>
              <BreadcrumbItem
                data-measure-item={index}
                className="min-w-0 max-w-full"
              >
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="inline-flex min-w-0 max-w-none items-center gap-1.5 whitespace-nowrap">
                    {renderItem?.({
                      item,
                      index,
                      mode: "measure",
                      current: true,
                    }) ?? (
                      <MeasurementItemContent
                        item={item}
                        showHomeIcon={showHomeIcon && index === 0}
                      />
                    )}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="inline-flex min-w-0 max-w-none items-center gap-1.5 whitespace-nowrap">
                    {renderItem?.({
                      item,
                      index,
                      mode: "measure",
                      current: false,
                    }) ?? (
                      <MeasurementItemContent
                        item={item}
                        showHomeIcon={showHomeIcon && index === 0}
                      />
                    )}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1
                ? renderMeasuredSeparator({
                    index,
                    previousKey: item.key,
                    nextKey: items[index + 1]?.key ?? "",
                    previousItem: item,
                    nextItem: items[index + 1],
                    renderSeparator,
                    separatorNavItems,
                    separatorNavSide,
                    showCurrentInNav,
                    strings,
                  })
                : null}
            </React.Fragment>
          ))}
          <BreadcrumbItem data-measure-ellipsis="">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8 px-0"
              tabIndex={-1}
              aria-label={resolveLabel(strings.measureEllipsis)}
            >
              {renderEllipsis?.({
                hiddenItems: ellipsisItems,
                mode: "measure",
              }) ??
                customEllipsisElement ?? (
                  <span className="inline-flex items-center gap-1">
                    <MoreHorizontal className="size-4" aria-hidden />
                    {showCollapsedCount ? (
                      <span className="text-[10px]">{ellipsisItems.length}</span>
                    ) : null}
                  </span>
                )}
            </Button>
          </BreadcrumbItem>
          {showNextArrow && nextItemsCount > 0 ? (
            <BreadcrumbItem data-measure-next="">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-8 px-0"
                tabIndex={-1}
                aria-label={resolveLabel(strings.measureNextItems)}
              >
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </BreadcrumbItem>
          ) : null}
          <BreadcrumbItem data-measure-title-only="" className="min-w-0">
            <BreadcrumbPage className="inline-flex min-w-0 max-w-none items-center gap-1.5 whitespace-nowrap">
              {renderTitleOnly?.({
                item: lastItem,
                fallback: titleOnlyFallback,
                mode: "measure",
              }) ?? (
                <>
                  {titleOnlyCustomElement ?? titleOnlyIcon}
                  <span className="min-w-0 truncate">{titleOnlyFallback}</span>
                </>
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
});

function MeasurementItemContent({
  item,
  showHomeIcon,
}: {
  item: BreadcrumbData;
  showHomeIcon: boolean;
}) {
  if (item.measureElement) {
    return <>{item.measureElement}</>;
  }

  if (item.customElement) {
    return <>{item.customElement}</>;
  }

  return (
    <>
      {showHomeIcon ? <Home className="size-4 shrink-0" aria-hidden /> : null}
      {item.icon}
      <span className="min-w-0 truncate">{item.label}</span>
    </>
  );
}

function renderMeasuredSeparator({
  index,
  previousKey,
  nextKey,
  previousItem,
  nextItem,
  renderSeparator,
  separatorNavItems,
  separatorNavSide,
  showCurrentInNav,
  strings,
}: {
  index: number;
  previousKey: string;
  nextKey: string;
  previousItem: BreadcrumbData | undefined;
  nextItem: BreadcrumbData | undefined;
  renderSeparator?: ResponsiveBreadcrumbProps["renderSeparator"];
  separatorNavItems: NonNullable<ResponsiveBreadcrumbProps["separatorNavItems"]>;
  separatorNavSide: NonNullable<ResponsiveBreadcrumbProps["separatorNavSide"]>;
  showCurrentInNav: NonNullable<ResponsiveBreadcrumbProps["showCurrentInNav"]>;
  strings: ResponsiveBreadcrumbStrings;
}) {
  const navItems = getMeasuredSeparatorNavItems({
    separatorNavItems,
    previousItem,
    nextItem,
    separatorNavSide,
    showCurrentInNav,
  });

  if (navItems.length > 0) {
    const anchorItem = separatorNavSide === "left" ? previousItem : nextItem;
    const anchorLabel = primitiveLabel(anchorItem?.label) || anchorItem?.key || "";

    return (
      <BreadcrumbItem data-measure-separator={index}>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-7 text-muted-foreground"
          tabIndex={-1}
          aria-label={resolveLabel(strings.showSiblingItems, anchorLabel)}
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </BreadcrumbItem>
    );
  }

  const rendered = renderSeparator?.(previousKey, nextKey);

  if (React.isValidElement<{ className?: string }>(rendered)) {
    return React.cloneElement(rendered, {
      "data-measure-separator": index,
      className: cn(rendered.props.className),
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <BreadcrumbSeparator data-measure-separator={index}>
      {rendered}
    </BreadcrumbSeparator>
  );
}

function getMeasuredSeparatorNavItems({
  separatorNavItems,
  previousItem,
  nextItem,
  separatorNavSide,
  showCurrentInNav,
}: {
  separatorNavItems: NonNullable<ResponsiveBreadcrumbProps["separatorNavItems"]>;
  previousItem: BreadcrumbData | undefined;
  nextItem: BreadcrumbData | undefined;
  separatorNavSide: NonNullable<ResponsiveBreadcrumbProps["separatorNavSide"]>;
  showCurrentInNav: NonNullable<ResponsiveBreadcrumbProps["showCurrentInNav"]>;
}) {
  const anchorItem = separatorNavSide === "left" ? previousItem : nextItem;

  if (!anchorItem) {
    return [];
  }

  const baseItems =
    separatorNavItems[anchorItem.key] ??
    (previousItem && nextItem
      ? separatorNavItems[`${previousItem.key}:${nextItem.key}`]
      : undefined) ??
    [];
  const shouldIncludeAnchor =
    showCurrentInNav === "always" ||
    (showCurrentInNav === "with-others" && baseItems.length > 0);

  if (!shouldIncludeAnchor || baseItems.some((item) => item.key === anchorItem.key)) {
    return baseItems;
  }

  return [
    {
      key: anchorItem.key,
      label: anchorItem.label,
      href: anchorItem.href,
      icon: anchorItem.icon,
      clickable: anchorItem.clickable,
      disabled: anchorItem.disabled,
    },
    ...baseItems,
  ];
}

function buildFullLayout({
  items,
  itemWidths,
  separatorWidths,
  includeNextArrow,
  nextArrowWidth,
}: {
  items: BreadcrumbData[];
  itemWidths: number[];
  separatorWidths: number[];
  includeNextArrow: boolean;
  nextArrowWidth: number;
}): LayoutNode[] {
  const nodes: LayoutNode[] = [];

  items.forEach((_, index) => {
    nodes.push({ type: "item", index, width: itemWidths[index] ?? 0 });

    if (index < items.length - 1) {
      nodes.push({
        type: "separator",
        after: index,
        width: separatorWidths[index] ?? 0,
      });
    }
  });

  if (includeNextArrow) {
    nodes.push({ type: "next", width: nextArrowWidth });
  }

  return nodes;
}

function computeTruncation({
  items,
  itemWidths,
  separatorWidths,
  availableWidth,
  gapWidth,
  includeNextArrow,
  nextArrowWidth,
  enabled,
  truncateMinWidth,
  truncateMaxWidth,
  truncateThreshold,
  truncateOrder,
}: {
  items: BreadcrumbData[];
  itemWidths: number[];
  separatorWidths: number[];
  availableWidth: number;
  gapWidth: number;
  includeNextArrow: boolean;
  nextArrowWidth: number;
  enabled: boolean;
  truncateMinWidth: number;
  truncateMaxWidth: number;
  truncateThreshold: number;
  truncateOrder: "biggest-first" | "smallest-first";
}) {
  const effectiveItemWidths = itemWidths.map((width) => width ?? 0);
  const truncatedWidths: Record<number, number> = {};

  if (!enabled || items.length === 0) {
    return { itemWidths: effectiveItemWidths, truncatedWidths };
  }

  let overflow =
    getLayoutWidth(
      buildFullLayout({
        items,
        itemWidths: effectiveItemWidths,
        separatorWidths,
        includeNextArrow,
        nextArrowWidth,
      }),
      gapWidth,
    ) - availableWidth;

  if (overflow <= 0) {
    return { itemWidths: effectiveItemWidths, truncatedWidths };
  }

  const minWidth = Math.max(1, truncateMinWidth);
  const maxWidth = Math.max(minWidth, truncateMaxWidth);
  const candidates = items
    .map((item, index) => ({
      item,
      index,
      width: effectiveItemWidths[index] ?? 0,
      canTruncate: getCanTruncate(item, index, items.length),
    }))
    .filter(({ width, canTruncate }) => canTruncate && width > truncateThreshold)
    .sort((left, right) =>
      truncateOrder === "biggest-first"
        ? right.width - left.width
        : left.width - right.width,
    );

  for (const candidate of candidates) {
    if (overflow <= 0) {
      break;
    }

    const targetWidth = Math.max(
      minWidth,
      Math.min(maxWidth, candidate.width - overflow),
    );
    const nextWidth = Math.min(candidate.width, targetWidth);

    if (nextWidth >= candidate.width) {
      continue;
    }

    effectiveItemWidths[candidate.index] = nextWidth;
    truncatedWidths[candidate.index] = nextWidth;
    overflow -= candidate.width - nextWidth;
  }

  return { itemWidths: effectiveItemWidths, truncatedWidths };
}

function titleOnlyLayout(width: number): LayoutNode[] {
  return [{ type: "title-only", width }];
}

function getCanCollapse(item: BreadcrumbData, index: number, count: number) {
  if (item.canCollapse !== undefined) {
    return item.canCollapse;
  }

  return index !== 0 && index !== count - 1;
}

function getCanTruncate(item: BreadcrumbData, index: number, count: number) {
  if (item.canTruncate !== undefined) {
    return item.canTruncate;
  }

  return index !== count - 1;
}

function normalizeMeasuredWidths(widths: number[], length: number) {
  return Array.from({ length }, (_, index) => widths[index] ?? 0);
}

function primitiveLabel(label: React.ReactNode) {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return "";
}

function resolveLabel<TArgs extends unknown[]>(
  label: ResponsiveBreadcrumbStrings[keyof ResponsiveBreadcrumbStrings],
  ...args: TArgs
) {
  return typeof label === "function"
    ? (label as (...args: TArgs) => string)(...args)
    : label;
}

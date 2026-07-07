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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
  BreadcrumbAnimation,
  BreadcrumbData,
  BreadcrumbFocusRing,
  BreadcrumbItemDisplay,
  BreadcrumbPathTruncationOptions,
  LayoutNode,
  MeasurementMode,
  ResponsiveBreadcrumbProps,
  ResponsiveBreadcrumbStrings,
  SeparatorNavItem,
} from "./types";

type OverlayId = string | null;
type NormalizedAnimation = {
  layout: boolean | "position" | "size";
  presence: boolean;
  truncate: boolean;
  duration: number;
};
type AnimatedPhase = "entering" | "present" | "exiting";
type AnimatedBreadcrumbNode = {
  key: string;
  node: LayoutNode;
  phase: AnimatedPhase;
  width: number;
  order: number;
};
type NodeAnimationState = {
  phase: AnimatedPhase;
  width: number;
  duration: number;
  gapWidth: number;
  isLast: boolean;
};

export interface BreadcrumbRendererProps {
  items: BreadcrumbData[];
  layout: LayoutNode[];
  className?: string;
  mode: MeasurementMode;
  isMobile: boolean;
  openOverlay: OverlayId;
  onOpenOverlayChange: (id: OverlayId) => void;
  renderSeparator?: ResponsiveBreadcrumbProps["renderSeparator"];
  renderItem?: ResponsiveBreadcrumbProps["renderItem"];
  renderEllipsis?: ResponsiveBreadcrumbProps["renderEllipsis"];
  renderTitleOnly?: ResponsiveBreadcrumbProps["renderTitleOnly"];
  renderMenuItem?: ResponsiveBreadcrumbProps["renderMenuItem"];
  renderItemLink?: ResponsiveBreadcrumbProps["renderItemLink"];
  renderMenuLink?: ResponsiveBreadcrumbProps["renderMenuLink"];
  showHomeIcon: boolean;
  showNextArrow: boolean;
  nextItems: SeparatorNavItem[];
  separatorNavItems: Record<string, SeparatorNavItem[]>;
  onItemClick?: ResponsiveBreadcrumbProps["onItemClick"];
  titleOnlyFallback: React.ReactNode;
  titleOnlyIcon?: React.ReactNode;
  titleOnlyCustomElement?: React.ReactNode;
  customEllipsisElement?: React.ReactNode;
  lastItemClickable: boolean;
  showCollapsedCount: boolean;
  strings: ResponsiveBreadcrumbStrings;
  clickableLeftOfEllipsis: boolean;
  separatorNavSide: "right" | "left";
  overflowBehavior: "collapse" | "scroll" | "wrap";
  focusRing: BreadcrumbFocusRing;
  gapWidth: number;
  truncatedWidths: Record<number, number>;
  itemDisplays: Record<number, BreadcrumbItemDisplay>;
  pathTruncation?: BreadcrumbPathTruncationOptions;
  compactReveal?: ResponsiveBreadcrumbProps["compactReveal"];
  compactRevealIndex: number | null;
  onCompactRevealIndexChange: (index: number | null) => void;
  animateLayout: BreadcrumbAnimation;
  showTooltipOnTruncate: boolean;
  schema: "json-ld" | "microdata" | "none";
  showCurrentInNav: "never" | "with-others" | "always";
  debug: boolean;
  isRtl: boolean;
  measurementScope?: "full" | "ellipsis" | "title-only" | "compact";
}

export function BreadcrumbRenderer({
  items,
  layout,
  className,
  mode,
  isMobile,
  openOverlay,
  onOpenOverlayChange,
  renderSeparator,
  renderItem,
  renderEllipsis,
  renderTitleOnly,
  renderMenuItem,
  renderItemLink,
  renderMenuLink,
  showHomeIcon,
  showNextArrow,
  nextItems,
  separatorNavItems,
  onItemClick,
  titleOnlyFallback,
  titleOnlyIcon,
  titleOnlyCustomElement,
  customEllipsisElement,
  lastItemClickable,
  showCollapsedCount,
  strings,
  clickableLeftOfEllipsis,
  separatorNavSide,
  overflowBehavior,
  focusRing,
  gapWidth,
  truncatedWidths,
  itemDisplays,
  pathTruncation,
  compactReveal,
  compactRevealIndex,
  onCompactRevealIndexChange,
  animateLayout,
  showTooltipOnTruncate,
  schema,
  showCurrentInNav,
  debug,
  isRtl,
  measurementScope,
}: BreadcrumbRendererProps) {
  const isMeasure = mode === "measure";
  const titleOnlyNode = layout.find((node) => node.type === "title-only");
  const focusRingClass = getFocusRingClass(focusRing);
  const animation = normalizeAnimation(animateLayout);
  const animatePresence = mode === "visible" && animation.presence;
  const animatedNodes = useAnimatedBreadcrumbNodes({
    layout,
    enabled: animatePresence,
    duration: animation.duration,
    itemCount: items.length,
  });
  const compactRevealClearTimerRef = React.useRef<number | null>(null);
  const revealCompactIndex = React.useCallback(
    (index: number) => {
      if (compactRevealClearTimerRef.current !== null) {
        window.clearTimeout(compactRevealClearTimerRef.current);
        compactRevealClearTimerRef.current = null;
      }

      onCompactRevealIndexChange(index);
    },
    [onCompactRevealIndexChange],
  );
  const clearCompactIndexSoon = React.useCallback(
    (index: number) => {
      if (compactRevealClearTimerRef.current !== null) {
        window.clearTimeout(compactRevealClearTimerRef.current);
      }

      compactRevealClearTimerRef.current = window.setTimeout(() => {
        compactRevealClearTimerRef.current = null;

        if (compactRevealIndex === index) {
          onCompactRevealIndexChange(null);
        }
      }, 60);
    },
    [compactRevealIndex, onCompactRevealIndexChange],
  );

  React.useEffect(
    () => () => {
      if (compactRevealClearTimerRef.current !== null) {
        window.clearTimeout(compactRevealClearTimerRef.current);
      }
    },
    [],
  );

  if (titleOnlyNode) {
    return (
      <Breadcrumb
        className={cn("min-w-0 max-w-full", className)}
        dir={isRtl ? "rtl" : "ltr"}
        data-breadcrumb-renderer={mode}
      >
        <BreadcrumbList
          className={cn(
            "!flex-nowrap whitespace-nowrap overflow-hidden",
            debug && "outline outline-1 outline-amber-500/60",
          )}
        >
          <BreadcrumbItem
            data-measure-title-only={
              isMeasure && measurementScope === "title-only" ? "" : undefined
            }
            className="min-w-0 max-w-full"
          >
            <BreadcrumbPage className="inline-flex min-w-0 max-w-full items-center gap-1.5 truncate">
              {renderTitleOnly?.({
                item: items.at(-1),
                fallback: titleOnlyFallback,
                mode,
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
    );
  }

  return (
    <Breadcrumb
      className={cn("min-w-0 max-w-full", className)}
      dir={isRtl ? "rtl" : "ltr"}
      data-breadcrumb-renderer={mode}
    >
      <BreadcrumbList
        className={cn(
          "min-w-0 max-w-full",
          overflowBehavior === "wrap"
            ? "flex-wrap whitespace-normal"
            : "!flex-nowrap whitespace-nowrap",
          overflowBehavior === "collapse" &&
            (focusRing === "clip-margin"
              ? "overflow-clip [overflow-clip-margin:4px]"
              : "overflow-hidden"),
          animatePresence && "[gap:0]",
          debug && "outline outline-1 outline-blue-500/50",
        )}
        {...(schema === "microdata"
          ? {
              itemScope: true,
              itemType: "https://schema.org/BreadcrumbList",
            }
          : {})}
        data-measure-list={
          isMeasure && measurementScope === "full" ? "full" : undefined
        }
      >
        {animatedNodes.map((animatedNode, animatedNodeIndex) => {
          const node = animatedNode.node;
          const targetNodeIndex = layout.findIndex(
            (candidate) => getLayoutNodeKey(candidate) === animatedNode.key,
          );
          const nodeIndex =
            targetNodeIndex >= 0 ? targetNodeIndex : animatedNodeIndex;
          const nodeAnimationState = animatePresence
            ? {
                phase: animatedNode.phase,
                width: animatedNode.width,
                duration: animation.duration,
                gapWidth,
                isLast: animatedNodeIndex === animatedNodes.length - 1,
              }
            : undefined;

          if (node.type === "item") {
            const item = items[node.index];

            if (!item) {
              return null;
            }

            return (
              <RenderedItem
                key={animatedNode.key}
                item={item}
                index={node.index}
                current={node.index === items.length - 1}
                mode={mode}
                isMeasure={isMeasure}
                measurementScope={measurementScope}
                renderItem={renderItem}
                renderItemLink={renderItemLink}
                showHomeIcon={showHomeIcon}
                lastItemClickable={lastItemClickable}
                onItemClick={onItemClick}
                debug={debug}
                truncatedWidth={truncatedWidths[node.index]}
                display={itemDisplays[node.index] ?? { kind: "full" }}
                pathTruncation={pathTruncation}
                compactReveal={compactReveal}
                compactRevealIndex={compactRevealIndex}
                onCompactReveal={revealCompactIndex}
                onCompactRevealClear={clearCompactIndexSoon}
                animation={animation}
                showTooltipOnTruncate={showTooltipOnTruncate}
                schema={schema}
                strings={strings}
                focusRingClass={focusRingClass}
                animationState={nodeAnimationState}
              />
            );
          }

          if (node.type === "separator") {
            return (
              <RenderedSeparator
                key={animatedNode.key}
                node={node}
                layout={layout}
                nodeIndex={nodeIndex}
                items={items}
                mode={mode}
                isMeasure={isMeasure}
                measurementScope={measurementScope}
                isMobile={isMobile}
                openOverlay={openOverlay}
                onOpenOverlayChange={onOpenOverlayChange}
                renderSeparator={renderSeparator}
                separatorNavItems={separatorNavItems}
                onItemClick={onItemClick}
                renderMenuItem={renderMenuItem}
                renderMenuLink={renderMenuLink}
                strings={strings}
                clickableLeftOfEllipsis={clickableLeftOfEllipsis}
                separatorNavSide={separatorNavSide}
                showCurrentInNav={showCurrentInNav}
                debug={debug}
                focusRingClass={focusRingClass}
                animation={animation}
                compactReveal={compactReveal}
                compactRevealIndex={compactRevealIndex}
                onCompactReveal={revealCompactIndex}
                onCompactRevealClear={clearCompactIndexSoon}
                animationState={nodeAnimationState}
              />
            );
          }

          if (node.type === "ellipsis") {
            return (
              <RenderedEllipsis
                key={animatedNode.key}
                node={node}
                items={items}
                mode={mode}
                isMeasure={isMeasure}
                measurementScope={measurementScope}
                isMobile={isMobile}
                openOverlay={openOverlay}
                onOpenOverlayChange={onOpenOverlayChange}
                renderEllipsis={renderEllipsis}
                customEllipsisElement={customEllipsisElement}
                onItemClick={onItemClick}
                renderMenuItem={renderMenuItem}
                renderMenuLink={renderMenuLink}
                showCollapsedCount={showCollapsedCount}
                strings={strings}
                debug={debug}
                focusRingClass={focusRingClass}
                animation={animation}
                animationState={nodeAnimationState}
              />
            );
          }

          if (node.type === "next" && showNextArrow) {
            return (
              <RenderedNext
                key={animatedNode.key}
                nextItems={nextItems}
                mode={mode}
                isMeasure={isMeasure}
                measurementScope={measurementScope}
                isMobile={isMobile}
                openOverlay={openOverlay}
                onOpenOverlayChange={onOpenOverlayChange}
                onItemClick={onItemClick}
                renderMenuItem={renderMenuItem}
                renderMenuLink={renderMenuLink}
                strings={strings}
                debug={debug}
                focusRingClass={focusRingClass}
                animation={animation}
                animationState={nodeAnimationState}
              />
            );
          }

          return null;
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function getFocusRingClass(focusRing: BreadcrumbFocusRing) {
  if (focusRing === "none") {
    return "focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none";
  }

  if (focusRing === "inset") {
    return "outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset";
  }

  return "outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
}

function normalizeAnimation(animation: BreadcrumbAnimation): NormalizedAnimation {
  if (animation === true) {
    return {
      layout: true,
      presence: true,
      truncate: true,
      duration: 150,
    };
  }

  if (!animation) {
    return {
      layout: false,
      presence: false,
      truncate: false,
      duration: 0,
    };
  }

  return {
    layout: animation.layout ?? true,
    presence: animation.presence ?? true,
    truncate: animation.truncate ?? true,
    duration: animation.duration ?? 150,
  };
}

function getAnimationClass(animation: NormalizedAnimation, kind: "item" | "presence") {
  if (
    (kind === "item" && !animation.layout && !animation.truncate) ||
    (kind === "presence" && !animation.presence)
  ) {
    return "";
  }

  return kind === "item"
    ? "transition-[max-width,width,opacity,transform] ease-out motion-reduce:transition-none"
    : "transition-[opacity,transform] ease-out motion-reduce:transition-none";
}

function getAnimationStyle(animation: NormalizedAnimation) {
  return animation.duration > 0
    ? ({ transitionDuration: `${animation.duration}ms` } satisfies React.CSSProperties)
    : undefined;
}

function useAnimatedBreadcrumbNodes({
  layout,
  enabled,
  duration,
  itemCount,
}: {
  layout: LayoutNode[];
  enabled: boolean;
  duration: number;
  itemCount: number;
}) {
  const targetNodes = React.useMemo(
    () => layout.map((node) => toAnimatedNode(node, itemCount, "present")),
    [itemCount, layout],
  );
  const targetSignature = React.useMemo(
    () =>
      targetNodes
        .map((node) => `${node.key}:${getLayoutNodeWidth(node.node)}`)
        .join("|"),
    [targetNodes],
  );
  const [renderNodes, setRenderNodes] =
    React.useState<AnimatedBreadcrumbNode[]>(targetNodes);

  React.useLayoutEffect(() => {
    if (!enabled) {
      setRenderNodes(targetNodes);
      return;
    }

    const targetByKey = new Map(targetNodes.map((node) => [node.key, node]));

    setRenderNodes((previousNodes) => {
      const previousByKey = new Map(
        previousNodes.map((node) => [node.key, node]),
      );
      const merged: AnimatedBreadcrumbNode[] = [];

      for (const previousNode of previousNodes) {
        const targetNode = targetByKey.get(previousNode.key);

        if (targetNode) {
          merged.push({
            ...previousNode,
            node: targetNode.node,
            phase: "present",
            width: targetNode.width,
            order: targetNode.order,
          });
        } else {
          merged.push({
            ...previousNode,
            phase: "exiting",
            width: 0,
          });
        }
      }

      for (const targetNode of targetNodes) {
        if (!previousByKey.has(targetNode.key)) {
          merged.push({
            ...targetNode,
            phase: "entering",
            width: 0,
          });
        }
      }

      return merged.sort((left, right) => left.order - right.order);
    });

    const frame = window.requestAnimationFrame(() => {
      setRenderNodes((previousNodes) =>
        previousNodes.map((node) => {
          const targetNode = targetByKey.get(node.key);

          if (!targetNode) {
            return node;
          }

          return {
            ...node,
            node: targetNode.node,
            phase: "present",
            width: targetNode.width,
            order: targetNode.order,
          };
        }),
      );
    });

    const timeout = window.setTimeout(() => {
      setRenderNodes((previousNodes) =>
        previousNodes.filter((node) => node.phase !== "exiting"),
      );
    }, duration + 50);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [duration, enabled, targetNodes, targetSignature]);

  return enabled ? renderNodes : targetNodes;
}

function getLayoutNodeKey(node: LayoutNode) {
  switch (node.type) {
    case "item":
      return `item:${node.index}`;
    case "separator":
      return `separator:${node.after}`;
    case "ellipsis":
      return `ellipsis:${node.from}:${node.to}`;
    case "next":
      return "next";
    case "title-only":
      return "title-only";
  }
}

function getLayoutNodeOrder(node: LayoutNode, itemCount: number) {
  switch (node.type) {
    case "item":
      return node.index * 2;
    case "separator":
      return node.after * 2 + 1;
    case "ellipsis":
      return ((node.from + node.to) / 2) * 2;
    case "next":
      return itemCount * 2 + 2;
    case "title-only":
      return -1;
  }
}

function getLayoutNodeWidth(node: LayoutNode) {
  return Math.ceil(node.width ?? 0);
}

function toAnimatedNode(
  node: LayoutNode,
  itemCount: number,
  phase: AnimatedBreadcrumbNode["phase"],
  width = getLayoutNodeWidth(node),
): AnimatedBreadcrumbNode {
  return {
    key: getLayoutNodeKey(node),
    node,
    phase,
    width,
    order: getLayoutNodeOrder(node, itemCount),
  };
}

function getNodeAnimationStyle(
  animationState?: NodeAnimationState,
): React.CSSProperties | undefined {
  if (!animationState) {
    return undefined;
  }

  const { phase, width, duration, gapWidth, isLast } = animationState;
  const inactive = phase === "exiting" || phase === "entering";

  return {
    width,
    maxWidth: width,
    flexBasis: width,
    marginInlineEnd: isLast || inactive ? 0 : gapWidth,
    opacity: inactive ? 0 : 1,
    overflow: "hidden",
    transform: phase === "exiting" ? "scale(0.96)" : "scale(1)",
    transitionDuration: `${duration}ms`,
    transitionProperty:
      "width,max-width,flex-basis,margin-inline-end,opacity,transform",
    transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
    willChange: "width,max-width,flex-basis,margin-inline-end,opacity,transform",
  };
}

function mergeStyles(
  ...styles: Array<React.CSSProperties | undefined>
): React.CSSProperties | undefined {
  const merged = Object.assign({}, ...styles.filter(Boolean));
  return Object.keys(merged).length > 0 ? merged : undefined;
}

function getDisplayWidth(display: BreadcrumbItemDisplay) {
  if (display.kind === "width" || display.kind === "path-start-end") {
    return display.width;
  }

  if (display.kind === "compact") {
    return display.tokenWidth;
  }

  return undefined;
}

function getCompactRevealProps({
  index,
  enabled,
  revealOn,
  currentIndex,
  onReveal,
  onClear,
}: {
  index: number;
  enabled: boolean;
  revealOn: NonNullable<
    NonNullable<ResponsiveBreadcrumbProps["compactReveal"]>["revealOn"]
  >;
  currentIndex: number | null;
  onReveal: (index: number) => void;
  onClear: (index: number) => void;
}) {
  if (!enabled) {
    return {};
  }

  const clear = () => {
    if (currentIndex === index) {
      onClear(index);
    }
  };

  return {
    onMouseEnter:
      revealOn === "hover" || revealOn === "both"
        ? () => onReveal(index)
        : undefined,
    onMouseLeave:
      revealOn === "hover" || revealOn === "both" ? clear : undefined,
    onFocus:
      revealOn === "focus" || revealOn === "both"
        ? () => onReveal(index)
        : undefined,
    onBlur: revealOn === "focus" || revealOn === "both" ? clear : undefined,
  };
}

function RenderedItem({
  item,
  index,
  current,
  mode,
  isMeasure,
  measurementScope,
  renderItem,
  renderItemLink,
  showHomeIcon,
  lastItemClickable,
  onItemClick,
  debug,
  truncatedWidth,
  display,
  pathTruncation,
  compactReveal,
  compactRevealIndex,
  onCompactReveal,
  onCompactRevealClear,
  animation,
  showTooltipOnTruncate,
  schema,
  strings,
  focusRingClass,
  animationState,
}: {
  item: BreadcrumbData;
  index: number;
  current: boolean;
  mode: MeasurementMode;
  isMeasure: boolean;
  measurementScope?: BreadcrumbRendererProps["measurementScope"];
  renderItem?: ResponsiveBreadcrumbProps["renderItem"];
  renderItemLink?: ResponsiveBreadcrumbProps["renderItemLink"];
  showHomeIcon: boolean;
  lastItemClickable: boolean;
  onItemClick?: ResponsiveBreadcrumbProps["onItemClick"];
  debug: boolean;
  truncatedWidth?: number;
  display: BreadcrumbItemDisplay;
  pathTruncation?: BreadcrumbPathTruncationOptions;
  compactReveal?: ResponsiveBreadcrumbProps["compactReveal"];
  compactRevealIndex: number | null;
  onCompactReveal: (index: number) => void;
  onCompactRevealClear: (index: number) => void;
  animation: NormalizedAnimation;
  showTooltipOnTruncate: boolean;
  schema: "json-ld" | "microdata" | "none";
  strings: ResponsiveBreadcrumbStrings;
  focusRingClass: string;
  animationState?: NodeAnimationState;
}) {
  const interactive = isInteractiveItem(item, current, lastItemClickable);
  const exiting = animationState?.phase === "exiting";
  const isCompact = display.kind === "compact";
  const readableItemLabel = readableLabel(
    item.label,
    resolveLabel(strings.itemLabelFallback),
  );
  const content = isCompact ? (
    <CompactItemContent
      token={compactReveal?.token ?? ".."}
      accessibleLabel={readableItemLabel}
    />
  ) : (
    renderItem?.({ item, index, mode, current }) ?? (
      <ItemContent
        item={item}
        showHomeIcon={showHomeIcon && index === 0}
        mode={mode}
        display={display}
        pathTruncation={pathTruncation}
      />
    )
  );
  const contentWithSchema =
    schema === "microdata" ? <span itemProp="name">{content}</span> : content;
  const displayWidth = getDisplayWidth(display) ?? truncatedWidth;
  const itemStyle = mergeStyles(
    displayWidth ? { maxWidth: `${displayWidth}px` } : undefined,
    getAnimationStyle(animation),
  );
  const revealProps = getCompactRevealProps({
    index,
    enabled: Boolean(compactReveal),
    revealOn: compactReveal?.revealOn ?? "both",
    currentIndex: compactRevealIndex,
    onReveal: onCompactReveal,
    onClear: onCompactRevealClear,
  });
  const itemClassName = cn(
    "inline-flex min-w-0 max-w-full shrink-0 items-center gap-1.5 truncate rounded-md transition-all",
    focusRingClass,
    getAnimationClass(animation, "item"),
  );
  const itemElement = interactive && item.href ? (
    <BreadcrumbLink
      asChild
      className={itemClassName}
      style={itemStyle}
      aria-label={isCompact ? readableItemLabel : undefined}
      data-breadcrumb-item-index={index}
      data-breadcrumb-item-key={item.key}
      tabIndex={exiting ? -1 : undefined}
      {...revealProps}
    >
      {renderItemLink?.({
        item,
        index,
        mode,
        current,
        href: item.href,
        children: contentWithSchema,
        onClick: () => {
          if (!exiting) {
            onItemClick?.(item);
          }
        },
        ariaDisabled: item.disabled,
        itemProp: schema === "microdata" ? "item" : undefined,
      }) ?? (
        <a
          href={item.href}
          tabIndex={exiting ? -1 : undefined}
          onClick={() => {
            if (!exiting) {
              onItemClick?.(item);
            }
          }}
          aria-disabled={item.disabled || undefined}
          itemProp={schema === "microdata" ? "item" : undefined}
        >
          {contentWithSchema}
        </a>
      )}
    </BreadcrumbLink>
  ) : interactive ? (
    <button
      type="button"
      className={cn(
        "hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50",
        itemClassName,
      )}
      style={itemStyle}
      disabled={item.disabled}
      aria-label={isCompact ? readableItemLabel : undefined}
      data-breadcrumb-item-index={index}
      data-breadcrumb-item-key={item.key}
      tabIndex={exiting ? -1 : undefined}
      onClick={() => {
        if (!exiting) {
          onItemClick?.(item);
        }
      }}
      {...revealProps}
    >
      {contentWithSchema}
    </button>
  ) : (
    <BreadcrumbPage
      className={itemClassName}
      style={itemStyle}
      aria-label={isCompact ? readableItemLabel : undefined}
      data-breadcrumb-item-index={index}
      data-breadcrumb-item-key={item.key}
      aria-hidden={exiting ? true : undefined}
      {...revealProps}
    >
      {contentWithSchema}
    </BreadcrumbPage>
  );
  const renderedItem =
    truncatedWidth && showTooltipOnTruncate ? (
      <Tooltip>
        <TooltipTrigger asChild>{itemElement}</TooltipTrigger>
        <TooltipContent>
          {resolveLabel(
            strings.truncatedItemTooltip,
            readableLabel(item.label, resolveLabel(strings.itemLabelFallback)),
          )}
        </TooltipContent>
      </Tooltip>
    ) : (
      itemElement
    );

  return (
    <BreadcrumbItem
      data-measure-item={
        isMeasure && measurementScope === "full" ? index : undefined
      }
      data-measure-compact-token={
        isMeasure && measurementScope === "compact" ? index : undefined
      }
      data-animation-phase={animationState?.phase}
      itemProp={schema === "microdata" ? "itemListElement" : undefined}
      itemScope={schema === "microdata" ? true : undefined}
      itemType={
        schema === "microdata" ? "https://schema.org/ListItem" : undefined
      }
      aria-hidden={exiting ? true : undefined}
      className={cn(
        "min-w-0 max-w-full shrink-0 overflow-hidden",
        exiting && "pointer-events-none",
        debug && "outline outline-1 outline-green-500/60",
      )}
      style={getNodeAnimationStyle(animationState)}
    >
      {renderedItem}
      {schema === "microdata" ? (
        <meta itemProp="position" content={(index + 1).toString()} />
      ) : null}
    </BreadcrumbItem>
  );
}

function ItemContent({
  item,
  showHomeIcon,
  mode,
  display,
  pathTruncation,
}: {
  item: BreadcrumbData;
  showHomeIcon: boolean;
  mode: MeasurementMode;
  display: BreadcrumbItemDisplay;
  pathTruncation?: BreadcrumbPathTruncationOptions;
}) {
  if (mode === "measure" && item.measureElement) {
    return <>{item.measureElement}</>;
  }

  if (item.customElement) {
    return <>{item.customElement}</>;
  }

  return (
    <>
      {showHomeIcon ? <Home className="size-4 shrink-0" aria-hidden /> : null}
      {item.icon}
      {display.kind === "path-start-end" &&
      (typeof item.label === "string" || typeof item.label === "number") ? (
        <PathStartEndLabel
          label={String(item.label)}
          options={pathTruncation}
        />
      ) : (
        <span className="min-w-0 truncate">{item.label}</span>
      )}
      {mode === "measure" ? null : null}
    </>
  );
}

function CompactItemContent({
  token,
  accessibleLabel,
}: {
  token: React.ReactNode;
  accessibleLabel: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center">
      <span aria-hidden="true">{token}</span>
      <span className="sr-only">{accessibleLabel}</span>
    </span>
  );
}

function PathStartEndLabel({
  label,
  options,
}: {
  label: string;
  options?: BreadcrumbPathTruncationOptions;
}) {
  const separator = options?.separator ?? "/";
  const separatorText = typeof separator === "string" ? separator : "/";
  const parts =
    typeof separator === "string" ? label.split(separator) : label.split(separator);

  if (parts.length < 2) {
    return <span className="min-w-0 truncate">{label}</span>;
  }

  const startCount = Math.max(1, options?.preserveStartSegments ?? 1);
  const endCount = Math.max(1, options?.preserveEndSegments ?? 1);
  const start = parts.slice(0, startCount).join(separatorText);
  const end = parts.slice(Math.max(startCount, parts.length - endCount)).join(
    separatorText,
  );
  const startMinWidth = options?.minStartWidth ?? 24;
  const endMinWidth = options?.minEndWidth ?? 48;
  const endPriority = Math.max(1, options?.endPriority ?? 2);

  return (
    <span className="inline-flex min-w-0 max-w-full items-center">
      <span
        className="min-w-0 truncate text-muted-foreground"
        style={{ flex: `1 2 ${startMinWidth}px` }}
      >
        {start}
      </span>
      <span className="px-1 text-muted-foreground" aria-hidden="true">
        {separatorText}
      </span>
      <span
        className="min-w-0 truncate font-medium"
        style={{ flex: `${endPriority} 1 ${endMinWidth}px` }}
      >
        {end}
      </span>
    </span>
  );
}

function RenderedSeparator({
  node,
  layout,
  nodeIndex,
  items,
  mode,
  isMeasure,
  measurementScope,
  isMobile,
  openOverlay,
  onOpenOverlayChange,
  renderSeparator,
  separatorNavItems,
  onItemClick,
  renderMenuItem,
  renderMenuLink,
  strings,
  clickableLeftOfEllipsis,
  separatorNavSide,
  showCurrentInNav,
  debug,
  focusRingClass,
  animation,
  compactReveal,
  compactRevealIndex,
  onCompactReveal,
  onCompactRevealClear,
  animationState,
}: {
  node: Extract<LayoutNode, { type: "separator" }>;
  layout: LayoutNode[];
  nodeIndex: number;
  items: BreadcrumbData[];
  mode: MeasurementMode;
  isMeasure: boolean;
  measurementScope?: BreadcrumbRendererProps["measurementScope"];
  isMobile: boolean;
  openOverlay: OverlayId;
  onOpenOverlayChange: (id: OverlayId) => void;
  renderSeparator?: ResponsiveBreadcrumbProps["renderSeparator"];
  separatorNavItems: Record<string, SeparatorNavItem[]>;
  onItemClick?: ResponsiveBreadcrumbProps["onItemClick"];
  renderMenuItem?: ResponsiveBreadcrumbProps["renderMenuItem"];
  renderMenuLink?: ResponsiveBreadcrumbProps["renderMenuLink"];
  strings: ResponsiveBreadcrumbStrings;
  clickableLeftOfEllipsis: boolean;
  separatorNavSide: "right" | "left";
  showCurrentInNav: "never" | "with-others" | "always";
  debug: boolean;
  focusRingClass: string;
  animation: NormalizedAnimation;
  compactReveal?: ResponsiveBreadcrumbProps["compactReveal"];
  compactRevealIndex: number | null;
  onCompactReveal: (index: number) => void;
  onCompactRevealClear: (index: number) => void;
  animationState?: NodeAnimationState;
}) {
  const previousItem = items[node.after];
  const exiting = animationState?.phase === "exiting";
  const revealIndex = node.after;
  const nextNode = layout[nodeIndex + 1];
  const nextIndex =
    nextNode?.type === "item"
      ? nextNode.index
      : nextNode?.type === "ellipsis"
        ? nextNode.from
        : node.after + 1;
  const nextItem = items[nextIndex];
  const anchorItem = separatorNavSide === "left" ? previousItem : nextItem;
  const leftOfEllipsis = nextNode?.type === "ellipsis";
  const baseNavItems = getSeparatorNavItems(
    separatorNavItems,
    previousItem,
    nextItem,
    separatorNavSide,
  );
  const navItems = withCurrentItem({
    navItems: baseNavItems,
    nextItem: anchorItem,
    showCurrentInNav,
  });
  const interactive =
    navItems.length > 0 &&
    (!leftOfEllipsis || clickableLeftOfEllipsis);
  const revealProps = getCompactRevealProps({
    index: revealIndex,
    enabled: Boolean(compactReveal),
    revealOn: compactReveal?.revealOn ?? "both",
    currentIndex: compactRevealIndex,
    onReveal: onCompactReveal,
    onClear: onCompactRevealClear,
  });

  if (!interactive) {
    return renderDecorativeSeparator({
      previousKey: previousItem?.key ?? "",
      nextKey: nextItem?.key ?? "",
      renderSeparator,
      measureIndex:
        isMeasure && measurementScope === "full" ? node.after : null,
      debug,
      revealIndex,
      revealProps,
      animationState,
    });
  }

  const overlayId = `separator-${anchorItem?.key ?? node.after}`;
  const nextLabel = readableLabel(
    anchorItem?.label,
    resolveLabel(strings.itemLabelFallback),
  );
  const label = resolveLabel(strings.showSiblingItems, nextLabel);

  return (
    <BreadcrumbItem
      data-measure-separator={
        isMeasure && measurementScope === "full" ? node.after : undefined
      }
      data-slot="breadcrumb-interactive-separator"
      data-compact-reveal-target={revealIndex}
      data-animation-phase={animationState?.phase}
      aria-hidden={exiting ? true : undefined}
      className={cn(
        "overflow-hidden",
        exiting && "pointer-events-none",
        debug && "outline outline-1 outline-cyan-500/60",
      )}
      style={getNodeAnimationStyle(animationState)}
      {...revealProps}
    >
      <ResponsiveOverlay
        title={label}
        isMobile={isMobile}
        open={openOverlay === overlayId}
        onOpenChange={(open) => onOpenOverlayChange(open ? overlayId : null)}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "group size-7 text-muted-foreground",
              focusRingClass,
              getAnimationClass(animation, "presence"),
            )}
            style={getAnimationStyle(animation)}
            tabIndex={isMeasure || exiting ? -1 : undefined}
            aria-label={label}
          >
            <ChevronRight
              className="size-4 transition-transform group-data-[state=open]:rotate-90"
              aria-hidden
            />
          </Button>
        }
      >
        <MenuItems
          items={navItems}
          mode={mode}
          compact={!isMobile}
          onItemClick={onItemClick}
          renderMenuItem={renderMenuItem}
          renderMenuLink={renderMenuLink}
          onSelect={() => onOpenOverlayChange(null)}
          strings={strings}
        />
      </ResponsiveOverlay>
    </BreadcrumbItem>
  );
}

function RenderedEllipsis({
  node,
  items,
  mode,
  isMeasure,
  measurementScope,
  isMobile,
  openOverlay,
  onOpenOverlayChange,
  renderEllipsis,
  customEllipsisElement,
  onItemClick,
  renderMenuItem,
  renderMenuLink,
  showCollapsedCount,
  strings,
  debug,
  focusRingClass,
  animation,
  animationState,
}: {
  node: Extract<LayoutNode, { type: "ellipsis" }>;
  items: BreadcrumbData[];
  mode: MeasurementMode;
  isMeasure: boolean;
  measurementScope?: BreadcrumbRendererProps["measurementScope"];
  isMobile: boolean;
  openOverlay: OverlayId;
  onOpenOverlayChange: (id: OverlayId) => void;
  renderEllipsis?: ResponsiveBreadcrumbProps["renderEllipsis"];
  customEllipsisElement?: React.ReactNode;
  onItemClick?: ResponsiveBreadcrumbProps["onItemClick"];
  renderMenuItem?: ResponsiveBreadcrumbProps["renderMenuItem"];
  renderMenuLink?: ResponsiveBreadcrumbProps["renderMenuLink"];
  showCollapsedCount: boolean;
  strings: ResponsiveBreadcrumbStrings;
  debug: boolean;
  focusRingClass: string;
  animation: NormalizedAnimation;
  animationState?: NodeAnimationState;
}) {
  const hiddenItems = items.slice(node.from, node.to + 1);
  const exiting = animationState?.phase === "exiting";
  const overlayId = `ellipsis-${node.from}-${node.to}`;
  const label = resolveLabel(strings.showCollapsedItems, hiddenItems.length);
  const title = resolveLabel(strings.moreOptions);
  const content =
    renderEllipsis?.({ hiddenItems, mode }) ??
    customEllipsisElement ??
    defaultEllipsisContent(hiddenItems.length, showCollapsedCount);

  return (
    <BreadcrumbItem
      data-measure-ellipsis={
        isMeasure && measurementScope === "ellipsis" ? "" : undefined
      }
      data-animation-phase={animationState?.phase}
      aria-hidden={exiting ? true : undefined}
      className={cn(
        "overflow-hidden",
        exiting && "pointer-events-none",
        debug && "outline outline-1 outline-yellow-500/70",
      )}
      style={getNodeAnimationStyle(animationState)}
    >
      <ResponsiveOverlay
        title={title}
        isMobile={isMobile}
        open={openOverlay === overlayId}
        onOpenChange={(open) => onOpenOverlayChange(open ? overlayId : null)}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "size-8 px-0",
              focusRingClass,
              getAnimationClass(animation, "presence"),
            )}
            style={getAnimationStyle(animation)}
            aria-label={label}
            tabIndex={isMeasure || exiting ? -1 : undefined}
          >
            {content}
          </Button>
        }
      >
        <MenuItems
          items={hiddenItems}
          mode={mode}
          compact={!isMobile}
          onItemClick={onItemClick}
          renderMenuItem={renderMenuItem}
          renderMenuLink={renderMenuLink}
          onSelect={() => onOpenOverlayChange(null)}
          strings={strings}
        />
      </ResponsiveOverlay>
    </BreadcrumbItem>
  );
}

function RenderedNext({
  nextItems,
  mode,
  isMeasure,
  measurementScope,
  isMobile,
  openOverlay,
  onOpenOverlayChange,
  onItemClick,
  renderMenuItem,
  renderMenuLink,
  strings,
  debug,
  focusRingClass,
  animation,
  animationState,
}: {
  nextItems: SeparatorNavItem[];
  mode: MeasurementMode;
  isMeasure: boolean;
  measurementScope?: BreadcrumbRendererProps["measurementScope"];
  isMobile: boolean;
  openOverlay: OverlayId;
  onOpenOverlayChange: (id: OverlayId) => void;
  onItemClick?: ResponsiveBreadcrumbProps["onItemClick"];
  renderMenuItem?: ResponsiveBreadcrumbProps["renderMenuItem"];
  renderMenuLink?: ResponsiveBreadcrumbProps["renderMenuLink"];
  strings: ResponsiveBreadcrumbStrings;
  debug: boolean;
  focusRingClass: string;
  animation: NormalizedAnimation;
  animationState?: NodeAnimationState;
}) {
  const overlayId = "next";
  const exiting = animationState?.phase === "exiting";

  return (
    <BreadcrumbItem
      data-measure-next={
        isMeasure && measurementScope === "full" ? "" : undefined
      }
      data-animation-phase={animationState?.phase}
      aria-hidden={exiting ? true : undefined}
      className={cn(
        "overflow-hidden",
        exiting && "pointer-events-none",
        debug && "outline outline-1 outline-purple-500/70",
      )}
      style={getNodeAnimationStyle(animationState)}
    >
      <ResponsiveOverlay
        title={resolveLabel(strings.nextItems)}
        isMobile={isMobile}
        open={openOverlay === overlayId}
        onOpenChange={(open) => onOpenOverlayChange(open ? overlayId : null)}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "group size-8 px-0 text-muted-foreground",
              focusRingClass,
              getAnimationClass(animation, "presence"),
            )}
            style={getAnimationStyle(animation)}
            aria-label={resolveLabel(strings.nextItems)}
            disabled={nextItems.length === 0}
            tabIndex={isMeasure || exiting ? -1 : undefined}
          >
            <ChevronRight
              className="size-4 transition-transform group-data-[state=open]:rotate-90"
              aria-hidden
            />
          </Button>
        }
      >
        <MenuItems
          items={nextItems}
          mode={mode}
          compact={!isMobile}
          onItemClick={onItemClick}
          renderMenuItem={renderMenuItem}
          renderMenuLink={renderMenuLink}
          onSelect={() => onOpenOverlayChange(null)}
          strings={strings}
        />
      </ResponsiveOverlay>
    </BreadcrumbItem>
  );
}

function ResponsiveOverlay({
  title,
  isMobile,
  open,
  onOpenChange,
  trigger,
  children,
}: {
  title: string;
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactElement;
  children: React.ReactNode;
}) {
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-40 max-w-64 p-1">
        {children}
      </PopoverContent>
    </Popover>
  );
}

function MenuItems({
  items,
  mode,
  compact,
  onItemClick,
  renderMenuItem,
  renderMenuLink,
  onSelect,
  strings,
}: {
  items: Array<BreadcrumbData | SeparatorNavItem>;
  mode: MeasurementMode;
  compact: boolean;
  onItemClick?: ResponsiveBreadcrumbProps["onItemClick"];
  renderMenuItem?: ResponsiveBreadcrumbProps["renderMenuItem"];
  renderMenuLink?: ResponsiveBreadcrumbProps["renderMenuLink"];
  onSelect: () => void;
  strings: ResponsiveBreadcrumbStrings;
}) {
  if (items.length === 0) {
    return (
      <p className="px-2 py-3 text-sm text-muted-foreground">
        {resolveLabel(strings.noItemsAvailable)}
      </p>
    );
  }

  return (
    <div className={cn("grid", compact ? "gap-0.5" : "gap-1")}>
      {items.map((item) => {
        const itemLabel = readableLabel(
          item.label,
          resolveLabel(strings.itemLabelFallback),
        );
        const itemAriaLabel = resolveLabel(strings.navigateTo, itemLabel);
        const disabled = item.disabled || item.clickable === false;
        const content = (
          renderMenuItem?.({ item, mode: "menu", disabled }) ?? (
            <>
              {item.icon}
              <span className="min-w-0 truncate">{item.label}</span>
            </>
          )
        );

        if (item.href && !disabled) {
          return (
            <Button
              key={item.key}
              asChild
              variant="ghost"
              className={cn(
                "justify-start",
                compact ? "h-7 px-2 text-sm" : "h-auto px-2 py-2",
              )}
            >
              {renderMenuLink?.({
                item,
                mode,
                href: item.href,
                children: content,
                ariaLabel: itemAriaLabel,
                onClick: () => {
                  onItemClick?.(item);
                  onSelect();
                },
              }) ?? (
                <a
                  href={item.href}
                  aria-label={itemAriaLabel}
                  onClick={() => {
                    onItemClick?.(item);
                    onSelect();
                  }}
                >
                  {content}
                </a>
              )}
            </Button>
          );
        }

        return (
          <Button
            key={item.key}
            type="button"
            variant="ghost"
            className={cn(
              "justify-start",
              compact ? "h-7 px-2 text-sm" : "h-auto px-2 py-2",
            )}
            aria-label={itemAriaLabel}
            disabled={disabled}
            onClick={() => {
              onItemClick?.(item);
              onSelect();
            }}
            tabIndex={mode === "measure" ? -1 : undefined}
          >
            {content}
          </Button>
        );
      })}
    </div>
  );
}

function defaultEllipsisContent(count: number, showCollapsedCount: boolean) {
  return (
    <span className="inline-flex items-center gap-1">
      <MoreHorizontal className="size-4" aria-hidden />
      {showCollapsedCount ? (
        <Badge variant="secondary" className="h-4 px-1 text-[10px]">
          {count}
        </Badge>
      ) : null}
    </span>
  );
}

function renderDecorativeSeparator({
  previousKey,
  nextKey,
  renderSeparator,
  measureIndex,
  debug,
  revealIndex,
  revealProps,
  animationState,
}: {
  previousKey: string;
  nextKey: string;
  renderSeparator?: ResponsiveBreadcrumbProps["renderSeparator"];
  measureIndex: number | null;
  debug: boolean;
  revealIndex: number;
  revealProps: React.HTMLAttributes<HTMLElement>;
  animationState?: NodeAnimationState;
}) {
  const rendered = renderSeparator?.(previousKey, nextKey);
  const debugClassName = debug ? "outline outline-1 outline-slate-500/60" : "";
  const exiting = animationState?.phase === "exiting";
  const animationClassName = cn(
    "overflow-hidden",
    exiting && "pointer-events-none",
  );

  if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(rendered)) {
    return React.cloneElement(rendered, {
      "data-measure-separator": measureIndex ?? undefined,
      "data-compact-reveal-target": revealIndex,
      "data-animation-phase": animationState?.phase,
      "aria-hidden": exiting ? true : rendered.props["aria-hidden"],
      className: cn(rendered.props.className, animationClassName, debugClassName),
      onBlur: composeHandlers(rendered.props.onBlur, revealProps.onBlur),
      onFocus: composeHandlers(rendered.props.onFocus, revealProps.onFocus),
      onMouseEnter: composeHandlers(
        rendered.props.onMouseEnter,
        revealProps.onMouseEnter,
      ),
      onMouseLeave: composeHandlers(
        rendered.props.onMouseLeave,
        revealProps.onMouseLeave,
      ),
      style: mergeStyles(
        rendered.props.style,
        getNodeAnimationStyle(animationState),
      ),
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <BreadcrumbSeparator
      data-measure-separator={measureIndex ?? undefined}
      data-compact-reveal-target={revealIndex}
      data-animation-phase={animationState?.phase}
      aria-hidden={true}
      className={cn(animationClassName, debugClassName)}
      style={getNodeAnimationStyle(animationState)}
      {...revealProps}
    >
      {rendered}
    </BreadcrumbSeparator>
  );
}

function composeHandlers<E extends React.SyntheticEvent>(
  original?: (event: E) => void,
  next?: (event: E) => void,
) {
  if (!original) {
    return next;
  }

  if (!next) {
    return original;
  }

  return (event: E) => {
    original(event);

    if (!event.defaultPrevented) {
      next(event);
    }
  };
}

function getSeparatorNavItems(
  separatorNavItems: Record<string, SeparatorNavItem[]>,
  previousItem: BreadcrumbData | undefined,
  nextItem: BreadcrumbData | undefined,
  side: "right" | "left",
) {
  const anchorItem = side === "left" ? previousItem : nextItem;

  if (!anchorItem) {
    return [];
  }

  return (
    separatorNavItems[anchorItem.key] ??
    (previousItem && nextItem
      ? separatorNavItems[`${previousItem.key}:${nextItem.key}`]
      : undefined) ??
    []
  );
}

function withCurrentItem({
  navItems,
  nextItem,
  showCurrentInNav,
}: {
  navItems: SeparatorNavItem[];
  nextItem: BreadcrumbData | undefined;
  showCurrentInNav: "never" | "with-others" | "always";
}) {
  const shouldInclude =
    nextItem &&
    (showCurrentInNav === "always" ||
      (showCurrentInNav === "with-others" && navItems.length > 0));

  if (!shouldInclude) {
    return navItems;
  }

  if (navItems.some((item) => item.key === nextItem.key)) {
    return navItems;
  }

  return [
    {
      key: nextItem.key,
      label: nextItem.label,
      href: nextItem.href,
      icon: nextItem.icon,
      clickable: nextItem.clickable,
      disabled: nextItem.disabled,
    },
    ...navItems,
  ];
}

function isInteractiveItem(
  item: BreadcrumbData,
  current: boolean,
  lastItemClickable: boolean,
) {
  if (item.disabled || item.clickable === false) {
    return false;
  }

  if (current && !lastItemClickable) {
    return false;
  }

  return item.clickable === true || Boolean(item.href);
}

function readableLabel(label: React.ReactNode, fallback: string) {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return fallback;
}

function resolveLabel<TArgs extends unknown[]>(
  label: ResponsiveBreadcrumbStrings[keyof ResponsiveBreadcrumbStrings],
  ...args: TArgs
) {
  return typeof label === "function"
    ? (label as (...args: TArgs) => string)(...args)
    : label;
}

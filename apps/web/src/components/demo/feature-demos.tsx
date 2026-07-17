"use client";

import * as React from "react";
import {
  FileText,
  HeartPulse,
  ListTodo,
  Slash,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveBreadcrumb,
  type CollapsePreference,
  type CollapseStrategy,
  type BreadcrumbFocusRing,
  type ResponsiveBreadcrumbProps,
  type SeparatorNavItem,
} from "@/components/responsive/ResponsiveBreadcrumb";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Field, Segmented, Stepper, ToggleField } from "./demo-controls";
import { DemoStage } from "./demo-stage";
import { FeatureCard } from "./demo-section";
import {
  arabicPath,
  arabicStrings,
  archivePath,
  adminPath,
  deployPath,
  docsPath,
  filePath,
  geoPath,
  geoSeparatorNav,
  notifyClick,
  productPath,
  seoPath,
  sprintPath,
} from "./scenarios";

export function FeatureGrid() {
  // One card per row: every stage gets the full width, so breadcrumbs can be
  // dragged out far enough to fully unfold.
  return (
    <div className="grid gap-5">
      <StrategyDemo />
      <PreferenceDemo />
      <TruncationDemo />
      <TitleOnlyDemo />
      <MultiEllipsisDemo />
      <TreeNavDemo />
      <NextItemsDemo />
      <PinningDemo />
      <PriorityDemo />
      <OverflowDemo />
      <RtlDemo />
      <LoadingDemo />
      <CustomRenderDemo />
      <SeoFocusDemo />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collapse strategy                                                          */
/* -------------------------------------------------------------------------- */

const STRATEGY_CAPTIONS: Record<CollapseStrategy, string> = {
  start: "Collapses the oldest crumbs first — keeps the user's recent context visible.",
  center: "Collapses the middle — preserves both the root and the current page.",
  end: "Collapses the most recent crumbs — preserves the hierarchy's root.",
  none: "Never collapses — on overflow it jumps straight to the title-only fallback.",
};

function StrategyDemo() {
  const [strategy, setStrategy] = React.useState<CollapseStrategy>("center");

  return (
    <FeatureCard
      title="Collapse strategy"
      description="strategy decides where the ellipsis appears when space runs out."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          ariaLabel="Collapse strategy"
          value={strategy}
          onValueChange={setStrategy}
          options={[
            { value: "start", label: "Start" },
            { value: "center", label: "Center" },
            { value: "end", label: "End" },
            { value: "none", label: "None" },
          ]}
        />
        <p className="text-xs text-muted-foreground">{STRATEGY_CAPTIONS[strategy]}</p>
      </div>
      <DemoStage initialWidth={460}>
        <ResponsiveBreadcrumb
          items={adminPath}
          strategy={strategy}
          showHomeIcon
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Fit preference                                                             */
/* -------------------------------------------------------------------------- */

const PREFERENCE_CAPTIONS: Record<CollapsePreference, string> = {
  none: "Ties between fitting layouts are broken by the strategy alone.",
  "minimize-count": "Hide as few crumbs as possible, even if they are wide.",
  "minimize-visibility": "Hide the least total width — small crumbs stay visible.",
};

function PreferenceDemo() {
  const [preference, setPreference] = React.useState<CollapsePreference>("minimize-count");

  return (
    <FeatureCard
      title="Fit preference"
      description="preference is the tie-breaker when several collapsed layouts fit."
    >
      <Segmented
        ariaLabel="Fit preference"
        value={preference}
        onValueChange={setPreference}
        options={[
          { value: "none", label: "Default" },
          { value: "minimize-count", label: "Min count" },
          { value: "minimize-visibility", label: "Min width" },
        ]}
      />
      <p className="text-xs text-muted-foreground">{PREFERENCE_CAPTIONS[preference]}</p>
      <DemoStage initialWidth={560}>
        <ResponsiveBreadcrumb
          items={productPath}
          strategy="center"
          preference={preference}
          showHomeIcon={false}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Truncation                                                                 */
/* -------------------------------------------------------------------------- */

function TruncationDemo() {
  const [enabled, setEnabled] = React.useState(true);
  const [minWidth, setMinWidth] = React.useState(60);
  const [order, setOrder] = React.useState<"biggest-first" | "smallest-first">(
    "biggest-first",
  );

  return (
    <FeatureCard
      title="Label truncation"
      description="enableTruncation shrinks wide labels before anything gets collapsed."
      hint="Hover a truncated label to read the full text in a tooltip."
    >
      <div className="space-y-3">
        <ToggleField label="Truncate before collapsing" checked={enabled} onCheckedChange={setEnabled} />
        <Field label={`Minimum label width — ${minWidth}px`}>
          <Slider
            value={[minWidth]}
            onValueChange={(values) => setMinWidth(values[0] ?? 60)}
            min={40}
            max={160}
            step={10}
            disabled={!enabled}
          />
        </Field>
        <Field label="Truncation order">
          <Segmented
            ariaLabel="Truncation order"
            value={order}
            onValueChange={setOrder}
            options={[
              { value: "biggest-first", label: "Biggest first" },
              { value: "smallest-first", label: "Smallest first" },
            ]}
          />
        </Field>
      </div>
      <DemoStage initialWidth={430}>
        <ResponsiveBreadcrumb
          items={productPath}
          strategy="center"
          showHomeIcon={false}
          enableTruncation={enabled}
          truncateMinWidth={minWidth}
          truncateThreshold={80}
          truncateOrder={order}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Title-only fallback                                                        */
/* -------------------------------------------------------------------------- */

function TitleOnlyDemo() {
  const [forceBelow, setForceBelow] = React.useState(0);

  return (
    <FeatureCard
      title="Title-only fallback"
      description="When even a fully collapsed trail cannot fit, only the current page remains — guaranteed to never overflow."
    >
      <Field
        label={
          forceBelow > 0
            ? `fallbackAtWidth — force below ${forceBelow}px`
            : "fallbackAtWidth — disabled (automatic fallback only)"
        }
      >
        <Slider
          value={[forceBelow]}
          onValueChange={(values) => setForceBelow(values[0] ?? 0)}
          min={0}
          max={480}
          step={20}
        />
      </Field>
      <DemoStage initialWidth={220} minWidth={110}>
        <ResponsiveBreadcrumb
          items={filePath}
          strategy="center"
          showHomeIcon={false}
          titleOnlyIcon={<FileText className="size-4 shrink-0" aria-hidden />}
          fallbackAtWidth={forceBelow > 0 ? forceBelow : undefined}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Multiple ellipses                                                          */
/* -------------------------------------------------------------------------- */

type EllipsisMode = "single" | "smart" | "free";

const ELLIPSIS_CAPTIONS: Record<EllipsisMode, string> = {
  single:
    "One contiguous group only — it cannot cross the pinned “v4.2” crumb, so collapsing stops early.",
  smart: "Several groups allowed, but the solver prefers fewer ellipses.",
  free: "Any combination of collapsed groups — maximum flexibility.",
};

function MultiEllipsisDemo() {
  const [mode, setMode] = React.useState<EllipsisMode>("free");

  return (
    <FeatureCard
      title="Multiple ellipses"
      description="allowMultipleEllipses + grouping let collapsed groups form around pinned crumbs (“v4.2” has canCollapse: false)."
    >
      <Segmented
        ariaLabel="Ellipsis grouping"
        value={mode}
        onValueChange={setMode}
        options={[
          { value: "single", label: "Single" },
          { value: "smart", label: "Smart" },
          { value: "free", label: "Free" },
        ]}
      />
      <p className="text-xs text-muted-foreground">{ELLIPSIS_CAPTIONS[mode]}</p>
      <DemoStage initialWidth={400}>
        <ResponsiveBreadcrumb
          items={docsPath}
          strategy="center"
          showHomeIcon={false}
          allowMultipleEllipses={mode !== "single"}
          grouping={mode === "single" ? "contiguous" : mode}
          showCollapsedCount
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Separator tree menus                                                       */
/* -------------------------------------------------------------------------- */

function TreeNavDemo() {
  const [side, setSide] = React.useState<"right" | "left">("right");
  const [currentInNav, setCurrentInNav] = React.useState<
    "never" | "with-others" | "always"
  >("never");

  return (
    <FeatureCard
      title="Separator tree menus"
      description="separatorNavItems turns separators into sibling menus — navigate sideways through the hierarchy, like a file tree."
      hint="Click a chevron between two crumbs to list the sibling pages."
    >
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Field label="Menu anchors to">
          <Segmented
            ariaLabel="Separator menu side"
            value={side}
            onValueChange={setSide}
            options={[
              { value: "right", label: "Right item" },
              { value: "left", label: "Left item" },
            ]}
          />
        </Field>
        <Field label="Include current item in menu">
          <Segmented
            ariaLabel="Show current item in menus"
            value={currentInNav}
            onValueChange={setCurrentInNav}
            options={[
              { value: "never", label: "Never" },
              { value: "with-others", label: "With others" },
              { value: "always", label: "Always" },
            ]}
          />
        </Field>
      </div>
      <DemoStage>
        <ResponsiveBreadcrumb
          items={geoPath}
          strategy="center"
          showHomeIcon={false}
          separatorNavItems={geoSeparatorNav}
          separatorNavSide={side}
          showCurrentInNav={currentInNav}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Next-page arrow                                                            */
/* -------------------------------------------------------------------------- */

const retroNextItems: SeparatorNavItem[] = [
  { key: "action-items", label: "Action Items", clickable: true, icon: <ListTodo className="size-4 shrink-0" aria-hidden /> },
  { key: "team-health", label: "Team Health", clickable: true, icon: <HeartPulse className="size-4 shrink-0" aria-hidden /> },
  { key: "velocity", label: "Velocity Chart", clickable: true, icon: <TrendingUp className="size-4 shrink-0" aria-hidden /> },
];

function NextItemsDemo() {
  return (
    <FeatureCard
      title="Next-page arrow"
      description="showNextArrow appends a forward arrow after the current page, listing the pages one level deeper."
      hint="Click the arrow after “Retrospective”."
    >
      <DemoStage initialWidth={430}>
        <ResponsiveBreadcrumb
          items={sprintPath}
          strategy="center"
          showHomeIcon={false}
          showNextArrow
          nextItems={retroNextItems}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Pinned edges                                                               */
/* -------------------------------------------------------------------------- */

function PinningDemo() {
  const [head, setHead] = React.useState(1);
  const [tail, setTail] = React.useState(2);

  return (
    <FeatureCard
      title="Pinned head & tail"
      description="alwaysShow pins a number of crumbs at each end; individual crumbs can also opt out with canCollapse: false."
    >
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Field label="Head crumbs">
          <Stepper label="head crumbs" value={head} onValueChange={setHead} min={0} max={3} />
        </Field>
        <Field label="Tail crumbs">
          <Stepper label="tail crumbs" value={tail} onValueChange={setTail} min={1} max={3} />
        </Field>
      </div>
      <DemoStage initialWidth={380}>
        <ResponsiveBreadcrumb
          items={sprintPath}
          strategy="center"
          showHomeIcon={false}
          alwaysShow={{ head, tail }}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Forced collapse & priorities                                               */
/* -------------------------------------------------------------------------- */

function PriorityDemo() {
  const [forceArchives, setForceArchives] = React.useState(true);
  const [priorityOrder, setPriorityOrder] = React.useState<"oldest" | "newest">("oldest");

  const itemPriority = React.useCallback<
    NonNullable<ResponsiveBreadcrumbProps["itemPriority"]>
  >(
    (_item, index) =>
      priorityOrder === "oldest" ? index : archivePath.length - index,
    [priorityOrder],
  );

  return (
    <FeatureCard
      title="Forced collapse & priorities"
      description="forceCollapse pre-collapses matching crumbs even when there is room; itemPriority steers which crumbs disappear first."
    >
      <ToggleField
        label="Always collapse the archive levels"
        hint="forceCollapse={(item) => item.key.startsWith('archive')}"
        checked={forceArchives}
        onCheckedChange={setForceArchives}
      />
      <Field label="Collapse first when space runs out">
        <Segmented
          ariaLabel="Collapse priority"
          value={priorityOrder}
          onValueChange={setPriorityOrder}
          options={[
            { value: "oldest", label: "Oldest crumbs" },
            { value: "newest", label: "Newest crumbs" },
          ]}
        />
      </Field>
      <DemoStage>
        <ResponsiveBreadcrumb
          items={archivePath}
          strategy="center"
          showHomeIcon={false}
          forceCollapse={
            forceArchives
              ? (item) => item.key.startsWith("archive")
              : undefined
          }
          itemPriority={itemPriority}
          showCollapsedCount
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Overflow behaviors                                                         */
/* -------------------------------------------------------------------------- */

function OverflowDemo() {
  const [behavior, setBehavior] = React.useState<"collapse" | "scroll" | "wrap">(
    "collapse",
  );

  return (
    <FeatureCard
      title="Overflow behavior"
      description="Collapsing is the default, but the same component can fall back to native horizontal scrolling or multi-line wrapping."
    >
      <Segmented
        ariaLabel="Overflow behavior"
        value={behavior}
        onValueChange={setBehavior}
        options={[
          { value: "collapse", label: "Collapse" },
          { value: "scroll", label: "Scroll" },
          { value: "wrap", label: "Wrap" },
        ]}
      />
      <DemoStage initialWidth={360}>
        <ResponsiveBreadcrumb
          items={productPath}
          strategy="center"
          showHomeIcon={false}
          overflowBehavior={behavior}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* RTL & localization                                                         */
/* -------------------------------------------------------------------------- */

function RtlDemo() {
  const [locale, setLocale] = React.useState<"en" | "ar">("ar");

  return (
    <FeatureCard
      title="RTL & localization"
      description="direction flips the layout for right-to-left scripts, and strings localizes every visible and ARIA label."
      hint="Shrink the stage and open the ellipsis — the overlay title is localized too."
    >
      <Segmented
        ariaLabel="Locale"
        value={locale}
        onValueChange={setLocale}
        options={[
          { value: "en", label: "English · LTR" },
          { value: "ar", label: "العربية · RTL" },
        ]}
      />
      <DemoStage initialWidth={420}>
        <ResponsiveBreadcrumb
          key={locale}
          items={locale === "ar" ? arabicPath : adminPath}
          strategy="center"
          showHomeIcon={false}
          direction={locale === "ar" ? "rtl" : "ltr"}
          strings={locale === "ar" ? arabicStrings : undefined}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading states                                                             */
/* -------------------------------------------------------------------------- */

function LoadingDemo() {
  const [fallback, setFallback] = React.useState<"title" | "custom" | "none">(
    "custom",
  );
  const [loading, setLoading] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const simulate = () => {
    setLoading(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setLoading(false), 2500);
  };

  return (
    <FeatureCard
      title="Loading state"
      description="While isLoading is true the breadcrumb renders the current title, a custom skeleton, or nothing at all."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          ariaLabel="Loading fallback"
          value={fallback}
          onValueChange={setFallback}
          options={[
            { value: "title", label: "Title" },
            { value: "custom", label: "Skeleton" },
            { value: "none", label: "Nothing" },
          ]}
        />
        <Button size="sm" variant="outline" onClick={simulate} disabled={loading}>
          {loading ? "Loading…" : "Simulate 2.5s load"}
        </Button>
      </div>
      <DemoStage playable={false}>
        <ResponsiveBreadcrumb
          items={filePath}
          strategy="center"
          showHomeIcon={false}
          isLoading={loading}
          loadingFallback={fallback}
          customLoadingFallback={<Skeleton className="h-4 w-48" />}
          onItemClick={notifyClick}
        />
      </DemoStage>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Custom rendering                                                           */
/* -------------------------------------------------------------------------- */

const DEPLOY_DOTS = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function CustomRenderDemo() {
  return (
    <FeatureCard
      title="Custom rendering"
      description="Every part is a render prop: items, separators, ellipsis, menus and links. The hidden measurement tree uses the same renderers, so custom markup stays pixel-accurate."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            renderSeparator + renderEllipsis
          </p>
          <DemoStage initialWidth={360}>
            <ResponsiveBreadcrumb
              items={geoPath}
              strategy="center"
              showHomeIcon={false}
              renderSeparator={() => (
                <BreadcrumbSeparator>
                  <Slash className="size-3" aria-hidden />
                </BreadcrumbSeparator>
              )}
              renderEllipsis={({ hiddenItems }) => (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                  +{hiddenItems.length}
                </span>
              )}
              onItemClick={notifyClick}
            />
          </DemoStage>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">renderItem</p>
          <DemoStage initialWidth={470}>
            <ResponsiveBreadcrumb
              items={deployPath}
              strategy="center"
              showHomeIcon={false}
              renderItem={({ item, index, current }) => (
                <span
                  className={cn(
                    "inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs",
                    current ? "bg-muted font-semibold" : "bg-background",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      DEPLOY_DOTS[index % DEPLOY_DOTS.length],
                    )}
                  />
                  <span className="min-w-0 truncate">{item.label}</span>
                </span>
              )}
              onItemClick={notifyClick}
            />
          </DemoStage>
        </div>
      </div>
    </FeatureCard>
  );
}

/* -------------------------------------------------------------------------- */
/* SEO & focus rings                                                          */
/* -------------------------------------------------------------------------- */

const renderPreventedItemLink: NonNullable<
  ResponsiveBreadcrumbProps["renderItemLink"]
> = ({ href, children, onClick, ariaDisabled, itemProp }) => (
  <a
    href={href}
    itemProp={itemProp}
    aria-disabled={ariaDisabled || undefined}
    onClick={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    {children}
  </a>
);

const renderPreventedMenuLink: NonNullable<
  ResponsiveBreadcrumbProps["renderMenuLink"]
> = ({ href, children, ariaLabel, onClick }) => (
  <a
    href={href}
    aria-label={ariaLabel}
    onClick={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    {children}
  </a>
);

function SeoFocusDemo() {
  const [schema, setSchema] = React.useState<"json-ld" | "microdata" | "none">(
    "json-ld",
  );
  const [focusRing, setFocusRing] = React.useState<BreadcrumbFocusRing>("inset");

  const jsonLd = React.useMemo(
    () =>
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: seoPath.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: typeof item.label === "string" ? item.label : item.key,
            item: item.href,
          })),
        },
        null,
        2,
      ),
    [],
  );

  return (
    <FeatureCard
      title="SEO & accessibility"
      description="Schema.org structured data (JSON-LD or microdata) ships with the component, and the focus ring style adapts to clipped containers."
      hint="Press Tab to walk the links and compare the focus ring styles."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <Field label="Structured data">
            <Segmented
              ariaLabel="Structured data format"
              value={schema}
              onValueChange={setSchema}
              options={[
                { value: "json-ld", label: "JSON-LD" },
                { value: "microdata", label: "Microdata" },
                { value: "none", label: "None" },
              ]}
            />
          </Field>
          <Field label="Focus ring">
            <Segmented
              ariaLabel="Focus ring style"
              value={focusRing}
              onValueChange={setFocusRing}
              options={[
                { value: "inset", label: "Inset" },
                { value: "outer", label: "Outer" },
                { value: "clip-margin", label: "Clip margin" },
                { value: "none", label: "None" },
              ]}
            />
          </Field>
          <DemoStage playable={false}>
            <ResponsiveBreadcrumb
              items={seoPath}
              strategy="center"
              showHomeIcon
              schema={schema}
              focusRing={focusRing}
              renderItemLink={renderPreventedItemLink}
              renderMenuLink={renderPreventedMenuLink}
              onItemClick={notifyClick}
            />
          </DemoStage>
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {schema === "json-ld"
              ? "Emitted <script type=\"application/ld+json\"> (server-rendered)"
              : schema === "microdata"
                ? "Microdata mode annotates the visible DOM with itemscope/itemprop attributes instead."
                : "Structured data disabled."}
          </p>
          {schema === "json-ld" ? (
            <pre className="max-h-72 overflow-auto rounded-xl border bg-muted/30 p-4 font-mono text-[11px] leading-relaxed">
              {jsonLd}
            </pre>
          ) : null}
        </div>
      </div>
    </FeatureCard>
  );
}

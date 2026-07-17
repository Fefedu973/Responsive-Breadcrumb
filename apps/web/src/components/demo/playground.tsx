"use client";

import * as React from "react";
import { Settings } from "lucide-react";
import {
  ResponsiveBreadcrumb,
  type CollapsedCountPlacement,
  type CollapsePreference,
  type CollapseStrategy,
} from "@/components/responsive/ResponsiveBreadcrumb";
import { cn } from "@/lib/utils";
import { Field, Segmented, ToggleField } from "./demo-controls";
import { useDebugChannel, useDebugState, type DebugChannel } from "./demo-debug";
import { DemoStage } from "./demo-stage";
import {
  adminNextItems,
  adminPath,
  adminSeparatorNav,
  notifyClick,
} from "./scenarios";

export function Playground() {
  const [strategy, setStrategy] = React.useState<CollapseStrategy>("start");
  const [preference, setPreference] = React.useState<CollapsePreference>("none");
  const [showHomeIcon, setShowHomeIcon] = React.useState(true);
  const [showNextArrow, setShowNextArrow] = React.useState(true);
  const [enableTruncation, setEnableTruncation] = React.useState(false);
  const [multiEllipsis, setMultiEllipsis] = React.useState(false);
  const [showCollapsedCount, setShowCollapsedCount] = React.useState(false);
  const [collapsedCountPlacement, setCollapsedCountPlacement] =
    React.useState<CollapsedCountPlacement>("outside");
  const [inspect, setInspect] = React.useState(false);
  const channel = useDebugChannel();

  return (
    <div className="space-y-5">
      <div className="min-w-0 space-y-3">
        <DemoStage minWidth={140}>
          <ResponsiveBreadcrumb
            items={adminPath}
            strategy={strategy}
            preference={preference}
            showHomeIcon={showHomeIcon}
            showNextArrow={showNextArrow}
            nextItems={adminNextItems}
            separatorNavItems={adminSeparatorNav}
            enableTruncation={enableTruncation}
            allowMultipleEllipses={multiEllipsis}
            grouping={multiEllipsis ? "free" : "contiguous"}
            showCollapsedCount={showCollapsedCount}
            collapsedCountPlacement={collapsedCountPlacement}
            titleOnlyIcon={<Settings className="size-4 shrink-0" aria-hidden />}
            onItemClick={notifyClick}
            debug={inspect}
            onDebugStateChange={channel.push}
          />
        </DemoStage>
        {inspect ? <StatsBar channel={channel} /> : null}
        <p className="text-xs text-muted-foreground">
          Drag the handle, press play, or tab to the handle and use the arrow keys.
          Click the ellipsis and chevrons to open the overlay menus — a drawer
          replaces the popover on small screens.
        </p>
      </div>

      <aside
        aria-label="Playground controls"
        className="rounded-2xl border bg-card/50 p-4 md:p-5"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Collapse strategy">
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
          </Field>
          <Field label="Fit preference">
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
          </Field>
        </div>

        <div className="mt-5 grid gap-x-8 gap-y-1 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToggleField
            label="Truncate long labels"
            hint="Shrink wide items before collapsing"
            checked={enableTruncation}
            onCheckedChange={setEnableTruncation}
          />
          <ToggleField
            label="Multiple ellipses"
            hint="Allow several collapsed groups"
            checked={multiEllipsis}
            onCheckedChange={setMultiEllipsis}
          />
          <div>
            <ToggleField
              label="Collapsed count badge"
              checked={showCollapsedCount}
              onCheckedChange={setShowCollapsedCount}
            />
            {showCollapsedCount ? (
              <Field label="Badge placement" className="pt-1 pb-2">
                <Segmented
                  ariaLabel="Collapsed count badge placement"
                  value={collapsedCountPlacement}
                  onValueChange={setCollapsedCountPlacement}
                  options={[
                    { value: "outside", label: "Outside" },
                    { value: "inline", label: "Inline" },
                  ]}
                />
              </Field>
            ) : null}
          </div>
          <ToggleField
            label="Home icon"
            checked={showHomeIcon}
            onCheckedChange={setShowHomeIcon}
          />
          <ToggleField
            label="Next-page arrow"
            checked={showNextArrow}
            onCheckedChange={setShowNextArrow}
          />
          <ToggleField
            label="Inspect internals"
            hint="Debug outlines + live solver stats"
            checked={inspect}
            onCheckedChange={setInspect}
          />
        </div>
      </aside>
    </div>
  );
}

function StatsBar({ channel }: { channel: DebugChannel }) {
  const state = useDebugState(channel);

  if (!state) {
    return null;
  }

  const mode = state.showTitleOnly
    ? "title-only"
    : state.collapsedItemsCount > 0
      ? "collapsed"
      : "full";

  return (
    <dl className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-xl border bg-muted/30 px-4 py-2.5 font-mono text-[11px] tabular-nums">
      <Stat label="container" value={`${Math.round(state.containerWidth)}px`} />
      <Stat label="used" value={`${Math.round(state.usedWidth)}px`} />
      <Stat label="free" value={`${Math.round(state.remainingSpace)}px`} />
      <Stat
        label="visible"
        value={`${state.visibleItemsCount}/${state.totalItemsCount}`}
      />
      <Stat label="truncated" value={String(Object.keys(state.truncatedItems).length)} />
      <div className="ml-auto">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
            mode === "full" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
            mode === "collapsed" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
            mode === "title-only" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
          )}
        >
          {mode}
        </span>
      </div>
    </dl>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

"use client";

import * as React from "react";
import { ResponsiveBreadcrumb } from "@/components/responsive/ResponsiveBreadcrumb";
import { cn } from "@/lib/utils";
import { useDebugChannel, useDebugState, type DebugChannel } from "./demo-debug";
import { DemoStage } from "./demo-stage";
import { adminPath, notifyClick } from "./scenarios";

export function Inspector() {
  const channel = useDebugChannel();

  return (
    <div className="space-y-4">
      <DemoStage initialWidth={520}>
        <ResponsiveBreadcrumb
          items={adminPath}
          strategy="center"
          showHomeIcon
          enableTruncation
          debug
          onDebugStateChange={channel.push}
          onItemClick={notifyClick}
        />
      </DemoStage>
      <InspectorPanel channel={channel} />
      <p className="text-xs text-muted-foreground">
        The colored outlines mark what the component measures: items (green),
        separators (gray), the ellipsis (yellow), and the list container (blue).
        Everything in the panel above streams from the{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
          debug
        </code>{" "}
        +{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
          onDebugStateChange
        </code>{" "}
        props.
      </p>
    </div>
  );
}

function InspectorPanel({ channel }: { channel: DebugChannel }) {
  const state = useDebugState(channel);

  if (!state) {
    return (
      <div className="rounded-2xl border bg-card/50 p-6 text-sm text-muted-foreground">
        Waiting for the first measurement…
      </div>
    );
  }

  const usedRatio =
    state.containerWidth > 0
      ? Math.min(1, state.usedWidth / state.containerWidth)
      : 0;
  const collapsedGroups = state.collapsedGroups ?? [];
  const isCollapsed = (index: number) =>
    collapsedGroups.some((range) => index >= range.a && index <= range.b);

  return (
    <div className="space-y-5 rounded-2xl border bg-card/50 p-5 md:p-6">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between font-mono text-[11px] tabular-nums">
          <span className="text-muted-foreground">
            used {Math.round(state.usedWidth)}px / {Math.round(state.containerWidth)}px
          </span>
          <span
            className={cn(
              "font-medium",
              state.remainingSpace >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400",
            )}
          >
            {Math.round(state.remainingSpace)}px free
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-150",
              usedRatio > 0.95 ? "bg-amber-500" : "bg-primary",
            )}
            style={{ width: `${Math.round(usedRatio * 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Measured items — {state.visibleItemsCount}/{state.totalItemsCount} visible
          {state.showTitleOnly ? " · title-only fallback active" : ""}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {state.itemWidths.map((width, index) => {
            const truncatedWidth = state.truncatedItems[index];
            const collapsed = isCollapsed(index);
            return (
              <span
                key={index}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px] tabular-nums",
                  collapsed
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : truncatedWidth !== undefined
                      ? "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400"
                      : "bg-muted/40 text-foreground",
                )}
              >
                <span className="text-muted-foreground">#{index}</span>
                {truncatedWidth !== undefined ? (
                  <>
                    <s className="opacity-60">{Math.round(width)}</s>
                    {Math.round(truncatedWidth)}px
                  </>
                ) : (
                  <>{Math.round(width)}px</>
                )}
                {collapsed ? <span aria-hidden>·⋯</span> : null}
              </span>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-muted-foreground">
          <LegendSwatch className="bg-muted/40 ring-border" label="visible" />
          <LegendSwatch className="bg-amber-500/20 ring-amber-500/50" label="collapsed" />
          <LegendSwatch className="bg-violet-500/20 ring-violet-500/50" label="truncated" />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">
        <Metric label="Ellipsis width" value={`${Math.round(state.ellipsisWidth)}px`} />
        <Metric label="Title-only width" value={`${Math.round(state.titleOnlyWidth)}px`} />
        <Metric label="List gap" value={`${state.gap.toFixed(1)}px`} />
        <Metric
          label="Measurement"
          value={state.measurementLocked ? "Locked" : "Live"}
        />
      </dl>
    </div>
  );
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2.5 rounded-sm ring-1", className)} aria-hidden />
      {label}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm tabular-nums">{value}</dd>
    </div>
  );
}

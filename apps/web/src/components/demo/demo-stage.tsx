"use client";

import * as React from "react";
import { Maximize2, Pause, Play, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";

const KEYBOARD_STEP = 24;
const PLAY_PERIOD_MS = 9000;

export interface DemoStageProps {
  children: React.ReactNode;
  /** Starting stage width in px. Omit to start at full width. */
  initialWidth?: number;
  /** Smallest width the stage can be dragged to. */
  minWidth?: number;
  /** Hide the phone/tablet/full preset buttons. */
  presets?: boolean;
  /** Hide the auto-resize play button. */
  playable?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * A width-resizable frame for breadcrumb demos: drag the right-edge handle,
 * jump to device presets, or press play to oscillate the width automatically.
 * The dashed track behind the frame shows the room left to grow.
 */
export function DemoStage({
  children,
  initialWidth,
  minWidth = 160,
  presets = true,
  playable = true,
  className,
  contentClassName,
}: DemoStageProps) {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const dragRef = React.useRef<{ startX: number; startWidth: number } | null>(null);
  const [width, setWidth] = React.useState<number | null>(initialWidth ?? null);
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const widthRef = React.useRef<number | null>(width);
  widthRef.current = width;

  const maxWidth = React.useCallback(
    () => trackRef.current?.clientWidth ?? 960,
    [],
  );

  const clampWidth = React.useCallback(
    (next: number) => Math.round(Math.min(maxWidth(), Math.max(minWidth, next))),
    [maxWidth, minWidth],
  );

  // Live width readout + keep a fixed width inside the track when it shrinks.
  React.useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      setMeasuredWidth(Math.round(stage.getBoundingClientRect().width));
      const current = widthRef.current;
      if (current !== null && current > track.clientWidth) {
        setWidth(track.clientWidth);
      }
    });
    observer.observe(stage);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Auto-play: oscillate between minWidth and the track width, starting from
  // the current width and shrinking first.
  React.useEffect(() => {
    if (!playing) {
      return;
    }

    let raf = 0;
    const start = performance.now();
    const startMax = maxWidth();
    const startWidth = widthRef.current ?? startMax;
    const startSpan = Math.max(1, startMax - minWidth);
    const normalized = Math.min(1, Math.max(0, (startWidth - minWidth) / startSpan));
    const phase = Math.acos(2 * normalized - 1);

    const tick = (now: number) => {
      const span = Math.max(1, maxWidth() - minWidth);
      const angle = ((now - start) / PLAY_PERIOD_MS) * Math.PI * 2 + phase;
      setWidth(Math.round(minWidth + span * (0.5 + 0.5 * Math.cos(angle))));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, minWidth, maxWidth]);

  const stopPlaying = () => setPlaying(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    stopPlaying();
    dragRef.current = {
      startX: event.clientX,
      startWidth: widthRef.current ?? maxWidth(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    setWidth(clampWidth(drag.startWidth + (event.clientX - drag.startX)));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    stopPlaying();
    const delta = event.key === "ArrowLeft" ? -KEYBOARD_STEP : KEYBOARD_STEP;
    setWidth(clampWidth((widthRef.current ?? maxWidth()) + delta));
  };

  const setPreset = (next: number | null) => {
    stopPlaying();
    setWidth(next === null ? null : clampWidth(next));
  };

  const presetButtons: Array<{
    label: string;
    icon: React.ReactNode;
    width: number | null;
  }> = [
    { label: "Phone width (320px)", icon: <Smartphone className="size-3.5" aria-hidden />, width: 320 },
    { label: "Tablet width (600px)", icon: <Tablet className="size-3.5" aria-hidden />, width: 600 },
    { label: "Full width", icon: <Maximize2 className="size-3.5" aria-hidden />, width: null },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {measuredWidth}px
        </p>
        <div className="flex items-center gap-0.5">
          {presets
            ? presetButtons.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  title={preset.label}
                  aria-label={preset.label}
                  onClick={() => setPreset(preset.width)}
                  className="grid size-6 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {preset.icon}
                </button>
              ))
            : null}
          {playable ? (
            <button
              type="button"
              title={playing ? "Pause auto-resize" : "Animate width automatically"}
              aria-label={playing ? "Pause auto-resize" : "Animate width automatically"}
              aria-pressed={playing}
              onClick={() => setPlaying((previous) => !previous)}
              className={cn(
                "grid size-6 place-items-center rounded-md transition-colors",
                playing
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {playing ? (
                <Pause className="size-3.5" aria-hidden />
              ) : (
                <Play className="size-3.5" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative rounded-xl border border-dashed border-border/80 bg-muted/20"
      >
        <div
          ref={stageRef}
          style={{ width: width === null ? "100%" : `${width}px` }}
          className="relative min-w-0 rounded-xl border bg-card shadow-sm"
        >
          <div className={cn("flex min-h-14 items-center px-4 py-3", contentClassName)}>
            <div className="min-w-0 max-w-full flex-1">{children}</div>
          </div>
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize demo container"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            className="group absolute inset-y-0 -right-2.5 flex w-5 cursor-ew-resize touch-none items-center justify-center outline-none"
          >
            <span
              aria-hidden
              className="h-8 w-1.5 rounded-full bg-border transition-colors group-hover:bg-muted-foreground/60 group-focus-visible:bg-ring"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

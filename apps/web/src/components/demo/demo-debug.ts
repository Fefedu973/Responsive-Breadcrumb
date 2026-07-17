"use client";

import * as React from "react";
import type { BreadcrumbDebugState } from "@/components/responsive/ResponsiveBreadcrumb";

export interface DebugChannel {
  push: (state: BreadcrumbDebugState) => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => BreadcrumbDebugState | null;
}

/**
 * Local pub/sub channel for one breadcrumb's debug state. Only the components
 * that subscribe re-render on layout changes — the section holding the
 * breadcrumb itself stays out of the update loop.
 */
export function useDebugChannel(): DebugChannel {
  const store = React.useRef<{
    state: BreadcrumbDebugState | null;
    listeners: Set<() => void>;
  }>({ state: null, listeners: new Set() });

  return React.useMemo(
    () => ({
      push: (state: BreadcrumbDebugState) => {
        store.current.state = state;
        store.current.listeners.forEach((listener) => listener());
      },
      subscribe: (listener: () => void) => {
        store.current.listeners.add(listener);
        return () => {
          store.current.listeners.delete(listener);
        };
      },
      getSnapshot: () => store.current.state,
    }),
    [],
  );
}

export function useDebugState(channel: DebugChannel) {
  return React.useSyncExternalStore(
    channel.subscribe,
    channel.getSnapshot,
    channel.getSnapshot,
  );
}

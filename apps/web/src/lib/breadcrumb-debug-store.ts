"use client";
import * as React from "react";
import type { BreadcrumbDebugState } from "@/components/responsive/ResponsiveBreadcrumb";

type State = BreadcrumbDebugState | null;

class Store {
    private state: State = null;
    private listeners = new Set<() => void>();

    set = (next: State) => {
        this.state = next;
        for (const l of this.listeners) l();
    };

    clear = () => this.set(null);

    subscribe = (cb: () => void) => {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    };

    getSnapshot = () => this.state;
}

export const breadcrumbDebugStore = new Store();

// React hook for components that want to *render* the debug UI
export function useBreadcrumbDebugStore() {
    return React.useSyncExternalStore(
        breadcrumbDebugStore.subscribe,
        breadcrumbDebugStore.getSnapshot,
        breadcrumbDebugStore.getSnapshot
    );
}

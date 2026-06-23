"use client"

import * as React from "react"
import type { IdentityClientAppAdapter, SessionFreshnessViewModel } from "./session-types"
import { fetchSessionFreshness } from "./session-freshness-client"

const SessionFreshnessContext = React.createContext<{
    freshness: SessionFreshnessViewModel | null
    refreshFreshness: () => Promise<void>
} | null>(null)

const DEFAULT_POLL_MS = 30_000
const DEFERRED_POLL_MS = 2_000
const UNAVAILABLE_POLL_MS = 5_000

function pollDelayMs(freshness: SessionFreshnessViewModel | null, defaultPollMs: number): number {
    if (freshness?.throttled) {
        return Math.max(freshness.retryAfterMs ?? defaultPollMs, 1000)
    }
    if (freshness?.runtimeState === "VALID_STALE_REFRESH_DEFERRED") {
        return Math.max(freshness.retryAfterMs ?? DEFERRED_POLL_MS, 1000)
    }
    if (freshness?.runtimeState === "REFRESH_COORDINATION_UNAVAILABLE") {
        return Math.max(freshness.retryAfterMs ?? UNAVAILABLE_POLL_MS, 1000)
    }
    if (
        freshness?.runtimeState === "VALID_STALE_RESTRICTED" ||
        freshness?.runtimeState === "VALID_STALE_REFRESHING"
    ) {
        return Math.min(defaultPollMs, 10_000)
    }
    return defaultPollMs
}

export function SessionFreshnessProvider({
    adapter,
    children,
    pollIntervalMs = DEFAULT_POLL_MS,
}: {
    adapter: IdentityClientAppAdapter
    children: React.ReactNode
    pollIntervalMs?: number
}) {
    const [freshness, setFreshness] = React.useState<SessionFreshnessViewModel | null>(null)

    const refreshFreshness = React.useCallback(async () => {
        const next = await fetchSessionFreshness(adapter)
        if (next) {
            setFreshness(next)
        }
    }, [adapter])

    React.useEffect(() => {
        void refreshFreshness()
    }, [refreshFreshness])

    React.useEffect(() => {
        if (!adapter.freshnessEndpoint) {
            return
        }
        const delay = pollDelayMs(freshness, pollIntervalMs)
        const timer = window.setTimeout(() => {
            void refreshFreshness()
        }, delay)
        return () => window.clearTimeout(timer)
    }, [adapter.freshnessEndpoint, freshness, pollIntervalMs, refreshFreshness])

    React.useEffect(() => {
        if (!adapter.freshnessEndpoint) {
            return
        }
        const onVisible = () => {
            if (document.visibilityState === "visible") {
                void refreshFreshness()
            }
        }
        document.addEventListener("visibilitychange", onVisible)
        return () => document.removeEventListener("visibilitychange", onVisible)
    }, [adapter.freshnessEndpoint, refreshFreshness])

    const value = React.useMemo(
        () => ({ freshness, refreshFreshness }),
        [freshness, refreshFreshness]
    )

    return (
        <SessionFreshnessContext.Provider value={value}>{children}</SessionFreshnessContext.Provider>
    )
}

export function useSessionFreshness(): SessionFreshnessViewModel | null {
    const ctx = React.useContext(SessionFreshnessContext)
    if (!ctx) {
        return null
    }
    return ctx.freshness
}

export function useSessionFreshnessActions(): { refreshFreshness: () => Promise<void> } {
    const ctx = React.useContext(SessionFreshnessContext)
    if (!ctx) {
        throw new Error("useSessionFreshnessActions must be used within SessionFreshnessProvider")
    }
    return { refreshFreshness: ctx.refreshFreshness }
}

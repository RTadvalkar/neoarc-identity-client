"use client"

import * as React from "react"
import type { IdentityClientAppAdapter, SessionFreshnessViewModel } from "./session-types"
import { fetchSessionFreshness } from "./session-freshness-client"

const SessionFreshnessContext = React.createContext<{
    freshness: SessionFreshnessViewModel | null
    refreshFreshness: () => Promise<void>
} | null>(null)

const DEFAULT_POLL_MS = 30_000

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
        const delay = freshness?.throttled
            ? Math.max(freshness.retryAfterMs ?? pollIntervalMs, 1000)
            : pollIntervalMs
        const timer = window.setTimeout(() => {
            void refreshFreshness()
        }, delay)
        return () => window.clearTimeout(timer)
    }, [adapter.freshnessEndpoint, freshness, pollIntervalMs, refreshFreshness])

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

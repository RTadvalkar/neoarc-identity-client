"use client"

import * as React from "react"
import type { IdentityClientAppAdapter, SessionViewModel } from "./session-types"
import { fetchSession } from "./session-client"
import type { SessionRefreshOptions } from "./session-refresh-policy"
import { shouldSetLoadingOnRefresh } from "./session-refresh-policy"

const SessionContext = React.createContext<{
    session: SessionViewModel
    refresh: (options?: SessionRefreshOptions) => Promise<void>
} | null>(null)

export function SessionProvider({
    adapter,
    children,
}: {
    adapter: IdentityClientAppAdapter
    children: React.ReactNode
}) {
    const [session, setSession] = React.useState<SessionViewModel>({
        authenticated: false,
        status: "loading",
    })
    const refreshPromiseRef = React.useRef<Promise<void> | null>(null)

    const refresh = React.useCallback(
        async (options?: SessionRefreshOptions) => {
            if (refreshPromiseRef.current) {
                return refreshPromiseRef.current
            }

            const run = (async () => {
                setSession((current) => {
                    if (!shouldSetLoadingOnRefresh(current, options)) {
                        return current
                    }
                    return { ...current, status: "loading" }
                })
                const next = await fetchSession(adapter)
                setSession(next)
            })()

            refreshPromiseRef.current = run
            try {
                await run
            } finally {
                refreshPromiseRef.current = null
            }
        },
        [adapter]
    )

    React.useEffect(() => {
        void refresh()
    }, [refresh])

    React.useEffect(() => {
        const onVisible = () => {
            if (document.visibilityState === "visible") {
                void refresh({ background: true })
            }
        }
        document.addEventListener("visibilitychange", onVisible)
        return () => document.removeEventListener("visibilitychange", onVisible)
    }, [refresh])

    const value = React.useMemo(() => ({ session, refresh }), [session, refresh])

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionViewModel {
    const ctx = React.useContext(SessionContext)
    if (!ctx) {
        throw new Error("useSession must be used within SessionProvider")
    }
    return ctx.session
}

export function useSessionActions(): {
    refresh: (options?: SessionRefreshOptions) => Promise<void>
} {
    const ctx = React.useContext(SessionContext)
    if (!ctx) {
        throw new Error("useSessionActions must be used within SessionProvider")
    }
    return { refresh: ctx.refresh }
}

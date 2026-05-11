"use client"

import * as React from "react"
import type { IdentityClientAppAdapter, SessionViewModel } from "./session-types"
import { fetchSession } from "./session-client"

const SessionContext = React.createContext<{
    session: SessionViewModel
    refresh: () => Promise<void>
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

    const refresh = React.useCallback(async () => {
        setSession((s) => ({ ...s, status: "loading" }))
        const next = await fetchSession(adapter)
        setSession(next)
    }, [adapter])

    React.useEffect(() => {
        void refresh()
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

export function useSessionActions(): { refresh: () => Promise<void> } {
    const ctx = React.useContext(SessionContext)
    if (!ctx) {
        throw new Error("useSessionActions must be used within SessionProvider")
    }
    return { refresh: ctx.refresh }
}

"use client"

import * as React from "react"
import type { IdentityClientAppAdapter } from "./session-types"
import { useSession } from "./session-provider"

export function AuthRouteGuard({
    adapter,
    children,
}: {
    adapter: IdentityClientAppAdapter
    children: React.ReactNode
}) {
    const session = useSession()

    React.useEffect(() => {
        if (session.status === "loading") return
        if (!session.authenticated && typeof window !== "undefined") {
            window.location.assign(adapter.loginPath)
        }
    }, [session, adapter.loginPath])

    if (session.status === "loading" || !session.authenticated) {
        return null
    }
    return <>{children}</>
}

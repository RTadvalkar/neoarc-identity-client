"use client"

import * as React from "react"
import type { IdentityClientAppAdapter } from "./session-types"
import { useSession } from "./session-provider"
import { shouldAuthRouteGuardBlock } from "./session-refresh-policy"

export function AuthRouteGuard({
    adapter,
    children,
}: {
    adapter: IdentityClientAppAdapter
    children: React.ReactNode
}) {
    const session = useSession()
    const [initialLoadComplete, setInitialLoadComplete] = React.useState(false)

    React.useEffect(() => {
        if (session.status !== "loading") {
            setInitialLoadComplete(true)
        }
    }, [session.status])

    React.useEffect(() => {
        if (session.status === "loading" && !initialLoadComplete) {
            return
        }
        if (!session.authenticated && typeof window !== "undefined") {
            window.location.assign(adapter.loginPath)
        }
    }, [session.authenticated, session.status, adapter.loginPath, initialLoadComplete])

    if (shouldAuthRouteGuardBlock(session, initialLoadComplete)) {
        return null
    }
    return <>{children}</>
}

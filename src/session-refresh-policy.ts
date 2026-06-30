import type { SessionViewModel } from "./session-types"

export type SessionRefreshOptions = {
    /** When true, do not flip to loading if the session is already authenticated. */
    background?: boolean
}

/** Whether a refresh should set session status to loading before fetching. */
export function shouldSetLoadingOnRefresh(
    current: SessionViewModel,
    options?: SessionRefreshOptions
): boolean {
    if (options?.background && current.status === "authenticated") {
        return false
    }
    return true
}

/** Whether AuthRouteGuard should block rendering (initial gate only). */
export function shouldAuthRouteGuardBlock(
    session: SessionViewModel,
    initialLoadComplete: boolean
): boolean {
    if (!initialLoadComplete) {
        return session.status === "loading" || !session.authenticated
    }
    return !session.authenticated
}

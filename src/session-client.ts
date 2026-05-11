import type { IdentityClientAppAdapter } from "./session-types"
import type { SessionViewModel } from "./session-types"
import { isAuthErrorEnvelope } from "./auth-errors"

export async function fetchSession(
    adapter: IdentityClientAppAdapter,
    init?: RequestInit
): Promise<SessionViewModel> {
    const res = await fetch(adapter.sessionEndpoint, {
        ...init,
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            ...(init?.headers as Record<string, string>),
        },
    })
    if (res.status === 401 || res.status === 403) {
        const body = await res.json().catch(() => null)
        if (isAuthErrorEnvelope(body)) {
            return {
                authenticated: false,
                status: "unauthenticated",
            }
        }
        return { authenticated: false, status: "unauthenticated" }
    }
    if (!res.ok) {
        return { authenticated: false, status: "unauthenticated" }
    }
    const data = (await res.json()) as SessionViewModel
    return {
        ...data,
        status: data.authenticated ? "authenticated" : "unauthenticated",
    }
}

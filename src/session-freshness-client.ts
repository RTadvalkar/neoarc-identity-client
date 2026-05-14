import type { IdentityClientAppAdapter, SessionFreshnessViewModel } from "./session-types"

export async function fetchSessionFreshness(
    adapter: IdentityClientAppAdapter,
    init?: RequestInit
): Promise<SessionFreshnessViewModel | null> {
    if (!adapter.freshnessEndpoint) {
        return null
    }

    const res = await fetch(adapter.freshnessEndpoint, {
        ...init,
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            ...(init?.headers as Record<string, string>),
        },
    })

    // Platform BFF historically returned 401 with INVALID_REAUTH for "no cookie" — that wrongly
    // triggered Keycloak redirects. No session is anonymous, not reauth-required.
    if (res.status === 401) {
        return {
            runtimeState: "ANONYMOUS",
            reasons: [],
            throttled: false,
            checkedAt: new Date().toISOString(),
        }
    }

    if (res.status === 429) {
        const body = (await res.json().catch(() => null)) as SessionFreshnessViewModel | null
        return {
            runtimeState: body?.runtimeState ?? "VALID_STALE_REFRESHING",
            reasons: body?.reasons ?? [],
            throttled: true,
            checkedAt: body?.checkedAt ?? new Date().toISOString(),
            ...(body?.retryAfterMs !== undefined ? { retryAfterMs: body.retryAfterMs } : {}),
        }
    }

    if (!res.ok) {
        return null
    }

    return (await res.json()) as SessionFreshnessViewModel
}

import type { IdentityClientAppAdapter } from "./session-types"
import type { AuthErrorEnvelope } from "./auth-errors"

export async function postContextSwitch(
    adapter: IdentityClientAppAdapter,
    body: { tenantId: number },
    csrfToken: string,
    init?: RequestInit
): Promise<{ ok: true } | { ok: false; error: AuthErrorEnvelope }> {
    const url = adapter.contextSwitchEndpoint
    if (!url) {
        return {
            ok: false,
            error: {
                code: "AUTH_PROVIDER_UNAVAILABLE",
                message: "contextSwitchEndpoint not configured",
                correlationId: "client",
                reauthenticate: false,
                retryable: false,
            },
        }
    }
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            ...(init?.headers as Record<string, string>),
        },
        body: JSON.stringify(body),
        ...init,
    })
    const json = await res.json().catch(() => null)
    if (!res.ok && json && typeof json === "object" && "code" in json) {
        return { ok: false, error: json as AuthErrorEnvelope }
    }
    if (!res.ok) {
        return {
            ok: false,
            error: {
                code: "FORBIDDEN",
                message: "Context switch failed",
                correlationId: "unknown",
                reauthenticate: false,
                retryable: false,
            },
        }
    }
    return { ok: true }
}

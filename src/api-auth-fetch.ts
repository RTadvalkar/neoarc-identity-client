import type { AuthErrorEnvelope } from "./auth-errors"
import { isAuthErrorEnvelope } from "./auth-errors"

export interface CreateAuthFetchOptions {
    getCsrfToken?: () => string | undefined
}

/** Same-origin fetch with credentials; maps 401/403 to AuthErrorEnvelope when present. */
export function createAuthFetch(options: CreateAuthFetchOptions = {}) {
    return async function apiAuthFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const headers = new Headers(init?.headers)
        const csrf = options.getCsrfToken?.()
        if (csrf && init?.method && !["GET", "HEAD", "OPTIONS"].includes(init.method.toUpperCase())) {
            headers.set("x-csrf-token", csrf)
        }
        const res = await fetch(input, {
            ...init,
            credentials: "same-origin",
            headers,
        })
        return res
    }
}

export async function parseAuthError(res: Response): Promise<AuthErrorEnvelope | null> {
    if (res.status !== 401 && res.status !== 403) return null
    const j = await res.json().catch(() => null)
    return isAuthErrorEnvelope(j) ? j : null
}

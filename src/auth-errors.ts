/** Normalized auth error returned by BFF and `createAuthFetch`. */
export type AuthErrorCode =
    | "UNAUTHENTICATED"
    | "SESSION_EXPIRED"
    | "FORBIDDEN"
    | "CSRF_INVALID"
    | "CONTEXT_SWITCH_DENIED"
    | "AUTH_PROVIDER_UNAVAILABLE"
    | "CLAIMS_STALE"

export interface AuthErrorEnvelope {
    code: AuthErrorCode
    message: string
    correlationId: string
    reauthenticate: boolean
    retryable: boolean
}

export function isAuthErrorEnvelope(x: unknown): x is AuthErrorEnvelope {
    if (typeof x !== "object" || x === null) return false
    const o = x as Record<string, unknown>
    return (
        typeof o.code === "string" &&
        typeof o.message === "string" &&
        typeof o.correlationId === "string" &&
        typeof o.reauthenticate === "boolean" &&
        typeof o.retryable === "boolean"
    )
}

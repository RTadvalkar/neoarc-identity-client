import type { AuthErrorEnvelope } from "./auth-errors"

export type AuthStatus = "authenticated" | "unauthenticated" | "loading"

export interface IdentityClientAppAdapter {
    appId: string
    sessionEndpoint: string
    loginPath: string
    logoutPath: string
    callbackPath: string
    contextSwitchEndpoint?: string
    forbiddenPath: string
    afterLoginPath: string
    featureNamespace: string
    permissionNamespace: string
    tenantContextMode: "single" | "multi" | "none"
}

/** Sanitized session DTO from `GET /api/auth/session` — no raw JWT. */
export interface SessionViewModel {
    authenticated: boolean
    status: AuthStatus
    user?: {
        id: string
        email?: string
        displayName?: string
        level?: string
    }
    activeTenant?: { id: number; name?: string }
    availableTenants?: Array<{ id: number; name?: string }>
    claimsVersion?: string
    contextVersion?: string
    reauthenticationRequired?: boolean
    assuranceLevel?: string
    authTime?: number
}

export type { AuthErrorEnvelope, AuthErrorCode } from "./auth-errors"

import type { AuthErrorEnvelope } from "./auth-errors"

export type AuthStatus = "authenticated" | "unauthenticated" | "loading"

export const SESSION_RUNTIME_STATES = [
    /** No staff session cookie — not a reauth failure; callers must not treat as INVALID_REAUTH. */
    "ANONYMOUS",
    "VALID_FRESH",
    "VALID_STALE_REFRESHING",
    "VALID_STALE_RESTRICTED",
    /** Lock held elsewhere — immediate refresh deferred; retry with backoff. */
    "VALID_STALE_REFRESH_DEFERRED",
    /** Production Redis unavailable — refresh not attempted (retryable). */
    "REFRESH_COORDINATION_UNAVAILABLE",
    "INVALID_REAUTH_REQUIRED",
] as const

export type SessionRuntimeState = (typeof SESSION_RUNTIME_STATES)[number]

export const SESSION_CLAIM_FRESHNESS_REASONS = [
    "POLICY_VERSION_STALE",
    "TENANT_MEMBERSHIP_VERSION_STALE",
    "CLAIM_PROFILE_VERSION_STALE",
    "CLAIM_SCHEMA_VERSION_STALE",
    "ROLE_REVOKED_OR_DOWNGRADED",
    "TENANT_REMOVED",
    "ACTIVE_TENANT_INVALID",
    "USER_DISABLED",
    "REFRESH_FAILED",
    "SYNC_PENDING",
    "TENANT_ADDED",
] as const

export type SessionClaimFreshnessReason = (typeof SESSION_CLAIM_FRESHNESS_REASONS)[number]

export interface SessionFreshnessViewModel {
    runtimeState: SessionRuntimeState
    reasons: SessionClaimFreshnessReason[]
    throttled: boolean
    checkedAt: string
    retryAfterMs?: number
    claimSchemaVersion?: string
    claimProfileVersion?: string
    tenantMembershipVersion?: string
    policyVersion?: string
}

export interface IdentityClientAppAdapter {
    appId: string
    sessionEndpoint: string
    loginPath: string
    logoutPath: string
    callbackPath: string
    contextSwitchEndpoint?: string
    freshnessEndpoint?: string
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
    activeTenant?: { id: string; name?: string }
    /** BFF control-plane UX scope — not JWT actor tenant. */
    targetTenant?: { id: string; name?: string; tenantContext?: string }
    availableTenants?: Array<{ id: string; name?: string }>
    claimsVersion?: string
    contextVersion?: string
    operatorContext?: string
    /** Policy role codes keyed by tenant UUID (canonical). */
    rolesPerTenant?: Record<string, string[]>
    roleIds?: number[]
    reauthenticationRequired?: boolean
    assuranceLevel?: string
    mfaEnabled?: boolean
    assuranceMethods?: string[]
    authTime?: number
}

export type { AuthErrorEnvelope, AuthErrorCode } from "./auth-errors"

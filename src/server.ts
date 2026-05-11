import type { SessionViewModel } from "./session-types"

export type {
    AuthStatus,
    IdentityClientAppAdapter,
    SessionViewModel,
} from "./session-types"
export type { AuthErrorEnvelope, AuthErrorCode } from "./auth-errors"
export { isAuthErrorEnvelope } from "./auth-errors"

/** Placeholder — resolve session from encrypted cookie / server session in BFF integration. */
export async function getServerSession(): Promise<SessionViewModel | null> {
    return null
}

export async function requireServerSession(): Promise<SessionViewModel> {
    const s = await getServerSession()
    if (!s?.authenticated) {
        throw new Error("UNAUTHENTICATED")
    }
    return s
}

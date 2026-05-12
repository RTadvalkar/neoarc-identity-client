import type { SessionViewModel } from "./session-types"

const CONTEXT_TO_PERSONA: Record<string, string> = {
    PLATFORM: "platform_admin",
    OPERATOR: "operator_admin",
    ENTERPRISE: "enterprise_admin",
    VENDOR: "vendor_admin",
    COMPLIANCE: "compliance_auditor",
    SUPPORT: "support_user",
}

export function sessionHasPersona(session: SessionViewModel, persona: string): boolean {
    if (!session.authenticated) {
        return false
    }
    const context = session.operatorContext?.toUpperCase()
    if (context && CONTEXT_TO_PERSONA[context] === persona) {
        return true
    }
    return false
}

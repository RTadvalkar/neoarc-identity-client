import type { SessionViewModel } from "./session-types"

export function getActiveTenantId(session: SessionViewModel): string | undefined {
    return session.activeTenant?.id
}

import type { SessionViewModel } from "./session-types"

export function getActiveTenantId(session: SessionViewModel): number | undefined {
    return session.activeTenant?.id
}

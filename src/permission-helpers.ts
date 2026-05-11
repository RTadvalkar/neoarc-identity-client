import type { SessionViewModel } from "./session-types"

/** UX-only — always false until permission payload is wired in SessionViewModel. */
export function sessionHasPermission(_session: SessionViewModel, _code: string): boolean {
    return false
}

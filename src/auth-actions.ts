import type { IdentityClientAppAdapter } from "./session-types"

export function navigateToLogin(adapter: IdentityClientAppAdapter): void {
    if (typeof window === "undefined") return
    window.location.assign(adapter.loginPath)
}

export function navigateToLogout(adapter: IdentityClientAppAdapter): void {
    if (typeof window === "undefined") return
    window.location.assign(adapter.logoutPath)
}

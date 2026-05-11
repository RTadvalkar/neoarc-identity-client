/**
 * Compile-only example: product UI configures `@neoarc/identity-client` without neoarc-platform-app.
 * Run: `pnpm exec tsc --noEmit -p examples/tsconfig.json` (if added) or rely on root `tsc` excluding this folder.
 */
import type { IdentityClientAppAdapter } from "../src/session-types"

export const adapter: IdentityClientAppAdapter = {
    appId: "acme",
    sessionEndpoint: "/api/auth/session",
    loginPath: "/login",
    logoutPath: "/logout",
    callbackPath: "/api/auth/callback",
    contextSwitchEndpoint: "/api/auth/context/switch",
    forbiddenPath: "/403",
    afterLoginPath: "/app",
    featureNamespace: "acme",
    permissionNamespace: "acme",
    tenantContextMode: "multi",
}

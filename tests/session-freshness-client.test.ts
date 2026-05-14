import { describe, expect, it } from "vitest"
import { fetchSessionFreshness } from "../src/session-freshness-client"

describe("fetchSessionFreshness", () => {
    it("maps HTTP 401 to ANONYMOUS (no staff session), not INVALID_REAUTH_REQUIRED", async () => {
        const originalFetch = globalThis.fetch
        globalThis.fetch = (() =>
            Promise.resolve(
                new Response(null, {
                    status: 401,
                })
            )) as typeof fetch
        try {
            const result = await fetchSessionFreshness({
                appId: "test",
                sessionEndpoint: "/api/auth/session",
                loginPath: "/api/auth/login",
                logoutPath: "/api/auth/logout",
                callbackPath: "/api/auth/callback",
                forbiddenPath: "/login",
                afterLoginPath: "/home/dashboard",
                featureNamespace: "test",
                permissionNamespace: "test",
                tenantContextMode: "multi",
                freshnessEndpoint: "/api/auth/session/freshness",
            })
            expect(result?.runtimeState).toBe("ANONYMOUS")
            expect(result?.reasons).toEqual([])
        } finally {
            globalThis.fetch = originalFetch
        }
    })

    it("returns null when freshness endpoint is not configured", async () => {
        const result = await fetchSessionFreshness({
            appId: "test",
            sessionEndpoint: "/api/auth/session",
            loginPath: "/api/auth/login",
            logoutPath: "/api/auth/logout",
            callbackPath: "/api/auth/callback",
            forbiddenPath: "/login",
            afterLoginPath: "/home/dashboard",
            featureNamespace: "test",
            permissionNamespace: "test",
            tenantContextMode: "multi",
        })
        expect(result).toBeNull()
    })
})

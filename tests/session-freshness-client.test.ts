import { describe, expect, it } from "vitest"
import { fetchSessionFreshness } from "../src/session-freshness-client"

describe("fetchSessionFreshness", () => {
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

import { describe, expect, it } from "vitest"
import type { SessionViewModel } from "../src/session-types"
import {
    shouldAuthRouteGuardBlock,
    shouldSetLoadingOnRefresh,
} from "../src/session-refresh-policy"

const authenticatedSession: SessionViewModel = {
    authenticated: true,
    status: "authenticated",
    user: { id: "user-1" },
}

const loadingSession: SessionViewModel = {
    authenticated: false,
    status: "loading",
}

const unauthenticatedSession: SessionViewModel = {
    authenticated: false,
    status: "unauthenticated",
}

describe("shouldSetLoadingOnRefresh", () => {
    it("sets loading on initial foreground refresh", () => {
        expect(shouldSetLoadingOnRefresh(loadingSession)).toBe(true)
        expect(shouldSetLoadingOnRefresh(unauthenticatedSession)).toBe(true)
    })

    it("does not set loading on background refresh when already authenticated", () => {
        expect(shouldSetLoadingOnRefresh(authenticatedSession, { background: true })).toBe(
            false
        )
    })

    it("sets loading on foreground refresh even when authenticated", () => {
        expect(shouldSetLoadingOnRefresh(authenticatedSession)).toBe(true)
    })
})

describe("shouldAuthRouteGuardBlock", () => {
    it("blocks during initial load while session is loading", () => {
        expect(shouldAuthRouteGuardBlock(loadingSession, false)).toBe(true)
    })

    it("blocks when initial load resolves unauthenticated", () => {
        expect(shouldAuthRouteGuardBlock(unauthenticatedSession, false)).toBe(true)
    })

    it("does not block after initial load when authenticated", () => {
        expect(shouldAuthRouteGuardBlock(authenticatedSession, true)).toBe(false)
    })

    it("does not block during background revalidation loading state", () => {
        const revalidating: SessionViewModel = {
            ...authenticatedSession,
            status: "loading",
        }
        expect(shouldAuthRouteGuardBlock(revalidating, true)).toBe(false)
    })

    it("blocks after initial load when session becomes unauthenticated", () => {
        expect(shouldAuthRouteGuardBlock(unauthenticatedSession, true)).toBe(true)
    })
})

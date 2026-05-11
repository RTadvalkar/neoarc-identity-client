import { describe, it, expect } from "vitest"
import { isAuthErrorEnvelope } from "../src/auth-errors"

describe("isAuthErrorEnvelope", () => {
    it("accepts valid envelope", () => {
        expect(
            isAuthErrorEnvelope({
                code: "UNAUTHENTICATED",
                message: "x",
                correlationId: "c1",
                reauthenticate: true,
                retryable: false,
            })
        ).toBe(true)
    })
    it("rejects invalid", () => {
        expect(isAuthErrorEnvelope({})).toBe(false)
    })
})

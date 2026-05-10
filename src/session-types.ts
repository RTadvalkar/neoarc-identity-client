// src/session-types.ts
export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export interface IdentityClientAppAdapter {
    appId: string;
    sessionEndpoint: string;
    loginPath: string;
    logoutPath: string;
    callbackPath: string;
    contextSwitchEndpoint?: string;
    forbiddenPath: string;
    afterLoginPath: string;
    featureNamespace: string;
    permissionNamespace: string;
    tenantContextMode: "single" | "multi" | "none";
}

export interface SessionViewModel {
    authenticated: boolean;
    status: AuthStatus;
}

# @neoarc/identity-client

Reusable **session + auth fetch** surface for **neoarc-platform-app** and product UIs. **App-agnostic** — no imports from `neoarc-platform-app`.

## Package exports

- `@neoarc/identity-client` — types + `isAuthErrorEnvelope`
- `@neoarc/identity-client/browser` — `SessionProvider`, `useSession`, `createAuthFetch`, guards, helpers
- `@neoarc/identity-client/server` — `getServerSession` / `requireServerSession` (extend in BFF)

## Local development with neoarc-platform-app

1. **`file:` dependency** (simplest without a workspace):

```json
"@neoarc/identity-client": "file:../neoarc-identity-client"
```

2. **pnpm workspace** at `C:\git-repository\neoarc\frontend`: add both packages and use `workspace:*`.

After linking: `pnpm install` in **neoarc-platform-app**, then `pnpm run build` in **neoarc-identity-client** so `dist/` exists for consumers.

## Scripts

```bash
pnpm install
pnpm run build
pnpm exec tsc --noEmit
pnpm test
```

## Forbidden imports (library `src/`)

Must be empty:

```bash
rg "from ['\"]@/|neoarc-platform-app|lib/navigation|lib/routes|lib/permissions|app/|components/" src
```

## Feedback

*(Human remarks.)*

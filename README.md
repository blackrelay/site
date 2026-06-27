# Black Relay Site

Static public landing site for `blackrelay.network`.

The site is built with Astro, TypeScript and Tailwind CSS for Cloudflare Pages static output.

## Runtime

Use Node.js `26.1.0`, matching [.nvmrc](.nvmrc).

## Develop

Install dependencies:
```sh
corepack pnpm install
```

Run the local server:
```sh
corepack pnpm dev
```

Preview the built Cloudflare Pages output locally:
```sh
corepack pnpm build
corepack pnpm pages:dev
```

Windows:
```powershell
corepack pnpm build
corepack pnpm pages:dev
```

## Build

Run checks and produce the static `dist` output:
```sh
corepack pnpm build
```

Cloudflare Pages should use:
```text
Build command: pnpm build
Output directory: dist
```

Wrangler configuration lives in [wrangler.toml](wrangler.toml). Deploy the current `dist` output with:
```sh
corepack pnpm build
corepack pnpm pages:deploy
```

Windows:
```powershell
corepack pnpm build
corepack pnpm pages:deploy
```

## Public Configuration

Mutable public links live in [src/config/site.ts](src/config/site.ts).

The Discord invite, EVE Frontier referral URL and referral code are public values. They are not secrets.

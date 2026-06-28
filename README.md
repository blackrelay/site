# Black Relay Site

Static public landing site for `blackrelay.network`.

The site is built with Astro, TypeScript and Tailwind CSS for Cloudflare Pages static output.

## Runtime

Use Node.js `26.4.0`, matching [.nvmrc](.nvmrc), with pnpm `11.9.0`.

## Develop

Install dependencies:
```sh
pnpm install
```

Run the local server:
```sh
pnpm dev
```

Preview the built Cloudflare Pages output locally:
```sh
pnpm build
pnpm pages:dev
```

Windows:
```powershell
pnpm build
pnpm pages:dev
```

## Build

Run checks and produce the static `dist` output:
```sh
pnpm build
```

Cloudflare Pages should use:
```text
Build command: pnpm build
Output directory: dist
```

Wrangler configuration lives in [wrangler.toml](wrangler.toml). Deploy the current `dist` output with:
```sh
pnpm build
pnpm pages:deploy
```

Windows:
```powershell
pnpm build
pnpm pages:deploy
```

pnpm workspace settings live in [pnpm-workspace.yaml](pnpm-workspace.yaml). They keep the package-manager supply-chain policy active while approving the expected native build scripts for `esbuild`, `sharp` and `workerd`.

## Public Configuration

Mutable public links live in [src/config/site.ts](src/config/site.ts).

The Discord invite, EVE Frontier referral URL and referral code are public values. They are not secrets.

## Static Responses

The site generates:
- `robots.txt` from [src/pages/robots.txt.ts](src/pages/robots.txt.ts).
- `.well-known/security.txt` from [src/pages/.well-known/security.txt.ts](src/pages/.well-known/security.txt.ts).
- `security.md` from [src/pages/security.md.ts](src/pages/security.md.ts).
- `security/` from [src/pages/security.astro](src/pages/security.astro).
- `404.html` from [src/pages/404.astro](src/pages/404.astro).

Unknown routes return the generated 404 page. Client-side navigation then returns the visitor to the last recorded Black Relay page. If no last page is known, the target is `/`. The home page shows a warning banner with the missing path.

Cloudflare Pages advanced mode is handled by [public/_worker.js](public/_worker.js). The Worker:
- Forwards static assets through the Pages `ASSETS` binding.
- Applies security headers and a nonce-based Content Security Policy to HTML.
- Allows Cloudflare Web Analytics / RUM automatic injection.
- Adds dictionary hints for generated Astro CSS and JavaScript assets.
- Serves `llms.txt`.
- Returns Markdown for HTML pages when the request asks for `Accept: text/markdown` or `?format=markdown`.

Cloudflare Pages response hints live in [public/_headers](public/_headers). The Worker is the primary runtime header layer; `_headers` remains a static Pages hint file for generated asset dictionaries.

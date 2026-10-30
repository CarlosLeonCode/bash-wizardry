# bash-wizardry web

Landing site for [bash-wizardry](https://github.com/CarlosLeonCode/bash-wizardry), deployed on Netlify at https://bashwizardry.carlosleoncode.com (English at `/`, Spanish at `/es`).

## Stack

- Next.js 16 (App Router, React 19, React Compiler), fully static output
- TypeScript, CSS Modules + `src/app/globals.css` (design tokens, "hacker" terminal theme)
- JetBrains Mono through `next/font`
- GSAP 3 (`ScrollTrigger`, `SplitText`) via `@gsap/react`

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
```

## Structure

- `src/app/(en)/` and `src/app/(es)/es/`: one root layout per locale, so `<html lang>` is correct without a `[lang]` segment. Both render `components/HomePage.tsx` through `components/RootDocument.tsx`.
- `src/app/global-not-found.tsx`: bilingual 404 (`experimental.globalNotFound`).
- `src/app/manifest.ts`, `robots.ts`, `sitemap.ts`: metadata routes (the sitemap lists both locales with `hreflang` alternates; robots.txt allows the major AI crawlers by name). `favicon.ico`, `icon.png` (48px) and `apple-icon.png` (180px) are the tab and home-screen icons; the manifest uses `public/icons/`.
- `og.png/`, `llms.txt/`, `llms-full.txt/` in each locale folder: static route handlers for the social card (`src/lib/og.tsx`, font in `src/assets/fonts/`, SIL OFL) and the [llms.txt](https://llmstxt.org) files (`src/lib/llms.ts`, spell lists generated from the catalog). JSON-LD (one `@graph` per page) is built in `src/lib/i18n/metadata.ts`.
- `src/components/`: one component per section; only animated or interactive pieces are client components.
- `src/lib/i18n/`: typed dictionaries (`en.ts`, `es.ts`; TypeScript fails if a key is missing) and per-locale metadata.
- `src/lib/site.ts`: locale-independent data (spellbook tabs, terminal transcripts, agent signals, film assets). `src/lib/urls.ts`: project and author links.
- `src/lib/catalog.generated.ts`: **generated** from `../catalog/commands.tsv` and `../catalog/commands.es.tsv` by `../tools/gen-catalog.sh`. Don't edit it by hand; CI fails if it is out of sync.
- `src/lib/gsap.ts`: registers GSAP plugins once; import GSAP from here.
- `public/video/`: the product film (EN/ES MP4s and posters), produced by `../video/tools/export-web.sh` from the Remotion project in `../video/`.

`/en` redirects to `/` through `redirects()` in `next.config.ts`.

All motion lives in `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`. Content is fully server-rendered, so the page reads correctly without JavaScript. Terminal output shown on the page mirrors what the scripts in `../modules/` really print; keep them in sync.

## Lead capture (optional, private package)

The site can ask visitors, once and only after they copy the install command, whether they want news by email. The card comes from `@carlosleoncode/lead-capture`, a **private, proprietary** package on GitHub Packages that talks to the author's `leads` Supabase Edge Function. Nobody else needs it: without it the site builds and works exactly the same, minus the card.

**How it stays optional**

- It belongs in `optionalDependencies`. `npm install` without a token gets a 401 for it, skips it and succeeds.
- `next.config.ts` checks whether `node_modules/@carlosleoncode/lead-capture` exists. If not, `turbopack.resolveAlias` points the package and its `styles.css` at `src/lib/lead-capture-fallback.tsx` / `.css` (no-op `LeadCapture`, `recordLeadEvent`, `openLeadCapture`). TypeScript does the same through the ambient module in `src/types/lead-capture.d.ts`, which only applies when the real package is missing. Restart `next dev` after installing or removing it.
- Everything visible is gated by `LEADS_ENABLED` (`src/lib/leads.ts`): `NEXT_PUBLIC_LEADS_ENDPOINT` set **and** the package installed. Otherwise there is no card, no `[ get updates ]` button, and `/privacy` and `/es/privacidad` are 404 and left out of the sitemap and the footer. An endpoint without the package (e.g. a missing token on Netlify) prints a build warning and builds without the subscription.

**Pieces**: `components/LeadCard.tsx` (mounted once in each locale layout; English copy and role labels in `lib/i18n/en.ts`, Spanish uses the package defaults), `InstallCopyButton.tsx` (records the `copy-install` value moment from the hero and install section), `LeadUpdatesButton.tsx` (footer `[ get updates ]` / `[ recibir novedades ]`), `PrivacyPage.tsx` + `PrivacyPolicy.tsx` (adapted from clc-leads' `PRIVACY_TEMPLATE.md`, with Ley 1581 de 2012, Decreto 1377 de 2013 and GDPR references).

**Environment variables**

| Name | Where | Purpose |
|------|-------|---------|
| `NEXT_PUBLIC_LEADS_ENDPOINT` | `.env.local`, Netlify (build) | `https://<ref>.supabase.co/functions/v1/leads`. Inlined at build time; leave unset to build without the subscription. |
| `GITHUB_PACKAGES_TOKEN` | your shell, Netlify (build) | GitHub token with `read:packages`, read by `.npmrc` to install the package. CI uses the workflow's `GITHUB_TOKEN` (the package must grant this repository read access under *Package settings → Manage Actions access*). |

On Netlify set both (Site configuration → Environment variables, scope *Builds*). The package itself is added once with `npm install --save-optional @carlosleoncode/lead-capture`.

**Privacy-data gate.** The policy pages read the author's details from `PRIVACY` in `src/lib/site.ts`. Every value that still starts with `TODO` makes a production build **fail** whenever the subscription is on (endpoint set and package installed), with a message listing the missing fields, so it can never ship with a half-filled policy. Without it the check is skipped (nothing is collected).

**Backend.** The Supabase function must allow project `bash-wizardry` in `ALLOWED_PROJECTS` and the origins `https://bashwizardry.carlosleoncode.com` and `http://localhost:3000` in `ALLOWED_ORIGINS` (drop localhost once testing is done).

## Deploy (Netlify)

Configured in `../netlify.toml`: base `web`, `npm run build`, publish `.next`, Node 22, and the pinned `@netlify/plugin-nextjs` adapter. Without the adapter Netlify publishes the raw `.next` folder and every path is a 404.

To reproduce a production build locally with the Netlify CLI, build from the repo root and serve from `web/` (the server function resolves `.next` from the working directory):

```bash
netlify build --offline          # from the repo root
cd web && netlify serve --offline
```

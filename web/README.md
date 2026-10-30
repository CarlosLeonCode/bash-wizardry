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

## Deploy (Netlify)

Configured in `../netlify.toml`: base `web`, `npm run build`, publish `.next`, Node 22, and the pinned `@netlify/plugin-nextjs` adapter. Without the adapter Netlify publishes the raw `.next` folder and every path is a 404.

To reproduce a production build locally with the Netlify CLI, build from the repo root and serve from `web/` (the server function resolves `.next` from the working directory):

```bash
netlify build --offline          # from the repo root
cd web && netlify serve --offline
```

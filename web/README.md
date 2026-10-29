# bash-wizardry web

Marketing site for [bash-wizardry](https://github.com/CarlosLeonCode/bash-wizardry), deployed at https://bashwizardry.com.

## Stack

- Next.js 16 (App Router, React 19, React Compiler)
- TypeScript, CSS Modules + `src/app/globals.css` (design tokens)
- GSAP 3 (`ScrollTrigger`, `SplitText`) via `@gsap/react`
- Geist and Geist Mono through `next/font`

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Structure

- `src/app/` — layout, page, metadata routes (`manifest.ts`, `robots.ts`, `sitemap.ts`)
- `src/components/` — sections; only animated or interactive pieces are client components
- `src/lib/content.ts` — all copy, terminal sessions and the command reference (keep it in sync with `../modules/*.sh`)
- `src/lib/gsap.ts` — registers GSAP plugins once; import GSAP from here

All motion lives in `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`. Content is fully server-rendered, so the page reads correctly without JavaScript.

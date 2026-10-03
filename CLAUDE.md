# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js 15 (App Router, React 19, TypeScript) portfolio site of standalone interactive graph-visualization demos, deployed to Vercel at `https://graph-viz-next.vercel.app`. There is no backend, API route, or database. Every demo runs entirely in the browser on data embedded in the source.

## Commands

```bash
npm run dev      # next dev --turbopack, http://localhost:3000
npm run build    # runs `next lint --max-warnings=100`, then `next build`
npm run start    # serve the production build
npm run lint     # next lint --quiet (errors only)
```

There is no test suite. Verify changes by running `npm run build` and loading the affected route in the dev server.

`next.config.ts` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so `next build` alone does not catch type errors. Run `npx tsc --noEmit` to type-check. The lint step in `npm run build` fails the build only when there are more than 100 warnings.

## Architecture

**Route → page component split.** Each demo has a route under `src/app/(routes)/<slug>/page.tsx`. That file is a server-component wrapper: it exports `metadata = demoMetadata('<slug>')` and renders one component from `src/components/pages/` inside `<DemoShell slug="<slug>">`. Keep `'use client'` out of the wrappers, or the `metadata` export stops working. The `(routes)` route group does not appear in the URL. All of a demo's logic is in its page component, which is a single large `'use client'` file of 450–925 lines. A page component contains its data (hardcoded `nodes`/`edges` or `entities`/`relations` arrays, or a `defaultGraphData` object), its layout and simulation code, and its Tailwind UI for filters, detail panels, and timelines.

**Rendering libraries by demo:**
- D3 force simulations: `ForceDirectedGraph`, `McpGraphVisualization`, `ProofOfTruthD3Graph`, `AirlineAIGraph`.
- Cytoscape.js: `CytoscapeGraphViz1/2/3`, `CytoscapeGraphExplorer`, `LifeSciencesGraphViz1`. These usually define an inner `GraphVisualization` component that creates the `cytoscape()` instance in a `useEffect`, keeps it in `cyRef`, and calls `destroy()` in the cleanup. Timeline demos filter the full graph by a time cursor that advances on `setInterval`.
- Leaflet, with markercluster and heat plugins: `GdeltRecordsViewer`. It reads `src/data/gdelt-gkg.json`, which is the only external data file. Leaflet needs `window`, so the route imports `DynamicGdeltRecordsViewer`, which loads the component through `next/dynamic` with `ssr: false`. Use the same pattern for any new component that imports a browser-only library at module level. Marker icons come from `public/marker-icon*.png`.

**Shared pieces.** These are few:
- `src/lib/demos.ts`: the demo registry, with each demo's slug, display name, description, tags, component file and `listed` flag. It also has `requireDemo()`, `demoMetadata()`, `demoSourceUrl()` and `tagClassName()`.
- `src/components/DemoShell.tsx`: the shared demo frame. It renders a white header with the breadcrumb, `<h1>`, description, tags and a View Source link, all from the registry, and puts the demo below it in a `max-w-6xl` container. Demo components must not render their own page title or full-page chrome. The Cytoscape timeline demos render as a card that is `lg:h-[800px]` and stacks on smaller screens; do not reintroduce `h-screen`.
- `src/app/layout.tsx`: renders `SiteHeader` and `SiteFooter`, and holds the SEO metadata (including the `'%s | Don Branson'` title template) and JSON-LD.
- `SiteHeader` and `SiteFooter` deliberately copy the nav and footer in donbr.github.io's `Layout.tsx`: white nav, a blue-500 underline on the active link, a hamburger menu below `lg`, and a gray-800 footer. Keep the two sites visually in step. Tag colors use the same 100/800 pairs as the portfolio's `tagColorMap`.
- `src/lib/site.ts`: Open Graph fields shared by the layout and `demoMetadata()`. A route's own `openGraph`/`twitter` replace the layout's objects rather than merging with them, so per-demo share previews must re-include these fields.
- `src/app/opengraph-image.tsx`: generates the social preview image (`og:image` and `twitter:image`) for every route at build time with `next/og`. Do not add a hardcoded `images` entry to the layout's `openGraph` or `twitter` metadata. No custom font is loaded; text uses Tailwind's default `font-sans` system stack, as donbr.github.io does.
- `src/utils/colors.ts`: the graph palette every demo uses, built from `tailwindcss/colors`. It has three parts:
  - `categoricalColors(types)` assigns 500 fill / 700 border / 100 badge / 800 text sets to types in the order given. The D3 demos use it, so legend order fixes the colors.
  - Fixed type maps: `lifeSciencesNodeColors`/`EdgeColors` and `temporalNodeColors`/`EdgeColors`.
  - `graphChrome` for edges, labels, selection, highlight and dimming. Selection and highlight are near-black (no palette fill shares it). D3 nodes have a white idle outline, and Cytoscape `node:selected` uses `cytoscapeSelectedStyle` (white border plus a dark underlay ring).

  Don't hardcode hex colors or D3 color schemes in a demo; add a map or entry here. The legend `bg-*-500` classes in the demos rely on the same Tailwind values.
- `src/lib/utils.ts`: the `cn()` helper, combining clsx and tailwind-merge.
- `src/hooks/useTimelineAnimation.ts`: currently unused.

## Adding or exposing a demo

1. Add an entry to `demos` in `src/lib/demos.ts`. The home grid, sitemap, breadcrumb label, page title and canonical URL all derive from it.
2. Add `src/app/(routes)/<slug>/page.tsx` that exports `metadata = demoMetadata('<slug>')` and renders the page component inside `<DemoShell slug="<slug>">`. Set `component` in the registry entry to the component's file name; the View Source link uses it. `demoMetadata` throws at build time if the slug is not registered.

`listed: false` keeps a demo off the home grid and out of the sitemap while it still builds and gets metadata. The `temporal-graph-explorer`, `cytoscape-graph-viz1`, `cytoscape-graph-viz2`, and `cytoscape-graph-explorer` prototypes are registered this way.

## Config gotchas

- **Tailwind is v3.** `globals.css` uses `@tailwind` directives, and `postcss.config.js` uses the `tailwindcss` and `autoprefixer` plugins. `@tailwindcss/postcss` (v4) is in devDependencies but is not wired up. Do not mix v4 syntax into the CSS.
- **Two ESLint configs exist.** `eslint.config.mjs` is the flat config ESLint 9 uses, and it turns off `no-explicit-any`, `no-unused-vars`, and `exhaustive-deps`. `.eslintrc.json` is a legacy config that sets those rules to `warn`.
- **Path alias.** `@/*` resolves to `src/*`. Route wrappers mix `@/` and relative `../../../components/pages/...` imports.
- `package.json` has a self-referencing `"graph-viz-next": "file:"` dependency and an `msw` worker entry with `public/mockServiceWorker.js`, but MSW is not imported anywhere.

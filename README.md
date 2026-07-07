# Responsive Breadcrumb

A measured, responsive breadcrumb component for React and shadcn/ui.

The component measures real rendered DOM widths, solves a responsive layout with a pure TypeScript layout solver, and renders collapsed breadcrumb ranges through accessible popovers or mobile drawers.

## Demo

The demo app is deployed with GitHub Pages from `apps/web`.

After the first successful workflow run, the site will be available at:

```txt
https://fefedu973.github.io/responsive-breadcrumb/
```

## Features

- Real DOM measurement for items, separators, ellipsis, next controls, and title-only fallback.
- Pure solver in `solveBreadcrumbLayout.ts`.
- Single contiguous collapse by default.
- Optional multi-ellipsis mode.
- Non-collapsible head/tail items with `alwaysShow`.
- Programmatic pre-collapse with `forceCollapse`.
- Priority-aware collapse with `itemPriority`.
- Title-only fallback for very small containers.
- Optional scroll and wrap overflow modes.
- Accessible popover and drawer overlays.
- Localizable visible and ARIA labels through `strings`.
- Optional Schema.org JSON-LD or microdata.
- Focused solver tests.

## Project Structure

```txt
apps/web/src/components/responsive/
  ResponsiveBreadcrumb.tsx
  BreadcrumbRenderer.tsx
  solveBreadcrumbLayout.ts
  useBreadcrumbMeasurements.ts
  types.ts

apps/web/tests/
  solveBreadcrumbLayout.test.ts
```

Local experiments and old implementations are intentionally not published.

## Development

Install dependencies:

```bash
bun install
```

Run the demo locally:

```bash
bun run --cwd apps/web dev
```

Open:

```txt
http://localhost:3005
```

Run checks:

```bash
bun run --cwd apps/web test:solver
bunx tsc --noEmit -p apps/web/tsconfig.json
bun run --cwd apps/web build
```

## GitHub Pages Deployment

The workflow at `.github/workflows/deploy-pages.yml` runs on pushes to `main`.

It:

1. Installs dependencies with Bun.
2. Runs solver tests.
3. Runs TypeScript.
4. Builds the Next.js demo as a static export.
5. Uploads `apps/web/out` to GitHub Pages.

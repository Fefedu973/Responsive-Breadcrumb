import { ChevronRight, Github } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ApiReference,
  ApiReferenceMarkdownButton,
} from "@/components/demo/api-reference";
import { CopyCommand } from "@/components/demo/copy-command";
import { DemoSection } from "@/components/demo/demo-section";
import { FeatureGrid } from "@/components/demo/feature-demos";
import { Inspector } from "@/components/demo/inspector";
import { Playground } from "@/components/demo/playground";
import { Button } from "@/components/ui/button";

const INSTALL_COMMAND =
  "bunx shadcn@latest add Fefedu973/responsive-breadcrumb/responsive-breadcrumb";
const GITHUB_URL = "https://github.com/Fefedu973/responsive-breadcrumb";

const NAV_LINKS = [
  { href: "#playground", label: "Playground" },
  { href: "#features", label: "Features" },
  { href: "#inspector", label: "Inspector" },
  { href: "#api", label: "API" },
];

const HIGHLIGHTS = [
  "Real DOM measurement",
  "Single-pass layout solver",
  "Popover → drawer on mobile",
  "Truncation before collapse",
  "RTL & localization",
  "Schema.org built in",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 md:px-6">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <ChevronRight className="size-4" aria-hidden />
            </span>
            <span className="hidden sm:inline">Responsive Breadcrumb</span>
          </a>
          <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Sections">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
              >
                <Github className="size-4" aria-hidden />
              </a>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Hero */}
        <section className="relative py-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            React 19 · shadcn/ui · Tailwind CSS v4
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            The breadcrumb that always fits.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            ResponsiveBreadcrumb measures its real rendered DOM, solves the best
            layout in a single pass, then truncates, collapses, or falls back to a
            title — it never overflows, at any container width.
          </p>
          <div className="mt-8">
            <CopyCommand command={INSTALL_COMMAND} />
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight}
                className="rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {highlight}
              </li>
            ))}
          </ul>
        </section>

        <DemoSection
          id="playground"
          index="01 — Playground"
          title="Try every prop, live"
          description="One breadcrumb, all the main options. Drag the handle or press play to watch it truncate, collapse into ellipsis menus, and finally fall back to a single title."
        >
          <Playground />
        </DemoSection>

        <DemoSection
          id="features"
          index="02 — Features"
          title="Every capability, isolated"
          description="Each card demonstrates exactly one feature with its own resizable stage. All crumbs and menu entries are clickable — clicks surface as toasts."
        >
          <FeatureGrid />
        </DemoSection>

        <DemoSection
          id="inspector"
          index="03 — Inspector"
          title="See what the solver sees"
          description="The component exposes its internals: measured widths, the collapsed ranges, truncation results and remaining space, streamed through onDebugStateChange on every layout pass."
        >
          <Inspector />
        </DemoSection>

        <DemoSection
          id="api"
          index="04 — API"
          title="Props reference"
          description="The full public surface of ResponsiveBreadcrumb, grouped by concern."
          action={<ApiReferenceMarkdownButton />}
        >
          <ApiReference />
        </DemoSection>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:px-6">
          <p>
            Built on{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              shadcn/ui
            </a>{" "}
            primitives.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            github.com/Fefedu973/responsive-breadcrumb
          </a>
        </div>
      </footer>
    </div>
  );
}

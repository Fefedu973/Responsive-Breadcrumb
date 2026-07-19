import assert from "node:assert/strict";
import { createApiReferenceMarkdown } from "../src/lib/api-reference-markdown";

const markdown = createApiReferenceMarkdown(
  [
    {
      title: "Rendering",
      description: "Rendering options.",
      rows: [
        {
          name: "mode",
          type: '"compact" | "full"',
          defaultValue: '"compact"',
          description: "Selects the rendered layout.",
        },
        {
          name: "renderItem",
          type: "(context) => ReactNode",
          description: "Renders an item.",
        },
      ],
    },
  ],
  {
    title: "Responsive Breadcrumb props reference",
    description: "Complete public API.",
    installCommand: "bunx shadcn@latest add example",
    documentationUrl: "https://example.com/#api",
  },
);

assert.ok(markdown.startsWith("# Responsive Breadcrumb props reference\n"));
assert.match(markdown, /## Installation/);
assert.match(markdown, /## Rendering/);
assert.ok(markdown.includes('`"compact" \\| "full"`'));
assert.ok(markdown.includes("| `renderItem` | `(context) => ReactNode` | — |"));
assert.match(markdown, /\[Open the documentation\]\(https:\/\/example\.com\/#api\)/);

console.log("API reference Markdown tests passed");

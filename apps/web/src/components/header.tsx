"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { ResponsiveBreadcrumb } from "./responsive/ResponsiveBreadcrumb";
import { BreadcrumbSeparator } from "./ui/breadcrumb";

export default function Header() {
  const links = [{ to: "/", label: "Home" }] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1 h-15">
        {/* <nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} href={to}>
								{label}
							</Link>
						);
					})}
				</nav> */}
        <ResponsiveBreadcrumb
          items={[
            { key: "home", label: "Home", href: "/", canCollapse: false },
            { key: "docs", label: "Docs", href: "/docs" },
            { key: "guides", label: "Guides", href: "/docs/guides" },
            {
              key: "topic",
              label: "A Very Long Topic Name",
              href: "/docs/guides/topic",
            },
            { key: "page", label: "Current Page", canCollapse: false }, // last pinned by default
          ]}
          renderSeparator={() => <BreadcrumbSeparator />}
          strategy="center" // 'center' | 'start' | 'end'
          preference="minimize-count" // 'minimize-count' | 'minimize-visibility'
        />

        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}

import { loadFont } from "@remotion/google-fonts/Inter";
import {
  Check,
  ChevronRight,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";

import dashboardData from "@/app/dashboard/data.json";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResponsiveBreadcrumb } from "../../web/src/components/responsive/ResponsiveBreadcrumb";
import type { BreadcrumbData } from "../../web/src/components/responsive/types";
import { TooltipProvider as ProductTooltipProvider } from "../../web/src/components/ui/tooltip";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const colors = {
  background: "#09090b",
  panel: "#111113",
  raised: "#18181b",
  line: "#2a2a2e",
  muted: "#a1a1aa",
  text: "#fafafa",
  accent: "#ffffff",
  green: "#a3e635",
};

const videoBreadcrumbItems: BreadcrumbData[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "#dashboard",
    canCollapse: false,
  },
  {
    key: "workspace",
    label: "Workspace",
    href: "#workspace",
    icon: <Users className="size-4" />,
  },
  {
    key: "engineering",
    label: "Engineering",
    href: "#engineering",
    icon: <FileText className="size-4" />,
  },
  {
    key: "security-policies",
    label: "Security Policies",
    href: "#security-policies",
    icon: <ShieldCheck className="size-4" />,
  },
  {
    key: "access-control",
    label: "Access Control Lists",
    href: "#access-control",
    canTruncate: true,
  },
  {
    key: "edit-role",
    label: "Edit Super Admin Role",
    href: "#edit-role",
    canCollapse: false,
    canTruncate: true,
  },
];

const forceVideoCollapse = (_item: BreadcrumbData, index: number) =>
  index > 0 && index < 4;

const crispEase = Easing.bezier(0.16, 1, 0.3, 1);

export const LaunchVideo = () => {
  const frame = useCurrentFrame();

  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.add("dark");

    return () => {
      if (!wasDark) {
        root.classList.remove("dark");
      }
    };
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily,
        overflow: "hidden",
      }}
    >
      <AmbientBackground frame={frame} />
      <Sequence durationInFrames={75} name="Intro statement">
        <IntroScene />
      </Sequence>
      <Sequence from={63} durationInFrames={115} name="Responsive resize demo">
        <ResponsiveScene />
      </Sequence>
      <Sequence from={165} durationInFrames={98} name="Collapsed menu close-up">
        <ContextScene />
      </Sequence>
      <Sequence from={250} durationInFrames={55} name="Shadcn install command">
        <CommandScene />
      </Sequence>
      <Sequence from={296} durationInFrames={64} name="Dashboard final reveal">
        <DashboardFinalScene />
      </Sequence>
      <ProgressRail frame={frame} />
    </AbsoluteFill>
  );
};

const AmbientBackground = ({ frame }: { frame: number }) => {
  return (
    <AbsoluteFill aria-hidden>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          translate: `${interpolate(frame, [0, 360], [0, -64])}px ${interpolate(frame, [0, 360], [0, -32])}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -260,
          top: -440,
          borderRadius: "50%",
          opacity: 0.16,
          filter: "blur(90px)",
          background: "radial-gradient(circle, #52525b 0%, transparent 68%)",
          translate: `${interpolate(frame, [0, 360], [0, 100])}px 0px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          right: -280,
          bottom: -440,
          borderRadius: "50%",
          opacity: 0.12,
          filter: "blur(110px)",
          background: "radial-gradient(circle, #71717a 0%, transparent 70%)",
          translate: `${interpolate(frame, [0, 360], [0, -80])}px 0px`,
        }}
      />
    </AbsoluteFill>
  );
};

const IntroScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 64, 75], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 86,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: interpolate(frame, [4, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `0px ${interpolate(frame, [4, 18], [24, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px`,
        }}
      >
        <BrandMark />
        <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8 }}>
          responsive-breadcrumb
        </span>
        <Pill>shadcn/ui ready</Pill>
      </div>

      <div
        style={{
          position: "absolute",
          left: 104,
          top: 205,
          fontSize: 148,
          lineHeight: 0.86,
          fontWeight: 800,
          letterSpacing: -8,
          opacity: interpolate(frame, [8, 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `${interpolate(frame, [8, 25], [-55, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px 0px`,
        }}
      >
        BREADCRUMBS.
        <br />
        <span style={{ color: colors.muted }}>SOLVED.</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          bottom: 98,
          perspective: 1500,
          opacity: interpolate(frame, [18, 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          scale: interpolate(frame, [18, 34], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `0px ${interpolate(frame, [18, 34], [90, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px`,
        }}
      >
        <div style={{ transform: "rotateX(7deg) rotateY(-4deg) skewY(-0.7deg)" }}>
          <Surface style={{ padding: "34px 42px" }}>
            <LiveBreadcrumb mode="full" size={30} />
          </Surface>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ResponsiveScene = () => {
  const frame = useCurrentFrame();
  const stageWidth = interpolate(frame, [12, 52, 82, 108], [1510, 720, 720, 1180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const collapsed = stageWidth < 980;

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 9, 101, 115], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <SceneLabel index="01" text="RESPONSIVE BY DESIGN" />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 105,
          textAlign: "center",
          fontSize: 126,
          lineHeight: 0.95,
          fontWeight: 800,
          letterSpacing: -7,
          opacity: interpolate(frame, [3, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `0px ${interpolate(frame, [3, 18], [44, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px`,
        }}
      >
        ALWAYS FITS.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 245,
          textAlign: "center",
          color: colors.muted,
          fontSize: 38,
          fontWeight: 500,
          letterSpacing: -1.2,
        }}
      >
        Real DOM measurements. One deterministic pass.
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 365,
          height: 360,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: 1600,
          scale: interpolate(frame, [0, 45, 95], [0.94, 1.04, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
        }}
      >
        <div style={{ width: stageWidth, position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              color: colors.muted,
              fontSize: 28,
              fontFamily: "Consolas, monospace",
            }}
          >
            <span>{Math.round(stageWidth)}px</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={24} /> live resize
            </span>
          </div>
          <div style={{ transform: "rotateX(2deg) skewY(-0.35deg)" }}>
            <Surface
              style={{
                height: 126,
                padding: "26px 34px",
                overflow: "hidden",
                boxShadow: "0 38px 100px rgba(0,0,0,.45)",
              }}
            >
              <LiveBreadcrumb
                key={Math.round(stageWidth)}
                mode={collapsed ? "collapsed" : "full"}
                size={27}
              />
            </Surface>
          </div>
          <div
            style={{
              position: "absolute",
              top: 67,
              right: -12,
              width: 24,
              height: 126,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 7,
                height: 56,
                borderRadius: 99,
                background: collapsed ? colors.accent : "#52525b",
                boxShadow: collapsed ? "0 0 24px rgba(255,255,255,.32)" : "none",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 100,
          display: "flex",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Metric label="truncate" active={stageWidth < 1260} />
        <Metric label="collapse" active={collapsed} />
        <Metric label="title-only" active={stageWidth < 520} />
      </div>
    </AbsoluteFill>
  );
};

const ContextScene = () => {
  const frame = useCurrentFrame();
  const menuVisible = frame >= 31;

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 8, 86, 98], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <SceneLabel index="02" text="CONTEXT, PRESERVED" />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 108,
          fontSize: 108,
          lineHeight: 0.92,
          fontWeight: 800,
          letterSpacing: -6,
          zIndex: 4,
          opacity: interpolate(frame, [3, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
        }}
      >
        ZERO LOST
        <br />
        <span style={{ color: colors.muted }}>CONTEXT.</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 355,
          fontSize: 40,
          color: colors.muted,
          fontWeight: 500,
        }}
      >
        Hidden. One click away.
      </div>

      <div
        style={{
          position: "absolute",
          left: 620,
          top: 340,
          width: 1250,
          perspective: 1300,
          scale: interpolate(frame, [0, 45, 90], [0.92, 1.12, 1.2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `${interpolate(frame, [0, 90], [180, 20], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px ${interpolate(frame, [0, 90], [80, -15], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px`,
        }}
      >
        <div style={{ transform: "rotateY(-8deg) rotateX(4deg) skewY(-1deg)" }}>
          <Surface
            style={{
              minHeight: 130,
              padding: "30px 38px",
              overflow: "visible",
              boxShadow: "0 55px 140px rgba(0,0,0,.58)",
            }}
          >
            <LiveBreadcrumb
              mode="collapsed"
              size={36}
              openMenu={menuVisible}
            />
          </Surface>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CommandScene = () => {
  const frame = useCurrentFrame();
  const command = "npx shadcn@latest add dashboard-01";
  const characterCount = Math.floor(
    interpolate(frame, [8, 34], [0, command.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }),
  );

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 7, 50, 55], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <SceneLabel index="03" text="DROP-IN READY" />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 118,
          textAlign: "center",
          fontSize: 112,
          fontWeight: 800,
          letterSpacing: -6,
        }}
      >
        START WITH SHADCN.
      </div>
      <div
        style={{
          position: "absolute",
          left: 175,
          right: 175,
          top: 360,
          perspective: 1450,
          scale: interpolate(frame, [0, 18], [0.88, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `0px ${interpolate(frame, [0, 18], [90, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px`,
        }}
      >
        <div style={{ transform: "rotateX(5deg) rotateY(2deg) skewX(-1deg)" }}>
          <Surface
            style={{
              minHeight: 280,
              padding: "34px 42px 38px",
              boxShadow: "0 60px 160px rgba(0,0,0,.62)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingBottom: 26,
                borderBottom: `1px solid ${colors.line}`,
                color: colors.muted,
              }}
            >
              <Terminal size={28} />
              <span style={{ fontSize: 24, fontWeight: 600 }}>terminal</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <WindowDot color="#3f3f46" />
                <WindowDot color="#52525b" />
                <WindowDot color="#71717a" />
              </div>
            </div>
            <div
              style={{
                paddingTop: 34,
                fontFamily: "Consolas, 'SFMono-Regular', monospace",
                fontSize: 48,
                letterSpacing: -1.8,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: colors.muted }}>$ </span>
              {command.slice(0, characterCount)}
              <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: colors.green }}>▍</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 30,
                color: colors.green,
                fontSize: 30,
                opacity: interpolate(frame, [37, 45], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: crispEase,
                }),
              }}
            >
              <Check size={30} strokeWidth={3} /> Dashboard ready
              <span style={{ color: colors.muted }}>•</span>
              <span style={{ color: colors.text }}>Add one responsive breadcrumb.</span>
            </div>
          </Surface>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const DashboardFinalScene = () => {
  const frame = useCurrentFrame();
  const blur = interpolate(frame, [25, 45], [0, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: crispEase,
  });
  const brightness = interpolate(frame, [25, 45], [1, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: crispEase,
  });
  const endCardProgress = interpolate(frame, [31, 47], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: crispEase,
  });

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 90,
          width: 1600,
          height: 900,
          perspective: 1800,
          transformOrigin: "50% 22%",
          scale: interpolate(frame, [0, 24, 48], [1.16, 0.99, 0.965], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          }),
          translate: `${interpolate(frame, [0, 24], [-70, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px ${interpolate(frame, [0, 24], [115, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: crispEase,
          })}px`,
        }}
      >
        <div
          style={{
            height: "100%",
            filter: `blur(${blur}px) brightness(${brightness})`,
            transform: `rotateX(${interpolate(frame, [0, 26], [4.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: crispEase,
            })}deg) rotateY(${interpolate(frame, [0, 26], [-3.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: crispEase,
            })}deg) skewY(${interpolate(frame, [0, 26], [-0.7, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: crispEase,
            })}deg)`,
          }}
        >
          <RealDashboard />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 42,
          right: 62,
          zIndex: 5,
          padding: "11px 16px",
          border: `1px solid ${colors.line}`,
          borderRadius: 999,
          background: "rgba(9,9,11,.78)",
          color: colors.muted,
          fontSize: 19,
          fontWeight: 650,
          letterSpacing: 0.4,
          opacity: interpolate(frame, [8, 15, 25, 33], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        OFFICIAL DASHBOARD-01 · PRESET B0
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          opacity: endCardProgress,
          scale: 0.92 + endCardProgress * 0.08,
          translate: `0px ${(1 - endCardProgress) * 42}px`,
        }}
      >
        <BrandMark size={62} />
        <div
          style={{
            marginTop: 28,
            fontSize: 112,
            lineHeight: 0.88,
            fontWeight: 800,
            letterSpacing: -7,
            textShadow: "0 10px 40px rgba(0,0,0,.55)",
          }}
        >
          RESPONSIVE SHADCN.
          <br />
          <span style={{ color: "#b4b4bc" }}>MORE COMPONENTS.</span>
        </div>
        <div
          style={{
            marginTop: 46,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "17px 24px",
            border: "1px solid rgba(255,255,255,.18)",
            borderRadius: 999,
            background: "rgba(9,9,11,.58)",
            boxShadow: "0 20px 60px rgba(0,0,0,.34)",
            backdropFilter: "blur(18px)",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          <ExternalLink size={31} /> github.com/Fefedu973/responsive-breadcrumb
        </div>
      </div>
    </AbsoluteFill>
  );
};

type BreadcrumbMode = "full" | "collapsed";

const LiveBreadcrumb = ({
  mode,
  size,
  openMenu = false,
}: {
  mode: BreadcrumbMode;
  size: number;
  openMenu?: boolean;
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let attempts = 0;

    const syncMenu = () => {
      const trigger = rootRef.current?.querySelector<HTMLButtonElement>(
        'button[aria-label^="Show "][aria-label*="collapsed"]',
      );

      if (!trigger && attempts < 12) {
        attempts += 1;
        animationFrame = requestAnimationFrame(syncMenu);
        return;
      }

      if (!trigger) {
        return;
      }

      const isOpen =
        trigger.getAttribute("aria-expanded") === "true" ||
        trigger.getAttribute("data-state") === "open";

      if (openMenu !== isOpen) {
        trigger.click();
      }
    };

    animationFrame = requestAnimationFrame(syncMenu);
    return () => cancelAnimationFrame(animationFrame);
  }, [mode, openMenu]);

  return (
    <ProductTooltipProvider>
      <div
        ref={rootRef}
        className="video-breadcrumb"
        style={{ "--video-breadcrumb-size": `${size}px` } as CSSProperties}
      >
        <ResponsiveBreadcrumb
          items={videoBreadcrumbItems}
          strategy="start"
          preference="none"
          showHomeIcon
          enableTruncation
          truncateMinWidth={72}
          truncateMaxWidth={220}
          showCollapsedCount
          collapsedCountPlacement="outside"
          alwaysShow={{ head: 1, tail: 1 }}
          forceCollapse={mode === "collapsed" ? forceVideoCollapse : undefined}
        />
      </div>
    </ProductTooltipProvider>
  );
};

const DashboardBreadcrumbHeader = () => (
  <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
    <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <div className="min-w-0 flex-1 overflow-hidden">
        <LiveBreadcrumb mode="collapsed" size={14} />
      </div>
    </div>
  </header>
);

const RealDashboard = () => (
  <TooltipProvider>
    <div
      className="dark h-full w-full overflow-hidden rounded-[28px] bg-background text-foreground"
      style={{
        border: "1px solid rgba(255,255,255,.13)",
        boxShadow:
          "0 65px 180px rgba(0,0,0,.68), inset 0 1px rgba(255,255,255,.05)",
      }}
    >
      <SidebarProvider
        className="h-full min-h-0"
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "3.5rem",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="h-full min-h-0 overflow-hidden">
          <DashboardBreadcrumbHeader />
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={dashboardData} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </TooltipProvider>
);

const Surface = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      borderRadius: 24,
      border: `1px solid ${colors.line}`,
      background: "linear-gradient(145deg, rgba(28,28,31,.98), rgba(15,15,17,.98))",
      boxShadow: "0 35px 100px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.055)",
      ...style,
    }}
  >
    {children}
  </div>
);

const BrandMark = ({ size = 44 }: { size?: number }) => (
  <span
    style={{
      display: "grid",
      width: size,
      height: size,
      placeItems: "center",
      borderRadius: size * 0.27,
      background: colors.text,
      color: "#18181b",
      boxShadow: "0 8px 28px rgba(255,255,255,.12)",
    }}
  >
    <ChevronRight size={size * 0.62} strokeWidth={3} />
  </span>
);

const Pill = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: 38,
      paddingInline: 15,
      borderRadius: 999,
      border: `1px solid ${colors.line}`,
      background: "rgba(24,24,27,.82)",
      color: colors.muted,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: -0.3,
    }}
  >
    {children}
  </span>
);

const SceneLabel = ({ index, text }: { index: string; text: string }) => (
  <div
    style={{
      position: "absolute",
      left: 92,
      top: 62,
      display: "flex",
      alignItems: "center",
      gap: 16,
      color: colors.muted,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 2.4,
    }}
  >
    <span style={{ color: colors.text }}>{index}</span>
    <span style={{ width: 52, height: 1, background: "#52525b" }} />
    {text}
  </div>
);

const Metric = ({ label, active }: { label: string; active: boolean }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "13px 18px",
      borderRadius: 999,
      border: `1px solid ${active ? "#71717a" : colors.line}`,
      background: active ? "#27272a" : "rgba(24,24,27,.65)",
      color: active ? colors.text : "#71717a",
      fontSize: 24,
      fontWeight: 650,
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: active ? colors.text : "#3f3f46",
        boxShadow: active ? "0 0 16px rgba(255,255,255,.5)" : "none",
      }}
    />
    {label}
  </div>
);

const WindowDot = ({ color }: { color: string }) => (
  <span style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
);

const ProgressRail = ({ frame }: { frame: number }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      width: `${interpolate(frame, [0, 359], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}%`,
      height: 4,
      background: colors.text,
      boxShadow: "0 0 20px rgba(255,255,255,.28)",
      zIndex: 100,
    }}
  />
);

import { ChevronRight } from "lucide-react";
import { CallsToAction } from "@/components/calls-to-action";
import { CopyCommand } from "@/components/copy-command";
import { HandDrawnUnderline } from "@/components/hand-drawn-underline";
import { Reveal } from "@/components/reveal";
import { ThemedImage } from "@/components/themed-image";
import { screenImage } from "@/lib/screens";
import { HEADLINE_LINES, HERO_PILL, INSTALL_COMMAND, LINKS, SUBLINE } from "@/lib/site";

const DASHBOARD = screenImage("/screens/dashboard");

const GRID_CELL_PX = 48;

const LIT_SQUARES = [
  [-9, 4],
  [-7, 1],
  [-5, 3],
  [-3, 0],
  [-11, 2],
  [4, 0],
  [6, 2],
  [8, 4],
  [10, 1],
] as const;

function LitSquares() {
  return LIT_SQUARES.map(([column, row]) => (
    <span
      key={`${column}:${row}`}
      className="hero-grid-square absolute"
      style={{ left: `calc(round(down, 50%, ${GRID_CELL_PX}px) + ${column * GRID_CELL_PX}px)`, top: row * GRID_CELL_PX }}
    />
  ));
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10 overflow-hidden">
      <div className="hero-grid absolute inset-0">
        <LitSquares />
      </div>
      <div className="hero-grid-highlight absolute inset-0 motion-safe:animate-grid-sweep" />
      <div className="absolute top-0 left-1/2 h-[28rem] w-[56rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-3xl motion-safe:animate-glow-pulse dark:bg-accent/25" />
    </div>
  );
}

function Badge() {
  return (
    <a
      href={LINKS.github}
      className="group relative rounded-full bg-linear-to-r from-[#363FF9] via-[#8b5cf6] to-[#ec4899] p-px shadow-[0_0_28px_-6px_#8b5cf6] transition-shadow hover:shadow-[0_0_36px_-4px_#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span className="flex items-center gap-2.5 rounded-full bg-background py-1.5 pr-3 pl-3.5 text-sm font-medium">
        <span aria-hidden="true">🎉</span>
        <span aria-hidden="true" className="h-4 w-px bg-border" />
        <span>{HERO_PILL}</span>
        <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

function Headline() {
  const [lead, highlight, trail] = HEADLINE_LINES;

  return (
    <h1 className="heading-display text-[min(3rem,10.5vw)] text-balance sm:text-[clamp(3.5rem,9vw,6rem)]">
      <span className="block text-zinc-500 dark:text-zinc-400">{lead}</span>{" "}
      <span className="mb-[0.24em] block text-foreground">
        <span className="relative inline-block">
          {highlight}
          <HandDrawnUnderline className="absolute top-[86%] left-[-2%] w-[104%] text-[#363FF9] dark:text-[#5c63ff]" />
        </span>
      </span>{" "}
      <span className="block text-zinc-500 dark:text-zinc-400">{trail}</span>
    </h1>
  );
}

function DashboardFrame() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div aria-hidden="true" className="absolute inset-x-[8%] top-0 bottom-[45%] -z-10 rounded-full bg-accent/30 blur-[90px] dark:bg-accent/35" />
      <div className="overflow-hidden rounded-xl mask-b-from-60% border border-border bg-card shadow-2xl shadow-accent/10 ring-1 ring-black/5 dark:ring-white/5">
        <div className="flex h-9 items-center gap-2 border-b border-border bg-muted px-4">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="mx-auto h-5 w-1/3 max-w-xs rounded-md bg-background/80" />
        </div>
        <ThemedImage
          light={DASHBOARD.light}
          dark={DASHBOARD.dark}
          sources={DASHBOARD.sources}
          sizes="(min-width: 1200px) 1152px, 100vw"
          alt="The Databasify dashboard"
          width={1440}
          height={900}
          className="block h-auto w-full"
          priority
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative isolate px-4 pt-16 sm:px-6 sm:pt-20">
      <HeroBackdrop />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 text-center">
        <Badge />
        <Headline />
        <p className="max-w-3xl text-lg text-balance text-muted-foreground sm:text-xl">{SUBLINE}</p>
        <CallsToAction />
        <div className="w-full max-w-2xl">
          <CopyCommand command={INSTALL_COMMAND} />
        </div>
      </div>
      <div className="mt-14 sm:mt-16">
        <Reveal>
          <DashboardFrame />
        </Reveal>
      </div>
    </section>
  );
}

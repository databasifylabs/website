"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ThemedImage } from "@/components/themed-image";
import { screenImage } from "@/lib/screens";
import type { TOUR } from "@/lib/site";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function targetIndex(key: string, current: number, count: number): number | null {
  if (key === "ArrowRight") {
    return (current + 1) % count;
  }
  if (key === "ArrowLeft") {
    return (current - 1 + count) % count;
  }
  if (key === "Home") {
    return 0;
  }
  if (key === "End") {
    return count - 1;
  }
  return null;
}

function TourPanel({ tab, hidden }: { tab: (typeof TOUR)[number]; hidden: boolean }) {
  const screen = screenImage(tab.screen);

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      id={`tour-panel-${tab.id}`}
      aria-labelledby={`tour-tab-${tab.id}`}
      hidden={hidden}
      className="grid items-center gap-8 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:grid-cols-5 lg:gap-12"
    >
      <div className="flex flex-col gap-5 lg:col-span-2">
        <h3 className="text-2xl font-semibold tracking-tight">{tab.label}</h3>
        <p className="leading-relaxed text-muted-foreground">{tab.body}</p>
        <ul className="flex flex-col gap-2.5 text-sm">
          {tab.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-accent/10 ring-1 ring-black/5 lg:col-span-3 dark:ring-white/5">
        <ThemedImage
          light={screen.light}
          dark={screen.dark}
          sources={screen.sources}
          sizes="(min-width: 1200px) 690px, 100vw"
          alt={`${tab.label} in the Databasify dashboard`}
          width={1440}
          height={900}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

export function TourTabs({ tabs }: { tabs: typeof TOUR }) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = targetIndex(event.key, index, tabs.length);
    if (next === null) {
      return;
    }
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Product tour" className="mx-auto flex w-max gap-1 rounded-xl border border-border bg-card/60 p-1 backdrop-blur">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`tour-tab-${tab.id}`}
              aria-selected={selected === index}
              aria-controls={`tour-panel-${tab.id}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${FOCUS_RING} ${
                selected === index ? "bg-brand text-accent-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab, index) => (
        <TourPanel key={tab.id} tab={tab} hidden={selected !== index} />
      ))}
    </div>
  );
}

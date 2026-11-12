"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemedImage } from "@/components/themed-image";
import { ThemeToggle } from "@/components/theme-toggle";
import { CTA_LABELS, LINKS } from "@/lib/site";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Docs", href: LINKS.docs },
  { label: "GitHub", href: LINKS.github },
] as const;

const NAV_LINK_CLASS = "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

const starFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

function useScrolled(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 4);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrolled;
}

export function Header({ stars }: { stars?: number | null }) {
  const scrolled = useScrolled();
  const border = scrolled ? "border-border" : "border-transparent";

  return (
    <header className={`sticky top-0 z-50 border-b ${border} bg-background/70 backdrop-blur-xl transition-colors`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <ThemedImage
            light="/brand/databasify-logo-light.svg"
            dark="/brand/databasify-logo-dark.svg"
            alt="Databasify"
            width={132}
            height={24}
            priority
          />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className={`${NAV_LINK_CLASS} inline-flex items-center gap-1.5`}>
              {label}
              {label === "GitHub" && typeof stars === "number" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs">
                  <Star className="size-3" aria-hidden="true" />
                  {starFormat.format(stars)}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={LINKS.getStarted}
            className="hidden rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 md:inline-flex"
          >
            {CTA_LABELS.getStarted}
          </a>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}

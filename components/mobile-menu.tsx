"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CTA_LABELS, LINKS } from "@/lib/site";

type MobileMenuLink = { label: string; href: string };

export function MobileMenu({ links }: { links: readonly MobileMenuLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen(!open)}
        className="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>
      {open && (
        <nav
          id="mobile-menu-panel"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-border bg-background/95 px-4 py-4 shadow-lg backdrop-blur-xl"
        >
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <a
            href={LINKS.getStarted}
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-brand px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            {CTA_LABELS.getStarted}
          </a>
        </nav>
      )}
    </div>
  );
}

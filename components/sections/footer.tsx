import { ThemedImage } from "@/components/themed-image";
import { LINKS, TAGLINE } from "@/lib/site";

const FOOTER_LINKS = [
  { label: "Docs", href: LINKS.docs },
  { label: "GitHub", href: LINKS.github },
  { label: "Security", href: LINKS.security },
  { label: "Contributing", href: LINKS.contributing },
  { label: "License", href: LINKS.license },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-sm flex-col gap-4">
          <ThemedImage
            light="/brand/databasify-logo-light.svg"
            dark="/brand/databasify-logo-dark.svg"
            alt="Databasify"
            width={132}
            height={24}
          />
          <p className="text-sm text-muted-foreground">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          © Databasify Labs {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

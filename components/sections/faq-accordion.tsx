import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/site";

export function FaqAccordion({ items }: { items: typeof FAQ }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map(({ q, a }) => (
        <details key={q} className="group rounded-xl border border-border bg-card/60 backdrop-blur transition-colors open:border-accent/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-5 text-left font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            {q}
            <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{a}</p>
        </details>
      ))}
    </div>
  );
}

import { icons } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { FEATURES, SECTIONS } from "@/lib/site";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
            <h2 id="features-heading" className="heading-display text-3xl sm:text-4xl">
              {SECTIONS.features.heading}
            </h2>
            <p className="text-muted-foreground">{SECTIONS.features.subline}</p>
          </div>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, body, icon }, index) => {
            const Icon = icons[icon];
            return (
              <li key={title}>
                <Reveal delay={(index % 3) * 0.08} className="h-full">
                  <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card/60 p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/reveal";
import { SECTIONS, STEPS } from "@/lib/site";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <Reveal>
          <h2 id="how-it-works-heading" className="text-center heading-display text-3xl sm:text-4xl">
            {SECTIONS.howItWorks.heading}
          </h2>
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ title, body }, index) => (
            <li key={title}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card/60 p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-full bg-brand font-mono text-sm font-semibold text-accent-foreground"
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold">
                    <span className="sr-only">{index + 1}. </span>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

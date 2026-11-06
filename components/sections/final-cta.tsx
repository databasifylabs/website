import { CallsToAction } from "@/components/calls-to-action";
import { CopyCommand } from "@/components/copy-command";
import { Reveal } from "@/components/reveal";
import { INSTALL_COMMAND, SECTIONS } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="get-started" aria-labelledby="get-started-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="relative isolate mx-auto flex max-w-5xl flex-col items-center gap-7 overflow-hidden rounded-2xl border border-border bg-card/60 px-6 py-14 text-center backdrop-blur sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 h-64 w-[40rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl dark:bg-accent/25" />
          <h2 id="get-started-heading" className="max-w-2xl heading-display text-3xl text-balance sm:text-4xl">
            {SECTIONS.finalCta.heading}
          </h2>
          <p className="max-w-xl text-pretty text-muted-foreground">{SECTIONS.finalCta.subline}</p>
          <div className="w-full max-w-full sm:w-auto">
            <CopyCommand command={INSTALL_COMMAND} />
          </div>
          <CallsToAction />
        </div>
      </Reveal>
    </section>
  );
}

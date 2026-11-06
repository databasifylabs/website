import { Reveal } from "@/components/reveal";
import { TourTabs } from "@/components/sections/tour-tabs";
import { SECTIONS, TOUR } from "@/lib/site";

export function Tour() {
  return (
    <section id="tour" aria-labelledby="tour-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
            <h2 id="tour-heading" className="heading-display text-3xl sm:text-4xl">
              {SECTIONS.tour.heading}
            </h2>
            <p className="text-muted-foreground">{SECTIONS.tour.subline}</p>
          </div>
        </Reveal>
        <Reveal>
          <TourTabs tabs={TOUR} />
        </Reveal>
      </div>
    </section>
  );
}

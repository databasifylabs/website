import { Reveal } from "@/components/reveal";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { FAQ, SECTIONS } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <Reveal>
          <h2 id="faq-heading" className="text-center heading-display text-3xl sm:text-4xl">
            {SECTIONS.faq.heading}
          </h2>
        </Reveal>
        <Reveal>
          <FaqAccordion items={FAQ} />
        </Reveal>
      </div>
    </section>
  );
}

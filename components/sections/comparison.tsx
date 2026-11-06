import { Reveal } from "@/components/reveal";
import { COMPARISON, SECTIONS } from "@/lib/site";

export function Comparison() {
  return (
    <section id="comparison" aria-labelledby="comparison-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <h2 id="comparison-heading" className="text-center heading-display text-3xl sm:text-4xl">
            {SECTIONS.comparison.heading}
          </h2>
          <div
            role="region"
            tabIndex={0}
            aria-label={SECTIONS.comparison.scrollLabel}
            className="overflow-x-auto rounded-xl border border-border bg-card/60 backdrop-blur focus-visible:outline-2 focus-visible:outline-accent"
          >
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="p-4">
                    <span className="sr-only">{SECTIONS.comparison.topicLabel}</span>
                  </th>
                  <th scope="col" className="p-4 font-semibold text-muted-foreground">
                    Managed database service
                  </th>
                  <th scope="col" className="bg-accent/10 p-4 font-semibold text-accent">
                    Databasify
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ row, managed, databasify }) => (
                  <tr key={row} className="border-b border-border last:border-b-0">
                    <th scope="row" className="p-4 font-medium">
                      {row}
                    </th>
                    <td className="p-4 text-muted-foreground">{managed}</td>
                    <td className="bg-accent/5 p-4">{databasify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

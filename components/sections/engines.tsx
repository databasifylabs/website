import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ENGINES } from "@/lib/site";

export function Engines() {
  return (
    <section id="engines" aria-labelledby="engines-heading" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
          <h2 id="engines-heading" className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Six database engines, one dashboard
          </h2>
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ENGINES.map(({ id, name, versions, icon }) => (
              <li
                key={id}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-5 text-center backdrop-blur transition hover:-translate-y-0.5 hover:border-accent/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                  <Image src={icon} alt={name} width={28} height={28} className="size-7" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{name}</span>{" "}
                  <span className="font-mono text-xs text-muted-foreground">{versions.join(" · ")}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

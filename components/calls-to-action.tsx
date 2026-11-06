import { ArrowRight, Star } from "lucide-react";
import { CTA_LABELS, LINKS } from "@/lib/site";

const PILL = "inline-flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function CallsToAction() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
      <a href={LINKS.getStarted} className={`${PILL} group bg-foreground text-background shadow-lg shadow-black/10 hover:opacity-90`}>
        {CTA_LABELS.getStarted}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </a>
      <a href={LINKS.github} className={`${PILL} bg-[#363FF9] text-white shadow-lg shadow-[#363FF9]/30 hover:bg-[#2a33e6]`}>
        <Star className="size-4" aria-hidden="true" />
        {CTA_LABELS.starOnGitHub}
      </a>
    </div>
  );
}

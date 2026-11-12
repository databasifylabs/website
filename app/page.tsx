import { Comparison } from "@/components/sections/comparison";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Tour } from "@/components/sections/tour";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Features />
      <Tour />
      <HowItWorks />
      <Comparison />
      <Faq />
      <FinalCta />
    </main>
  );
}

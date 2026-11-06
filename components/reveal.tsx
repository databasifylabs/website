"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const VISIBLE = { opacity: 1, y: 0 };
const HIDDEN = { opacity: 0, y: 16 };

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [startsBelowFold, setStartsBelowFold] = useState(false);

  useLayoutEffect(() => {
    const top = ref.current?.getBoundingClientRect().top ?? 0;
    setStartsBelowFold(top >= window.innerHeight);
  }, []);

  const hidden = startsBelowFold && !reducedMotion && !inView;

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={false}
      animate={hidden ? HIDDEN : VISIBLE}
      transition={hidden ? { duration: 0 } : { duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const STROKES = [
  { d: "M6 15C92 8 196 5 300 8C380 10 442 12 488 6C499 5 498 11 489 13C468 17 438 18 414 18", width: 5, delay: "" },
  { d: "M58 21C160 15 280 14 392 17", width: 2.5, delay: "motion-safe:[animation-delay:1s]" },
] as const;

export function HandDrawnUnderline({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 500 26" fill="none" className={className}>
      {STROKES.map(({ d, width, delay }) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          className={`motion-safe:animate-draw-underline ${delay}`}
        />
      ))}
    </svg>
  );
}

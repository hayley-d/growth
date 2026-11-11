import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import {
  labelLineHeight,
  labelTimeline,
  type PlacedLabel,
  visibleLetters,
} from "@/lib/lesson/tree-label-layout";

type TreeLabelsProperties = {
  placed: readonly PlacedLabel[];
  litKeys: ReadonlySet<number>;
  animated: boolean;
};

const startDelayMs = 250;

function useElapsed(running: boolean, end: number) {
  const [elapsed, setElapsed] = useState(running ? 0 : Number.POSITIVE_INFINITY);
  useEffect(() => {
    if (!running) return;
    const began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = now - began;
      setElapsed(next);
      if (next < end) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, end]);
  return running ? elapsed : Number.POSITIVE_INFINITY;
}

export function TreeLabels({ placed, litKeys, animated }: TreeLabelsProperties) {
  const labels = useMemo(() => placed.map((each) => each.label), [placed]);
  const { timings, end } = useMemo(() => labelTimeline(labels, startDelayMs), [labels]);
  const elapsed = useElapsed(animated, end);

  return (
    <g>
      {placed.map((item, index) => {
        const timing = timings[index];
        if (!timing) return null;
        const started = elapsed >= timing.start;
        const lit = item.label.keys.some((key) => litKeys.has(key));
        const drawTransition = { duration: animated ? 0.38 : 0, ease: "easeOut" as const };
        return (
          <g
            key={`${item.label.place}-${item.label.keys.join(",")}`}
            data-label-keys={item.label.keys.join(",")}
            data-lit={lit || undefined}
            opacity={started ? 1 : 0}
          >
            {item.leaders.map((path) => (
              <motion.path
                key={path}
                d={path}
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth={1.5}
                strokeDasharray="1 4"
                strokeLinecap="round"
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: started ? 1 : 0 }}
                transition={drawTransition}
              />
            ))}
            {item.dot ? (
              <circle cx={item.dot.x} cy={item.dot.y} r={2.5} fill="var(--muted-foreground)" />
            ) : null}
            {item.bracket ? (
              <motion.path
                d={item.bracket}
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth={lit ? 3 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animated ? { pathLength: 0 } : false}
                animate={{ pathLength: started ? 1 : 0 }}
                transition={drawTransition}
              />
            ) : null}
            <text
              x={item.text.x}
              y={item.text.y}
              textAnchor={item.text.anchor}
              fontSize="13"
              fill="var(--foreground)"
              textDecoration={lit ? "underline" : undefined}
            >
              {item.label.text.map((line, lineIndex) => (
                <tspan
                  key={line}
                  x={item.text.x}
                  dy={lineIndex === 0 ? 0 : labelLineHeight}
                  fontWeight={lineIndex === 0 && item.label.text.length > 1 ? 700 : 500}
                >
                  {line.slice(0, visibleLetters(line, timing.lines[lineIndex] ?? 0, elapsed))}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}

import { useEffect, useMemo, useRef } from "react";

import { CodeLine } from "@/components/atoms/code-line";
import { cn } from "@/lib/utils";

const lineHeight = 28;
const listPadding = 12;

type CodeListingProperties = {
  lines: readonly string[];
  currentLine: number | null;
  label: string;
  className?: string;
};

export function CodeListing({ lines, currentLine, label, className }: CodeListingProperties) {
  const scrollReference = useRef<HTMLDivElement>(null);
  const numberedLines = useMemo(
    () => lines.map((text, index) => ({ number: index + 1, text })),
    [lines],
  );
  const hasCurrent = currentLine !== null && currentLine >= 1 && currentLine <= lines.length;
  const bandOffset = hasCurrent ? listPadding + (currentLine - 1) * lineHeight : 0;

  useEffect(() => {
    const box = scrollReference.current;
    if (!box || !hasCurrent) return;
    const top = bandOffset;
    const bottom = top + lineHeight;
    const margin = lineHeight * 2;
    if (top - margin >= box.scrollTop && bottom + margin <= box.scrollTop + box.clientHeight)
      return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({
      top: Math.max(0, top - box.clientHeight / 2 + lineHeight / 2),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [bandOffset, hasCurrent]);

  return (
    <div
      ref={scrollReference}
      className={cn(
        "max-h-80 overflow-auto rounded-xl border bg-muted/60 font-mono text-[13px] leading-7",
        className,
      )}
    >
      <div className="relative w-max min-w-full">
        {hasCurrent ? (
          <span
            aria-hidden="true"
            data-testid="current-line-band"
            className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-accent shadow-[inset_3px_0_0_var(--color-accent-foreground)] transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateY(${bandOffset}px)` }}
          />
        ) : null}
        <ol aria-label={label} className="relative py-3">
          {numberedLines.map((line) => (
            <CodeLine
              key={line.number}
              number={line.number}
              text={line.text}
              isCurrent={hasCurrent && currentLine === line.number}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

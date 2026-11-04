import { useCallback, useEffect, useRef } from "react";

import { CodeLine, codeLineHeight, codeListPadding } from "@/components/atoms/code-line";
import { cn } from "@/lib/utils";

type CodeListingProperties = {
  lines: readonly string[];
  currentLine: number | null;
  label: string;
  className?: string;
};

export function CodeListing({ lines, currentLine, label, className }: CodeListingProperties) {
  const scrollReference = useRef<HTMLDivElement>(null);
  const hasCurrent = currentLine !== null && currentLine >= 1 && currentLine <= lines.length;
  const bandOffset = hasCurrent ? codeListPadding + (currentLine - 1) * codeLineHeight : 0;

  const scrollToCurrent = useCallback(() => {
    const box = scrollReference.current;
    if (!box || !hasCurrent || box.clientHeight === 0) return;
    const bottom = bandOffset + codeLineHeight;
    const margin = codeLineHeight * 2;
    if (bandOffset - margin >= box.scrollTop && bottom + margin <= box.scrollTop + box.clientHeight)
      return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({
      top: Math.max(0, bandOffset - box.clientHeight / 2 + codeLineHeight / 2),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [bandOffset, hasCurrent]);

  useEffect(() => {
    if (lines.length > 0) scrollToCurrent();
  }, [lines, scrollToCurrent]);

  useEffect(() => {
    const box = scrollReference.current;
    if (!box) return;
    const observer = new ResizeObserver(() => scrollToCurrent());
    observer.observe(box);
    return () => observer.disconnect();
  }, [scrollToCurrent]);

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
            className="pointer-events-none absolute inset-x-0 top-0 bg-accent shadow-[inset_3px_0_0_var(--color-accent-foreground)] transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ height: codeLineHeight, transform: `translateY(${bandOffset}px)` }}
          />
        ) : null}
        <ol aria-label={label} className="relative" style={{ paddingBlock: codeListPadding }}>
          {lines
            .map((text, index) => ({ number: index + 1, text }))
            .map((line) => (
              <CodeLine
                key={line.number}
                number={line.number}
                text={line.text}
                isCurrent={currentLine === line.number}
              />
            ))}
        </ol>
      </div>
    </div>
  );
}

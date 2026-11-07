import { useId } from "react";

import type { CallFrame } from "@shared/avl";
import { findCodeLanguage, functionNameFor } from "@/lib/code-languages";
import { cn } from "@/lib/utils";

const indentStep = 14;
const maxIndent = 8;

type CallStackProperties = {
  frames: readonly CallFrame[];
  language: string;
  className?: string;
};

export function CallStack({ frames, language, className }: CallStackProperties) {
  const headingId = useId();
  const emptyValue = findCodeLanguage(language).emptyValue;

  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col gap-2", className)}>
      <h3
        id={headingId}
        className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
      >
        Call stack
      </h3>
      {frames.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing is running.</p>
      ) : (
        <ol className="flex flex-col">
          {frames
            .map((frame, index) => ({ frame, index }))
            .map(({ frame, index }) => {
              const isOpen = index === frames.length - 1;
              const name = functionNameFor(frame.algorithm, language);
              const argument = frame.node ?? emptyValue;
              const indent = Math.min(index, maxIndent) * indentStep;

              return (
                <li
                  key={`${index}-${frame.algorithm}`}
                  aria-current={isOpen ? "step" : undefined}
                  className="relative flex h-7 items-center gap-2 font-mono text-[13px]"
                  style={{ paddingLeft: `${indent}px` }}
                >
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute -top-2.25 h-[1.4375rem] w-2.5 rounded-bl-md border-b-2 border-l-2 border-[color-mix(in_oklch,var(--color-primary),var(--color-foreground)_35%)]"
                      style={{ left: `${Math.max(0, indent - indentStep) + 4}px` }}
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative size-2.5 shrink-0 rounded-full",
                      isOpen
                        ? "bg-accent ring-2 ring-accent-foreground"
                        : "border-2 border-[color-mix(in_oklch,var(--color-primary),var(--color-foreground)_35%)] bg-background",
                    )}
                  />
                  <span className={cn(isOpen ? "font-semibold" : "text-muted-foreground")}>
                    {name}({argument})
                  </span>
                </li>
              );
            })}
        </ol>
      )}
    </section>
  );
}

import { Check } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ChoiceButtonProperties = ComponentProps<"button"> & { selected: boolean };

export function ChoiceButton({
  selected,
  className,
  children,
  ...properties
}: ChoiceButtonProperties) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-card hover:border-foreground/60",
        className,
      )}
      {...properties}
    >
      <span>{children}</span>
      {selected ? <Check aria-hidden="true" className="size-5 shrink-0" strokeWidth={3} /> : null}
    </button>
  );
}

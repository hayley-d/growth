import type { Ref } from "react";

type DragGhostProperties = {
  label: string;
  x: number;
  y: number;
  ref?: Ref<HTMLDivElement>;
};

export function DragGhost({ label, x, y, ref }: DragGhostProperties) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ left: x, top: y }}
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg]"
    >
      <div className="flex size-11 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-background text-base font-semibold tabular-nums shadow-lg">
        {label}
      </div>
    </div>
  );
}

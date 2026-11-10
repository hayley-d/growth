import { Minus, Plus, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

type ZoomControlsProperties = {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
};

const buttonClass =
  "flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40 pointer-fine:size-8";

export function ZoomControls({
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onReset,
  className,
}: ZoomControlsProperties) {
  const percent = Math.round(zoom * 100);
  return (
    <fieldset
      className={cn(
        "flex items-center gap-1 rounded-full border bg-card/90 p-1 shadow-sm backdrop-blur",
        className,
      )}
    >
      <legend className="sr-only">Zoom</legend>
      <button
        type="button"
        aria-label="Zoom out"
        disabled={!canZoomOut}
        onClick={onZoomOut}
        className={buttonClass}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <output aria-live="polite" className="w-10 text-center text-xs font-semibold tabular-nums">
        {percent}%
      </output>
      <button
        type="button"
        aria-label="Zoom in"
        disabled={!canZoomIn}
        onClick={onZoomIn}
        className={buttonClass}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Reset zoom"
        disabled={percent === 100}
        onClick={onReset}
        className={buttonClass}
      >
        <RotateCcw aria-hidden="true" className="size-4" />
      </button>
    </fieldset>
  );
}

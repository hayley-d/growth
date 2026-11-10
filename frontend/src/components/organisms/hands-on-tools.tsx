import { GripVertical, RotateCcw, RotateCw, Trash2 } from "lucide-react";
import type { PointerEvent } from "react";

import { DropBin } from "@/components/molecules/drop-bin";
import { InfoTip } from "@/components/molecules/info-tip";
import { cn } from "@/lib/utils";

type HandsOnToolsProperties = {
  newKey: string;
  selectedKey: number | null;
  autoBalance: boolean;
  busy: boolean;
  dragging: boolean;
  binActive: boolean;
  onNewKeyChange: (value: string) => void;
  onChipPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onChipClick: () => void;
  onCommand: (text: string) => void;
  className?: string;
};

const actionClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full border-2 bg-background px-4 text-sm font-semibold transition-colors hover:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50";

export function HandsOnTools({
  newKey,
  selectedKey,
  autoBalance,
  busy,
  dragging,
  binActive,
  onNewKeyChange,
  onChipPointerDown,
  onChipClick,
  onCommand,
  className,
}: HandsOnToolsProperties) {
  const label = newKey.trim() === "" ? "?" : newKey.trim();

  const handleGripPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (busy) return;
    event.preventDefault();
    onChipPointerDown(event);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="playground-new-key" className="text-sm font-semibold">
          New key
        </label>
        <input
          id="playground-new-key"
          inputMode="numeric"
          maxLength={2}
          value={newKey}
          onChange={(event) => onNewKeyChange(event.target.value.replace(/\D/g, "").slice(0, 2))}
          className="min-h-11 w-20 rounded-xl border-2 bg-background px-3 text-base tabular-nums focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        />

        <InfoTip
          label="How to add the new node"
          text="Drag the new node to where you think it belongs."
        />
        <div className="relative mr-6 inline-flex items-center">
          <div
            onPointerDown={handleGripPointerDown}
            className="absolute -right-6 flex h-full items-center text-muted-foreground/40 cursor-grab active:cursor-grabbing hover:text-muted-foreground transition-colors select-none touch-none"
            aria-hidden="true"
          >
            <GripVertical className="size-4" />
          </div>

          <button
            type="button"
            disabled={busy}
            onPointerDown={onChipPointerDown}
            onClick={onChipClick}
            aria-label={`Key ${label}. Drag it onto the tree, or press Enter to insert it`}
            className="flex size-11 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-background text-base font-semibold tabular-nums select-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing disabled:opacity-50 cursor-grab"
          >
            {label}
          </button>
        </div>
        <DropBin dragging={dragging} active={binActive} />
      </div>

      {selectedKey !== null ? (
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Node {selectedKey}</legend>
          <button
            type="button"
            disabled={busy}
            onClick={() => onCommand(`delete ${selectedKey}`)}
            className={actionClass}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Delete {selectedKey}
          </button>
          {autoBalance ? null : (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onCommand(`rotate left ${selectedKey}`)}
                className={actionClass}
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Rotate {selectedKey} left
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onCommand(`rotate right ${selectedKey}`)}
                className={actionClass}
              >
                <RotateCw aria-hidden="true" className="size-4" />
                Rotate {selectedKey} right
              </button>
            </>
          )}
        </fieldset>
      ) : null}
    </div>
  );
}

import { Play } from "lucide-react";

import { InfoTip } from "@/components/molecules/info-tip";
import { type PlaygroundSetup, traversalNames } from "@/lib/playground/setup";
import { cn } from "@/lib/utils";

type PlaygroundToolsProperties = {
  setup: PlaygroundSetup;
  autoBalance: boolean;
  busy: boolean;
  onCommand: (text: string) => void;
  className?: string;
};

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50 pointer-fine:min-h-9";

export function PlaygroundTools({
  setup,
  autoBalance,
  busy,
  onCommand,
  className,
}: PlaygroundToolsProperties) {
  const busyTitle = busy ? "Wait for the run to finish, or pause it" : undefined;
  const isAvl = setup.topic === "avl";
  const isInteract = setup.explore === "interact";

  if (!isAvl && !isInteract) {
    return (
      <div className={cn("flex items-center", className)}>
        <button
          type="button"
          disabled={busy}
          title={busyTitle}
          onClick={() => onCommand(setup.traversal)}
          className={cn(buttonClass, "bg-primary px-4 text-primary-foreground")}
        >
          <Play aria-hidden="true" className="size-4" fill="currentColor" />
          Walk the tree {traversalNames[setup.traversal].toLowerCase()}
        </button>
      </div>
    );
  }

  if (!isAvl || !isInteract) return null;

  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={autoBalance}
        disabled={busy}
        title={busyTitle}
        onClick={() => onCommand(autoBalance ? "balance off" : "balance on")}
        className={cn(buttonClass, "gap-2 border bg-card pr-3.5 pl-1.5")}
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative h-5 w-8 rounded-full transition-colors motion-reduce:transition-none",
            autoBalance ? "bg-primary" : "bg-muted-foreground/40",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-4 rounded-full bg-background transition-[left] motion-reduce:transition-none",
              autoBalance ? "left-3.5" : "left-0.5",
            )}
          />
        </span>
        Auto-balance
        <span className="font-normal text-muted-foreground">{autoBalance ? "On" : "Off"}</span>
      </button>
      <InfoTip
        label="About auto-balance"
        text={
          autoBalance
            ? "Turn auto-balance off to rotate by hand."
            : "Drag a child onto its parent to rotate the parent."
        }
      />
    </div>
  );
}

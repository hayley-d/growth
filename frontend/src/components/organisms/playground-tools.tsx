import { Dices, Eraser, PanelRightClose, PanelRightOpen, Play } from "lucide-react";

import { InfoTip } from "@/components/molecules/info-tip";
import { type PlaygroundSetup, traversalNames } from "@/lib/playground/setup";
import { cn } from "@/lib/utils";

type PlaygroundToolsProperties = {
  setup: PlaygroundSetup;
  autoBalance: boolean;
  busy: boolean;
  codeHidden: boolean;
  onCommand: (text: string) => void;
  onNewTree: () => void;
  onToggleCode: () => void;
  className?: string;
};

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50";

export function PlaygroundTools({
  setup,
  autoBalance,
  busy,
  codeHidden,
  onCommand,
  onNewTree,
  onToggleCode,
  className,
}: PlaygroundToolsProperties) {
  const busyTitle = busy ? "Wait for the run to finish, or pause it" : undefined;
  const isAvl = setup.topic === "avl";
  const isInteract = setup.explore === "interact";
  const CodeIcon = codeHidden ? PanelRightOpen : PanelRightClose;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {!isAvl && !isInteract ? (
        <button
          type="button"
          disabled={busy}
          title={busyTitle}
          onClick={() => onCommand(setup.traversal)}
          className={cn(buttonClass, "bg-primary text-primary-foreground")}
        >
          <Play aria-hidden="true" className="size-4" fill="currentColor" />
          Walk the tree {traversalNames[setup.traversal].toLowerCase()}
        </button>
      ) : null}
      {isAvl && isInteract ? (
        <button
          type="button"
          role="switch"
          aria-checked={autoBalance}
          disabled={busy}
          title={busyTitle}
          onClick={() => onCommand(autoBalance ? "balance off" : "balance on")}
          className={cn(buttonClass, "border-2 bg-card pr-5 pl-2")}
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative h-6 w-10 rounded-full transition-colors motion-reduce:transition-none",
              autoBalance ? "bg-primary" : "bg-muted-foreground/40",
            )}
          >
            <span
              className={cn(
                "absolute top-1 size-4 rounded-full bg-background transition-[left] motion-reduce:transition-none",
                autoBalance ? "left-5" : "left-1",
              )}
            />
          </span>
          Auto-balance
          <span className="font-normal text-muted-foreground">{autoBalance ? "On" : "Off"}</span>
        </button>
      ) : null}
      {isAvl && isInteract ? (
        <InfoTip
          label="About auto-balance"
          text={
            autoBalance
              ? "Turn auto-balance off to rotate by hand."
              : "Drag a child onto its parent to rotate the parent."
          }
          className="-ml-1"
        />
      ) : null}
      <span className="flex-1" />
      <button type="button" onClick={onToggleCode} className={cn(buttonClass, "hover:bg-muted")}>
        <CodeIcon aria-hidden="true" className="size-4" />
        {codeHidden ? "Show code" : "Hide code"}
      </button>
      {isAvl && !isInteract ? null : (
        <button
          type="button"
          disabled={busy}
          title={busyTitle}
          onClick={onNewTree}
          className={cn(buttonClass, "hover:bg-muted")}
        >
          <Dices aria-hidden="true" className="size-4" />
          New tree
        </button>
      )}
      {isAvl && isInteract ? (
        <button
          type="button"
          disabled={busy}
          title={busyTitle}
          onClick={() => onCommand("clear")}
          className={cn(buttonClass, "hover:bg-muted")}
        >
          <Eraser aria-hidden="true" className="size-4" />
          Clear
        </button>
      ) : null}
    </div>
  );
}

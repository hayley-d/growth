import { Dices, Eraser, PanelRightClose, PanelRightOpen } from "lucide-react";

import { floatingButtonClass, floatingGroupClass } from "@/components/molecules/zoom-controls";
import { cn } from "@/lib/utils";

type TreeToolsProperties = {
  busy: boolean;
  codeHidden: boolean;
  onToggleCode: () => void;
  onNewTree?: () => void;
  onClear?: () => void;
  className?: string;
};

export function TreeTools({
  busy,
  codeHidden,
  onToggleCode,
  onNewTree,
  onClear,
  className,
}: TreeToolsProperties) {
  const busyTitle = busy ? "Wait for the run to finish, or pause it" : undefined;
  const CodeIcon = codeHidden ? PanelRightOpen : PanelRightClose;
  const codeLabel = codeHidden ? "Show code" : "Hide code";

  return (
    <fieldset className={cn(floatingGroupClass, className)}>
      <legend className="sr-only">Tree tools</legend>
      {onNewTree ? (
        <button
          type="button"
          aria-label="New tree"
          title={busyTitle ?? "New tree"}
          disabled={busy}
          onClick={onNewTree}
          className={floatingButtonClass}
        >
          <Dices aria-hidden="true" className="size-4" />
        </button>
      ) : null}
      {onClear ? (
        <button
          type="button"
          aria-label="Clear"
          title={busyTitle ?? "Clear"}
          disabled={busy}
          onClick={onClear}
          className={floatingButtonClass}
        >
          <Eraser aria-hidden="true" className="size-4" />
        </button>
      ) : null}
      <button
        type="button"
        aria-label={codeLabel}
        title={codeLabel}
        onClick={onToggleCode}
        className={floatingButtonClass}
      >
        <CodeIcon aria-hidden="true" className="size-4" />
      </button>
    </fieldset>
  );
}

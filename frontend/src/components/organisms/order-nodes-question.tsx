import { Eraser, Undo2 } from "lucide-react";
import { useState } from "react";

import { type AvlNode, toKeys } from "@shared/avl";
import type { LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { TreeView } from "@/components/organisms/tree-view";
import { cn } from "@/lib/utils";

type OrderNodesQuestionProperties = {
  root: AvlNode | null;
  disabled?: boolean;
  onSubmit: (answer: LearnerAnswer) => void;
  className?: string;
};

export function OrderNodesQuestion({
  root,
  disabled = false,
  onSubmit,
  className,
}: OrderNodesQuestionProperties) {
  const total = toKeys(root).length;
  const [keys, setKeys] = useState<number[]>([]);
  const badges = Object.fromEntries(keys.map((key, index) => [key, index + 1]));
  const emptyPlaces = Array.from(
    { length: Math.max(total - keys.length, 0) },
    (_, offset) => offset,
  );

  const pick = (nodeKey: number) => {
    if (disabled || keys.includes(nodeKey)) return;
    setKeys((current) => [...current, nodeKey]);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <TreeView root={root} manual badges={badges} onSelectKey={pick} className="max-h-72" />
      <ol aria-label="Your order" className="flex min-h-11 flex-wrap gap-2">
        {keys.map((key, index) => (
          <li
            key={key}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 bg-background pr-4 pl-1.5 font-semibold tabular-nums"
          >
            <span className="grid size-8 place-items-center rounded-full bg-muted text-xs">
              {index + 1}
            </span>
            {key}
          </li>
        ))}
        {emptyPlaces.map((offset) => (
          <li
            key={`place-${offset}`}
            aria-hidden="true"
            className="min-h-11 w-16 rounded-full border-2 border-dashed"
          />
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={disabled || keys.length === 0}
          onClick={() => setKeys((current) => current.slice(0, -1))}
        >
          <Undo2 aria-hidden="true" />
          Undo
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={disabled || keys.length === 0}
          onClick={() => setKeys([])}
        >
          <Eraser aria-hidden="true" />
          Clear
        </Button>
        <Button
          type="button"
          className="ml-auto min-h-11 px-6"
          disabled={disabled || keys.length !== total}
          onClick={() => onSubmit({ type: "order_nodes", keys })}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

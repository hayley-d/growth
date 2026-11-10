import type { PointerEvent } from "react";

import type { AvlNode, NodeState } from "@shared/avl";
import { TreeView, type TreeViewSlot } from "@/components/organisms/tree-view";
import { cn } from "@/lib/utils";

type DraggableTreeProperties = {
  root: AvlNode | null;
  nodeStates: Record<number, NodeState>;
  showBalance: boolean;
  slots: readonly TreeViewSlot[];
  activeSlotId: string | null;
  selectedKey: number | null;
  dropKey: number | null;
  treeClassName?: string;
  onNodePointerDown: (event: PointerEvent<HTMLElement>, nodeKey: number) => void;
  onSelectKey: (nodeKey: number) => void;
  className?: string;
};

export function DraggableTree({
  root,
  nodeStates,
  showBalance,
  slots,
  activeSlotId,
  selectedKey,
  dropKey,
  treeClassName = "max-h-[22rem]",
  onNodePointerDown,
  onSelectKey,
  className,
}: DraggableTreeProperties) {
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const node = (event.target as Element).closest<HTMLElement>("[data-node-key]");
    if (node) onNodePointerDown(event, Number(node.dataset.nodeKey));
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      className={cn(
        "grid h-full w-full place-items-center [&_[data-node-key]]:cursor-grab [&_[data-node-key]]:touch-none",
        className,
      )}
    >
      <TreeView
        root={root}
        nodeStates={nodeStates}
        showBalance={showBalance}
        manual
        selectedKey={dropKey ?? selectedKey}
        onSelectKey={onSelectKey}
        slots={slots}
        activeSlotId={activeSlotId}
        className={treeClassName}
      />
    </div>
  );
}

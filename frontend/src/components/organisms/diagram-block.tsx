import { useEffect, useMemo, useState } from "react";

import { layoutTree, type NodeState, toKeys } from "@shared/avl";
import type { TreeLabel } from "@shared/schemas";
import { TreeView } from "@/components/organisms/tree-view";
import { trimTree } from "@/lib/copy-tree-steps";
import { buildTree } from "@/lib/lesson/animation-steps";
import { describeLabelledTree } from "@/lib/lesson/tree-label-layout";
import { useLinkedTree } from "@/lib/lesson/tree-links";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const levelDelayMilliseconds = 450;

type DiagramBlockProperties = {
  startingKeys: readonly number[];
  highlights: readonly { key: number; state: NodeState }[];
  labels?: readonly TreeLabel[];
  caption: string;
  description: string;
  className?: string;
};

export function DiagramBlock({
  startingKeys,
  highlights,
  labels,
  caption,
  description,
  className,
}: DiagramBlockProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const root = useMemo(() => buildTree(startingKeys), [startingKeys]);
  const layout = useMemo(() => layoutTree(root), [root]);
  const treeKeys = useMemo(() => toKeys(root), [root]);
  const links = useLinkedTree(treeKeys);
  const hasLabels = labels !== undefined && labels.length > 0;
  const accessibleName = describeLabelledTree([caption], labels);
  const deepest = layout.reduce((deepestLevel, position) => Math.max(deepestLevel, position.y), 0);
  const [drawnLevel, setDrawnLevel] = useState(0);
  const shownLevel = reduced ? deepest + 1 : drawnLevel;
  const finished = shownLevel > deepest;

  useEffect(() => {
    if (reduced || drawnLevel > deepest) return;
    const timer = window.setTimeout(
      () => setDrawnLevel(drawnLevel + 1),
      drawnLevel === 0 ? 0 : levelDelayMilliseconds,
    );
    return () => window.clearTimeout(timer);
  }, [reduced, deepest, drawnLevel]);

  const shownKeys = layout
    .filter((position) => position.y < shownLevel)
    .map((position) => position.key);
  const shown = useMemo(() => trimTree(root, shownKeys), [root, shownKeys]);
  const nodeStates: Record<number, NodeState> = {};
  if (finished) {
    for (const highlight of highlights) nodeStates[highlight.key] = highlight.state;
  }

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <div className="relative h-56 rounded-xl border bg-card p-3 sm:h-72">
        <TreeView
          root={shown}
          layoutRoot={root}
          nodeStates={nodeStates}
          pointers={false}
          labels={labels}
          labelsShown={finished}
          labelsAnimated={!reduced}
          litKeys={links.litKeys}
          onHoverKey={(key) => links.hover(key === null ? null : { keys: [key], term: null })}
          label={accessibleName}
          className="h-full"
        />
        <p className="sr-only">{description}</p>
      </div>
      <figcaption className={hasLabels ? "sr-only" : "text-center text-sm text-muted-foreground"}>
        {caption}
      </figcaption>
    </figure>
  );
}

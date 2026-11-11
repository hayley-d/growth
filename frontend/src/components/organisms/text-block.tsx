import { type ReactNode, useMemo } from "react";

import { toKeys } from "@shared/avl";
import type { TreeLabel, TreeTerms } from "@shared/schemas";
import { Markdown } from "@/components/molecules/markdown";
import { Spoiler } from "@/components/molecules/spoiler";
import { WriteIn } from "@/components/molecules/write-in";
import { TreeView } from "@/components/organisms/tree-view";
import { buildTree } from "@/lib/lesson/animation-steps";
import { describeLabelledTree } from "@/lib/lesson/tree-label-layout";
import { useLinkedTree } from "@/lib/lesson/tree-links";
import { cn } from "@/lib/utils";

type TextBlockProperties = {
  id: string;
  markdown: string;
  tree?: readonly number[];
  labels?: readonly TreeLabel[];
  terms?: TreeTerms;
  write?: boolean;
  answer?: string;
  aside?: ReactNode;
  className?: string;
};

function OwnTree({ keys, labels }: { keys: readonly number[]; labels?: readonly TreeLabel[] }) {
  const root = useMemo(() => buildTree(keys), [keys]);
  const treeKeys = useMemo(() => toKeys(root), [root]);
  const links = useLinkedTree(treeKeys);
  const name = describeLabelledTree([`Tree with keys ${keys.join(", ")}`], labels);
  return (
    <div className="h-56 rounded-xl border bg-card p-3 sm:h-64">
      <TreeView
        root={root}
        labels={labels}
        litKeys={links.litKeys}
        onHoverKey={(key) => links.hover(key === null ? null : { keys: [key], term: null })}
        label={name}
      />
    </div>
  );
}

export function TextBlock({
  id,
  markdown,
  tree,
  labels,
  terms,
  write,
  answer,
  aside,
  className,
}: TextBlockProperties) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <Markdown text={markdown} terms={terms} aside={aside} />
      {tree ? <OwnTree keys={tree} labels={labels} /> : null}
      {write ? <WriteIn id={id} /> : null}
      {answer ? (
        <Spoiler label="Answer">
          <Markdown text={answer} />
        </Spoiler>
      ) : null}
    </div>
  );
}

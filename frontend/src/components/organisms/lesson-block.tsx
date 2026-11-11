import type { ReactNode } from "react";

import type { LessonStepBlock, TreeTerms } from "@shared/schemas";
import { Markdown } from "@/components/molecules/markdown";
import { AnimationBlock } from "@/components/organisms/animation-block";
import { CodeTraceBlock } from "@/components/organisms/code-trace-block";
import { CopyTree } from "@/components/organisms/copy-tree";
import { DeleteTree } from "@/components/organisms/delete-tree";
import { DiagramBlock } from "@/components/organisms/diagram-block";
import { ExpressionTree } from "@/components/organisms/expression-tree";
import { PlaygroundBlock } from "@/components/organisms/playground-block";
import { TextBlock } from "@/components/organisms/text-block";
import { TraversalQuiz } from "@/components/organisms/traversal-quiz";
import { TreeHeights } from "@/components/organisms/tree-heights";
import { TreeView } from "@/components/organisms/tree-view";
import { buildTree } from "@/lib/lesson/animation-steps";
import { cn } from "@/lib/utils";

type LessonBlockProperties = {
  block: LessonStepBlock;
  aside?: ReactNode;
  className?: string;
};

export const leadsWithText = (block: LessonStepBlock) => {
  if (block.type === "text") return true;
  return "markdown" in block.body && typeof block.body.markdown === "string";
};

function WithMarkdown({
  markdown,
  terms,
  aside,
  children,
}: {
  markdown?: string;
  terms?: TreeTerms;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      {markdown ? <Markdown text={markdown} terms={terms} aside={aside} /> : null}
      {children}
    </div>
  );
}

function BlockBody({ block, aside }: { block: LessonStepBlock; aside?: ReactNode }) {
  switch (block.type) {
    case "text":
      return (
        <TextBlock
          id={block.id}
          markdown={block.body.markdown}
          tree={block.body.tree}
          labels={block.body.labels}
          terms={block.body.terms}
          write={block.body.write}
          answer={block.body.answer}
          aside={aside}
        />
      );
    case "diagram":
      return (
        <WithMarkdown markdown={block.body.markdown} terms={block.body.terms} aside={aside}>
          <DiagramBlock
            startingKeys={block.body.startingKeys}
            highlights={block.body.highlights}
            labels={block.body.labels}
            caption={block.body.caption}
            description={block.transcript}
          />
        </WithMarkdown>
      );
    case "animation":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <AnimationBlock
            startingKeys={block.body.startingKeys}
            operations={block.body.steps}
            autoplay={block.body.autoplay}
          />
        </WithMarkdown>
      );
    case "playground":
      return (
        <PlaygroundBlock
          startingKeys={block.body.startingKeys}
          allowedOperations={block.body.allowedOperations}
          instructions={block.body.instructions}
          goal={block.body.goal}
        />
      );
    case "code_trace":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <CodeTraceBlock
            algorithmCode={block.body.algorithmCode}
            startingKeys={block.body.startingKeys}
            operation={block.body.operation}
            showCode={block.body.showCode}
          />
        </WithMarkdown>
      );
    case "copy_tree":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <CopyTree startingKeys={block.body.startingKeys} caption={block.body.caption} />
        </WithMarkdown>
      );
    case "delete_tree":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <DeleteTree startingKeys={block.body.startingKeys} caption={block.body.caption} />
        </WithMarkdown>
      );
    case "heights":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <TreeHeights startingKeys={block.body.startingKeys} caption={block.body.caption} />
        </WithMarkdown>
      );
    case "expression_tree":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <ExpressionTree
            expression={block.body.expression}
            order={block.body.order}
            caption={block.body.caption}
          />
        </WithMarkdown>
      );
    case "traversal_quiz":
      return (
        <WithMarkdown markdown={block.body.markdown} aside={aside}>
          <TraversalQuiz startingKeys={block.body.startingKeys} orders={block.body.orders} />
        </WithMarkdown>
      );
    case "number_line":
      return (
        <figure className="flex flex-col gap-2">
          <div className="h-48 rounded-xl border bg-card p-3">
            <TreeView root={buildTree(block.body.startingKeys)} label={block.body.caption} />
          </div>
          <figcaption className="text-center text-sm text-muted-foreground">
            {block.body.caption}
          </figcaption>
        </figure>
      );
  }
}

export function LessonBlock({ block, aside, className }: LessonBlockProperties) {
  return (
    <div className={cn("min-w-0", className)}>
      <BlockBody block={block} aside={aside} />
    </div>
  );
}

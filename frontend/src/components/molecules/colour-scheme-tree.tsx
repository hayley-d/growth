import type { NodeState } from "@shared/avl";
import type { LearningPathLessonStatus, LessonKind } from "@shared/schemas";
import { LessonNodeGlyph } from "@/components/atoms/lesson-node";
import { TreeNode, treeNodeRadius } from "@/components/molecules/tree-node";
import { cn } from "@/lib/utils";

type Point = { x: number; y: number };

type SampleNode = Point &
  (
    | { family: "lesson"; status: LearningPathLessonStatus; kind: LessonKind }
    | { family: "avl"; state: NodeState; nodeKey: number; balance: number }
  );

// A deletion story: 42 is about to go, which leaves 30 unbalanced, so 17 rotates up.
const nodes: SampleNode[] = [
  { x: 50, y: 12, family: "lesson", status: "completed", kind: "lesson" },
  { x: 27, y: 38, family: "avl", state: "unbalanced", nodeKey: 30, balance: 2 },
  { x: 73, y: 38, family: "lesson", status: "current", kind: "lesson" },
  { x: 15, y: 63, family: "avl", state: "rotating", nodeKey: 17, balance: 0 },
  { x: 39, y: 63, family: "avl", state: "deleting", nodeKey: 42, balance: 0 },
  { x: 63, y: 63, family: "lesson", status: "locked", kind: "lesson" },
  { x: 85, y: 63, family: "lesson", status: "locked", kind: "checkpoint" },
  { x: 8, y: 88, family: "avl", state: "active", nodeKey: 8, balance: 0 },
  { x: 22, y: 88, family: "avl", state: "new", nodeKey: 25, balance: 0 },
];

const edges: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [3, 7],
  [3, 8],
];

const walk = [nodes[0], nodes[2]].filter((node): node is SampleNode => node !== undefined);
const nodeBox = (treeNodeRadius + 14) * 2;

export function ColourSchemeTree({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative mx-auto h-80 w-full max-w-md text-foreground",
        "[&_*]:transition-colors [&_*]:duration-[450ms] motion-reduce:[&_*]:transition-none",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        {edges.map(([from, to]) => {
          const start = nodes[from];
          const end = nodes[to];
          return start && end ? (
            <line
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="stroke-muted-foreground/50"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          ) : null;
        })}
        {[
          { className: "stroke-accent", width: 10 },
          { className: "stroke-primary-foreground", width: 3 },
        ].map((stroke) => (
          <polyline
            key={stroke.className}
            points={walk.map(({ x, y }) => `${x},${y}`).join(" ")}
            fill="none"
            className={stroke.className}
            strokeWidth={stroke.width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <div
          key={`${node.x}-${node.y}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.family === "lesson" ? (
            <LessonNodeGlyph status={node.status} kind={node.kind} unit="secondary" />
          ) : (
            <svg
              aria-hidden="true"
              width={nodeBox}
              height={nodeBox}
              viewBox={`${-nodeBox / 2} ${-nodeBox / 2} ${nodeBox} ${nodeBox}`}
              className="overflow-visible"
            >
              <TreeNode
                x={0}
                y={0}
                nodeKey={node.nodeKey}
                height={1}
                balance={node.balance}
                state={node.state}
                showHeight={false}
                showBalance={false}
                manual={false}
                selected={false}
                pointer={false}
                instant
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

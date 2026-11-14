import { motion } from "motion/react";

import { type AvlNode, insertKey, layoutTree } from "@shared/avl";
import { currentStreak, type PracticeAnswer } from "@/lib/practice/session";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type SessionTreeProperties = {
  answers: readonly PracticeAnswer[];
  /** Draws a dashed node where the question being answered will land. */
  pending: boolean;
  size?: "md" | "lg";
  className?: string;
};

const sizes = {
  md: { spacing: 28, level: 40, radius: 11 },
  lg: { spacing: 34, level: 46, radius: 13 },
} as const;

const streakShownFrom = 2;
const moveSeconds = 0.45;

// Keys 1..n go in in order, so the tree stays balanced and rebalances as it grows, like the AVL
// trees the learner is practising on. Node n is answer n.
const buildShape = (count: number): AvlNode | null => {
  let root: AvlNode | null = null;
  for (let key = 1; key <= count; key += 1) root = insertKey(root, key);
  return root;
};

/**
 * The learner's practice session drawn as a tree, one node per answer. Right answers are filled
 * circles with a tick and misses are squares with a cross, so colour is never the only signal.
 * Answers in the current run of right answers get a ring.
 */
export function SessionTree({ answers, pending, size = "md", className }: SessionTreeProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { spacing, level, radius } = sizes[size];
  const count = answers.length + (pending ? 1 : 0);
  const layout = layoutTree(buildShape(count));
  const byKey = new Map(layout.map((position) => [position.key, position]));
  const depth = Math.max(0, ...layout.map((position) => position.y));
  const width = (layout.length + 1) * spacing;
  const height = (depth + 1) * level + radius * 2;
  const toPoint = (x: number, y: number) =>
    [spacing + x * spacing, radius + 4 + y * level] as const;
  const streak = currentStreak(answers);
  const streakFrom = streak >= streakShownFrom ? answers.length - streak + 1 : Infinity;
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const transition = { duration: reduced ? 0 : moveSeconds, ease: "easeInOut" } as const;

  if (count === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Your first answer plants the root.
      </p>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Your session tree: ${correct} of ${answers.length} right`}
      className={cn("w-full overflow-visible", className)}
    >
      {layout.map((position) => {
        const parent = position.parentKey === null ? undefined : byKey.get(position.parentKey);
        if (!parent) return null;
        const [x1, y1] = toPoint(parent.x, parent.y);
        const [x2, y2] = toPoint(position.x, position.y);
        return (
          <motion.line
            key={`edge-${position.key}`}
            initial={false}
            animate={{ x1, y1, x2, y2 }}
            transition={transition}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={2}
            strokeDasharray={position.key > answers.length ? "3 4" : undefined}
          />
        );
      })}
      {layout.map((position) => {
        const [x, y] = toPoint(position.x, position.y);
        const answer = answers[position.key - 1];
        return (
          <motion.g
            key={`node-${position.key}`}
            initial={{ x, y, scale: reduced ? 1 : 0 }}
            animate={{ x, y, scale: 1 }}
            transition={transition}
          >
            {!answer ? (
              <>
                <circle
                  r={radius}
                  fill="transparent"
                  stroke="var(--foreground)"
                  strokeOpacity={0.6}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  className="motion-safe:animate-pulse"
                />
                <text
                  y={4}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px] font-semibold"
                >
                  ?
                </text>
              </>
            ) : answer.isCorrect ? (
              <>
                {position.key >= streakFrom ? (
                  <circle r={radius + 4} fill="none" stroke="var(--accent)" strokeWidth={2} />
                ) : null}
                <circle r={radius} fill="var(--primary)" />
                <path
                  d={`M${-radius * 0.4} 0 L${-radius * 0.1} ${radius * 0.3} L${radius * 0.45} ${-radius * 0.35}`}
                  fill="none"
                  stroke="var(--primary-foreground)"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <>
                <rect
                  x={-radius}
                  y={-radius}
                  width={radius * 2}
                  height={radius * 2}
                  rx={3}
                  fill="var(--card)"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                />
                <path
                  d={`M${-radius * 0.35} ${-radius * 0.35} L${radius * 0.35} ${radius * 0.35} M${radius * 0.35} ${-radius * 0.35} L${-radius * 0.35} ${radius * 0.35}`}
                  stroke="var(--secondary)"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

export function SessionTreeKey({ className }: { className?: string }) {
  return (
    <ul
      aria-label="Key"
      className={cn("flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", className)}
    >
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-full bg-primary" />
        Right
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-[3px] border-2 border-secondary" />
        Not quite
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-3 rounded-full border-2 border-accent" />
        In a row
      </li>
    </ul>
  );
}

import { Check, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

import { type AvlNode, insertKey, type TraversalOrder, TreeTraversal } from "@shared/avl";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { TreeView } from "@/components/organisms/tree-view";
import { parseTraversalAnswer } from "@/lib/traversal-answer";
import { cn } from "@/lib/utils";

type TraversalQuizProperties = {
  startingKeys: readonly number[];
  orders: readonly TraversalOrder[];
  className?: string;
};

type Result = "correct" | "wrong" | "invalid";

const orderNames: Record<TraversalOrder, string> = {
  preorder: "Pre-order",
  inorder: "In-order",
  postorder: "Post-order",
  levelorder: "Level-order",
};

const feedbackText: Record<Result, string> = {
  correct: "Correct.",
  wrong: "Not quite. Try again.",
  invalid: "Type the keys with commas or spaces between them.",
};

export function TraversalQuiz({ startingKeys, orders, className }: TraversalQuizProperties) {
  const root = useMemo(
    () => startingKeys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null),
    [startingKeys],
  );
  const answers = useMemo(
    () =>
      Object.fromEntries(
        orders.map((order) => [order, [...new TreeTraversal(root, order)].map((node) => node.key)]),
      ) as Record<TraversalOrder, number[]>,
    [root, orders],
  );
  const [typed, setTyped] = useState<Partial<Record<TraversalOrder, string>>>({});
  const [results, setResults] = useState<Partial<Record<TraversalOrder, Result>>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const checked = Object.keys(results).length > 0;
  const allCorrect = orders.every((order) => results[order] === "correct");

  const check = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<TraversalOrder, Result>> = {};
    for (const order of orders) {
      const keys = parseTraversalAnswer(typed[order] ?? "");
      next[order] =
        keys === null
          ? "invalid"
          : keys.join(",") === answers[order].join(",")
            ? "correct"
            : "wrong";
    }
    setResults(next);
  };

  return (
    <form onSubmit={check} className={cn("flex min-w-0 flex-col gap-4", className)}>
      <div className="h-56 rounded-md border bg-card p-3">
        <TreeView root={root} label={`Tree with keys ${startingKeys.join(", ")}`} />
      </div>

      {orders.map((order) => {
        const id = `traversal-quiz-${order}`;
        const result = results[order];
        return (
          <div key={order} className="flex flex-col gap-1">
            <Label htmlFor={id}>{orderNames[order]}</Label>
            <Input
              id={id}
              className="min-h-11 font-mono"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 1, 2, 3"
              aria-describedby={result ? `${id}-feedback` : undefined}
              aria-invalid={result !== undefined && result !== "correct"}
              value={typed[order] ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setTyped((current) => ({ ...current, [order]: value }));
              }}
            />
            {result && (
              <p
                id={`${id}-feedback`}
                className={cn(
                  "flex items-center gap-1 text-sm",
                  result === "correct" ? "text-foreground" : "text-destructive",
                )}
              >
                {result === "correct" ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  <X aria-hidden="true" className="size-4" />
                )}
                {feedbackText[result]}
              </p>
            )}
            {showAnswers && (
              <p className="text-muted-foreground text-sm">
                Answer: <span className="font-mono">{answers[order].join(", ")}</span>
              </p>
            )}
          </div>
        );
      })}

      <p aria-live="polite" className="sr-only">
        {checked
          ? orders
              .map((order) => `${orderNames[order]}: ${feedbackText[results[order] ?? "invalid"]}`)
              .join(" ")
          : ""}
      </p>

      <div className="flex flex-wrap justify-end gap-2">
        {checked && !allCorrect && !showAnswers && (
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => setShowAnswers(true)}
          >
            Show answers
          </Button>
        )}
        <Button type="submit" className="min-h-11">
          Check
        </Button>
      </div>
    </form>
  );
}

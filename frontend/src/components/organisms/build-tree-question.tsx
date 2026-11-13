import { RotateCcw, RotateCw, Trash2, Undo2 } from "lucide-react";
import { useId, useState } from "react";

import { type AvlNode, encodeTree, toKeys } from "@shared/avl";
import { insertBst, removeBst, rotate } from "@shared/engine";
import type { LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { TreeView } from "@/components/organisms/tree-view";
import { parseKey } from "@/lib/playground/commands";
import { cn } from "@/lib/utils";

type BuildTreeQuestionProperties = {
  root: AvlNode | null;
  disabled?: boolean;
  onSubmit: (answer: LearnerAnswer) => void;
  className?: string;
};

export function BuildTreeQuestion({
  root,
  disabled = false,
  onSubmit,
  className,
}: BuildTreeQuestionProperties) {
  const inputId = useId();
  const [history, setHistory] = useState<(AvlNode | null)[]>([root]);
  const [newKey, setNewKey] = useState("");
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const tree = history[history.length - 1] ?? null;

  const push = (next: AvlNode | null) => {
    setHistory((current) => [...current, next]);
    setSelectedKey(null);
    setMessage("");
  };

  const insert = () => {
    const parsed = parseKey(newKey);
    if ("message" in parsed) {
      setMessage(parsed.message);
      return;
    }
    if (toKeys(tree).includes(parsed.key)) {
      setMessage(`${parsed.key} is already in the tree.`);
      return;
    }
    push(insertBst(tree, parsed.key));
    setNewKey("");
  };

  const remove = () => {
    if (selectedKey === null) return;
    push(removeBst(tree, selectedKey));
  };

  const turn = (kind: "left" | "right") => {
    if (selectedKey === null) return;
    const result = rotate(tree, selectedKey, kind);
    if (result.ok) push(result.tree);
    else setMessage(result.reason);
  };

  const reset = () => {
    setHistory([root]);
    setSelectedKey(null);
    setMessage("");
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <TreeView
        root={tree}
        manual
        selectedKey={selectedKey}
        onSelectKey={(nodeKey) => {
          if (!disabled) setSelectedKey(nodeKey);
        }}
        className="max-h-80"
      />
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled) insert();
        }}
      >
        <Label htmlFor={inputId}>New key</Label>
        <Input
          id={inputId}
          inputMode="numeric"
          maxLength={2}
          value={newKey}
          disabled={disabled}
          autoComplete="off"
          className="min-h-11 w-20 text-base tabular-nums"
          onChange={(event) => setNewKey(event.target.value.replace(/\D/g, "").slice(0, 2))}
        />
        <Button type="submit" variant="outline" className="min-h-11" disabled={disabled}>
          Insert
        </Button>
      </form>
      {selectedKey === null ? null : (
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Node {selectedKey}</legend>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={disabled}
            onClick={remove}
          >
            <Trash2 aria-hidden="true" />
            Delete {selectedKey}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={disabled}
            onClick={() => turn("left")}
          >
            <RotateCcw aria-hidden="true" />
            Rotate {selectedKey} left
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            disabled={disabled}
            onClick={() => turn("right")}
          >
            <RotateCw aria-hidden="true" />
            Rotate {selectedKey} right
          </Button>
        </fieldset>
      )}
      <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {message}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={disabled || history.length === 1}
          onClick={() => {
            setHistory((current) => current.slice(0, -1));
            setSelectedKey(null);
            setMessage("");
          }}
        >
          <Undo2 aria-hidden="true" />
          Undo
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={disabled || history.length === 1}
          onClick={reset}
        >
          Reset
        </Button>
        <Button
          type="button"
          className="ml-auto min-h-11 px-6"
          disabled={disabled}
          onClick={() => onSubmit({ type: "build_tree", tree: encodeTree(tree) })}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

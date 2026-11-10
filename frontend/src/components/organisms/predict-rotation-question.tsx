import { useId, useState } from "react";

import type { AvlNode } from "@shared/avl";
import type { LearnerAnswer, Rotation } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { RadioOptions } from "@/components/molecules/radio-options";
import { TreeView } from "@/components/organisms/tree-view";
import { cn } from "@/lib/utils";

type PredictRotationQuestionProperties = {
  root: AvlNode | null;
  disabled?: boolean;
  onSubmit: (answer: LearnerAnswer) => void;
  className?: string;
};

const rotationOptions: readonly { value: Rotation; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "leftRight", label: "Left, then right" },
  { value: "rightLeft", label: "Right, then left" },
  { value: "none", label: "No rotation" },
];

export function PredictRotationQuestion({
  root,
  disabled = false,
  onSubmit,
  className,
}: PredictRotationQuestionProperties) {
  const name = useId();
  const [pivotKey, setPivotKey] = useState<number | null>(null);
  const [rotation, setRotation] = useState<Rotation | null>(null);
  const shownPivot = rotation === "none" ? null : pivotKey;
  const ready = rotation !== null && (rotation === "none" || pivotKey !== null);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <TreeView
        root={root}
        manual
        selectedKey={shownPivot}
        onSelectKey={(nodeKey) => {
          if (disabled) return;
          if (rotation === "none") setRotation(null);
          setPivotKey((current) => (current === nodeKey && rotation !== "none" ? null : nodeKey));
        }}
        className="max-h-72"
      />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {rotation === "none"
          ? "Pivot: none, because there is no rotation"
          : shownPivot === null
            ? "Pivot: tap a node on the tree"
            : `Pivot: ${shownPivot}`}
      </p>
      <RadioOptions
        legend="Rotation"
        name={name}
        options={rotationOptions}
        value={rotation}
        disabled={disabled}
        onChange={setRotation}
      />
      <Button
        type="button"
        className="min-h-11 self-end px-6"
        disabled={disabled || !ready}
        onClick={() => {
          if (rotation === null) return;
          onSubmit({
            type: "predict_rotation",
            rotation,
            pivotKey: shownPivot,
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
}

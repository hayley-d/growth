import { Check, Eraser, Play, Undo2, X } from "lucide-react";

import { cn } from "@/lib/utils";

type TraversalPredictionProperties = {
  orderName: string;
  prediction: readonly number[];
  marks: readonly boolean[] | null;
  total: number;
  busy: boolean;
  isOver: boolean;
  onUndo: () => void;
  onClear: () => void;
  onCheck: () => void;
  className?: string;
};

const buttonClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40";

export function TraversalPrediction({
  orderName,
  prediction,
  marks,
  total,
  busy,
  isOver,
  onUndo,
  onClear,
  onCheck,
  className,
}: TraversalPredictionProperties) {
  const emptyPlaces = Array.from(
    { length: Math.max(total - prediction.length, 0) },
    (_, offset) => prediction.length + offset + 1,
  );
  return (
    <section
      aria-labelledby="prediction-heading"
      data-drop="predict"
      className={cn(
        "flex flex-col gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors motion-reduce:transition-none",
        isOver ? "border-primary bg-primary/10" : "bg-card",
        className,
      )}
    >
      <h2 id="prediction-heading" className="font-semibold">
        Predict the {orderName.toLowerCase()} walk
      </h2>
      <ol aria-label="Your prediction" className="flex flex-wrap gap-2">
        {prediction.map((key, index) => {
          const mark = marks?.[index];
          return (
            <li
              key={key}
              className={cn(
                "inline-flex min-h-10 items-center gap-1.5 rounded-full border-2 bg-background pr-3 pl-1.5 font-semibold tabular-nums",
                mark === true && "border-primary",
                mark === false && "border-destructive bg-destructive/10",
              )}
            >
              <span className="grid size-6 place-items-center rounded-full bg-muted text-xs">
                {index + 1}
              </span>
              {key}
              {mark === true ? <Check aria-label="right" className="size-4 text-primary" /> : null}
              {mark === false ? <X aria-label="wrong" className="size-4 text-destructive" /> : null}
            </li>
          );
        })}
        {emptyPlaces.map((place) => (
          <li
            key={`place-${place}`}
            aria-hidden="true"
            className="min-h-10 w-14 rounded-full border-2 border-dashed"
          />
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">
        Drag nodes here in the order the walk visits them, or tap them.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={prediction.length === 0}
          className={cn(buttonClass, "hover:bg-muted")}
        >
          <Undo2 aria-hidden="true" className="size-4" />
          Undo
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={prediction.length === 0}
          className={cn(buttonClass, "hover:bg-muted")}
        >
          <Eraser aria-hidden="true" className="size-4" />
          Clear
        </button>
        <button
          type="button"
          onClick={onCheck}
          disabled={prediction.length === 0 || busy}
          className={cn(buttonClass, "ml-auto bg-primary text-primary-foreground")}
        >
          <Play aria-hidden="true" className="size-4" fill="currentColor" />
          Check, then watch
        </button>
      </div>
    </section>
  );
}

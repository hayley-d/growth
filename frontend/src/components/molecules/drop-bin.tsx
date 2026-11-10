import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

type DropBinProperties = {
  dragging: boolean;
  active: boolean;
  className?: string;
};

export function DropBin({ dragging, active, className }: DropBinProperties) {
  return (
    <div
      data-drop="bin"
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border-2 bg-card text-muted-foreground shadow-sm transition-[opacity,transform,background-color,border-color,color] duration-200 motion-reduce:transition-none",
        dragging && !active && "border-foreground text-foreground",
        active &&
          "scale-125 border-destructive bg-destructive text-destructive-foreground motion-reduce:scale-100",
        className,
      )}
    >
      <Trash2
        aria-hidden="true"
        className={cn(
          "size-5 transition-transform duration-200 motion-reduce:transition-none",
          active && "-rotate-12 motion-reduce:rotate-0",
        )}
      />
      <span className="sr-only">
        {active ? "Drop to delete" : "Bin: drop a node here to delete it"}
      </span>
    </div>
  );
}

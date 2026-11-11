import { Button } from "@/components/atoms/button";
import type { StepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type StepButtonsProperties = {
  player: Pick<StepPlayer, "index" | "isFirst" | "isLast" | "first" | "back" | "forward">;
  total: number;
  className?: string;
};

export function StepButtons({ player, total, className }: StepButtonsProperties) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <span className="text-muted-foreground text-sm">
        {player.index} of {total}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" className="min-h-11" onClick={player.first}>
          Reset
        </Button>
        <Button
          variant="outline"
          className="min-h-11"
          aria-disabled={player.isFirst}
          onClick={player.back}
        >
          Back
        </Button>
        <Button className="min-h-11" aria-disabled={player.isLast} onClick={player.forward}>
          Step
        </Button>
      </div>
    </div>
  );
}

import { masteryLabel } from "@shared/schemas";
import { cn } from "@/lib/utils";

type MasteryMeterProperties = {
  mastery: number;
  className?: string;
};

export function MasteryMeter({ mastery, className }: MasteryMeterProperties) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-sm">
        Mastery <span className="font-semibold">{mastery}%</span> · {masteryLabel(mastery)}
      </p>
      <div
        role="progressbar"
        aria-label="Mastery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={mastery}
        className="h-2 w-full overflow-hidden rounded-full border"
      >
        <div className="h-full bg-primary" style={{ width: `${mastery}%` }} />
      </div>
    </div>
  );
}

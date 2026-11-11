import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/atoms/button";

type ProgressHeaderProperties = {
  label: string;
  done: number;
  total: number;
  onBack?: () => void;
};

export function ProgressHeader({ label, done, total, onBack }: ProgressHeaderProperties) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {onBack ? (
          <Button variant="outline" className="min-h-11 px-4" onClick={onBack}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

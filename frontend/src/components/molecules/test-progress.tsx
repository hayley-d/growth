import { cn } from "@/lib/utils";

type TestProgressProperties = {
  questionNumber: number;
  total: number;
  className?: string;
};

export function TestProgress({ questionNumber, total, className }: TestProgressProperties) {
  const percentage = Math.round((questionNumber / total) * 100);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-sm font-medium">
        Question {questionNumber} of {total}
      </p>
      <div
        role="progressbar"
        aria-label="Test progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={questionNumber}
        className="h-2 w-full overflow-hidden rounded-full border"
      >
        <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

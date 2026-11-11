import { CircleCheck } from "lucide-react";

type GoalReachedProperties = {
  message: string;
};

export function GoalReached({ message }: GoalReachedProperties) {
  return (
    <p className="flex items-center gap-2 rounded-md border-2 border-primary bg-primary/10 px-4 py-3 font-medium">
      <CircleCheck aria-hidden className="size-5 shrink-0 text-primary" />
      {message}
    </p>
  );
}

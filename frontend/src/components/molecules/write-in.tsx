import { useId } from "react";

import { Textarea } from "@/components/atoms/textarea";
import { useWritingStore } from "@/stores/writing-store";

export function WriteIn({ id }: { id: string }) {
  const fieldId = useId();
  const hintId = useId();
  const text = useWritingStore((state) => state.written[id] ?? "");
  const write = useWritingStore((state) => state.write);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="font-semibold">
        Your answer
      </label>
      <Textarea
        id={fieldId}
        value={text}
        onChange={(event) => write(id, event.target.value)}
        aria-describedby={hintId}
        className="min-h-32 text-base"
      />
      <p id={hintId} className="text-sm text-muted-foreground">
        Only you can see this. It isn't saved.
      </p>
    </div>
  );
}

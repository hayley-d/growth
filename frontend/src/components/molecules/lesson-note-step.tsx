import { Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { cn } from "@/lib/utils";

const saveDelayMilliseconds = 1000;
const maximumLength = 2000;

type SaveStatus = "idle" | "saving" | "saved" | "error";

type LessonNoteStepProperties = {
  prompt: string;
  savedBody: string;
  onSave: (body: string) => Promise<void>;
  className?: string;
};

export function LessonNoteStep({ prompt, savedBody, onSave, className }: LessonNoteStepProperties) {
  const textareaId = useId();
  const [text, setText] = useState(savedBody);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const textReference = useRef(savedBody);
  const savedReference = useRef(savedBody);
  const timerReference = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const savingReference = useRef(false);
  const onSaveReference = useRef(onSave);
  onSaveReference.current = onSave;

  const flush = useCallback(() => {
    clearTimeout(timerReference.current);
    const body = textReference.current;
    if (savingReference.current || body === savedReference.current) return;
    savingReference.current = true;
    setStatus("saving");
    onSaveReference.current(body).then(
      () => {
        savingReference.current = false;
        savedReference.current = body;
        if (textReference.current === body) setStatus("saved");
        else flush();
      },
      () => {
        savingReference.current = false;
        setStatus("error");
      },
    );
  }, []);

  useEffect(() => {
    if (textReference.current !== savedReference.current) return;
    textReference.current = savedBody;
    savedReference.current = savedBody;
    setText(savedBody);
  }, [savedBody]);

  useEffect(() => flush, [flush]);

  const handleChange = (value: string) => {
    textReference.current = value;
    setText(value);
    setStatus("idle");
    clearTimeout(timerReference.current);
    timerReference.current = setTimeout(flush, saveDelayMilliseconds);
  };

  return (
    <section
      aria-labelledby={`${textareaId}-heading`}
      className={cn("flex flex-col gap-3", className)}
    >
      <h2 id={`${textareaId}-heading`} className="text-xl font-semibold">
        Explain it in your own words
      </h2>
      <Label htmlFor={textareaId}>{prompt}</Label>
      <Textarea
        id={textareaId}
        value={text}
        maxLength={maximumLength}
        onBlur={flush}
        onChange={(event) => handleChange(event.target.value)}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p role="status" className="flex min-h-6 items-center gap-1.5">
          {status === "saving" && (
            <>
              <LoaderCircle
                aria-hidden
                className="size-4 animate-spin motion-reduce:animate-none"
              />
              Saving…
            </>
          )}
          {status === "saved" && (
            <>
              <Check aria-hidden className="size-4" />
              Saved
            </>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1.5 text-destructive">
              <TriangleAlert aria-hidden className="size-4" />
              Could not save. Your note is still here.
            </span>
          )}
        </p>
        <p>
          {text.length} / {maximumLength}
        </p>
      </div>
    </section>
  );
}

import { useId, useState } from "react";

import type { LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { tidyText } from "@/lib/tidy-text";
import { cn } from "@/lib/utils";

type TextQuestionProperties = {
  disabled?: boolean;
  onSubmit: (answer: LearnerAnswer) => void;
  className?: string;
};

const maxAnswerLength = 200;

export function TextQuestion({ disabled = false, onSubmit, className }: TextQuestionProperties) {
  const inputId = useId();
  const [text, setText] = useState("");
  const tidied = tidyText(text);
  const tooLong = tidied.length > maxAnswerLength;

  return (
    <form
      className={cn("flex flex-col gap-3", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (tidied !== "" && !tooLong) onSubmit({ type: "text", text: tidied });
      }}
    >
      <Label htmlFor={inputId}>Your answer</Label>
      <Input
        id={inputId}
        value={text}
        disabled={disabled}
        autoComplete="off"
        className="min-h-12 text-base"
        onChange={(event) => setText(event.target.value)}
        onBlur={() => setText(tidied)}
      />
      <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {tooLong
          ? `Too long: ${tidied.length} of ${maxAnswerLength} characters once tidied.`
          : tidied !== "" && tidied !== text
            ? `Checked as: ${tidied}`
            : null}
      </p>
      <Button
        type="submit"
        className="min-h-11 self-end px-6"
        disabled={disabled || tidied === "" || tooLong}
      >
        Submit
      </Button>
    </form>
  );
}

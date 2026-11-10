import { useId, useState } from "react";

import type { LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { RadioOptions } from "@/components/molecules/radio-options";
import { cn } from "@/lib/utils";

type MultipleChoiceQuestionProperties = {
  options: readonly { id: string; text: string }[];
  disabled?: boolean;
  onSubmit: (answer: LearnerAnswer) => void;
  className?: string;
};

export function MultipleChoiceQuestion({
  options,
  disabled = false,
  onSubmit,
  className,
}: MultipleChoiceQuestionProperties) {
  const name = useId();
  const [optionId, setOptionId] = useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <RadioOptions
        legend="Answer options"
        name={name}
        options={options.map((option) => ({ value: option.id, label: option.text }))}
        value={optionId}
        disabled={disabled}
        onChange={setOptionId}
      />
      <Button
        type="button"
        className="min-h-11 self-end px-6"
        disabled={disabled || optionId === null}
        onClick={() => {
          if (optionId !== null) onSubmit({ type: "multiple_choice", optionId });
        }}
      >
        Submit
      </Button>
    </div>
  );
}

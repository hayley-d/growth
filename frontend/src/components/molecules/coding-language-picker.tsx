import { useId } from "react";

import type { CodeLanguageOption } from "@/lib/code-languages";
import { cn } from "@/lib/utils";

type CodingLanguagePickerProperties = {
  languages: readonly CodeLanguageOption[];
  value: string;
  learnerLanguage?: string;
  onChange: (language: string) => void;
  className?: string;
};

export function CodingLanguagePicker({
  languages,
  value,
  learnerLanguage,
  onChange,
  className,
}: CodingLanguagePickerProperties) {
  const name = useId();

  return (
    <fieldset className={cn("inline-flex rounded-full bg-muted p-1", className)}>
      <legend className="sr-only">Code language</legend>
      {languages.map((language) => {
        const isSelected = language.code === value;
        const isLearners = language.code === learnerLanguage;

        return (
          <label
            key={language.code}
            className={cn(
              "relative flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring motion-reduce:transition-none sm:px-4",
              isSelected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <input
              type="radio"
              name={name}
              value={language.code}
              checked={isSelected}
              onChange={() => onChange(language.code)}
              className="sr-only"
            />
            {language.name}
            {isLearners ? (
              <>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
                <span className="sr-only"> (your language)</span>
              </>
            ) : null}
          </label>
        );
      })}
    </fieldset>
  );
}

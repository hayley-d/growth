import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { type CodeLanguageOption, findCodeLanguage } from "@/lib/code-languages";
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
  const selected = findCodeLanguage(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Code language: ${selected.name}`}
        className={cn(
          "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-muted pr-3 pl-4 text-sm font-medium transition-colors hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none",
          className,
        )}
      >
        {selected.name}
        {selected.code === learnerLanguage ? (
          <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary" />
        ) : null}
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup
          aria-label="Code language"
          value={selected.code}
          onValueChange={onChange}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem
              key={language.code}
              value={language.code}
              className="min-h-11 cursor-pointer"
            >
              {language.name}
              {language.code === learnerLanguage ? (
                <>
                  <span className="ml-auto text-xs text-muted-foreground" aria-hidden="true">
                    Yours
                  </span>
                  <span className="sr-only"> (your language)</span>
                </>
              ) : null}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

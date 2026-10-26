import { Check } from "lucide-react";

import { type ColourScheme, colourSchemes } from "@/lib/colour-schemes";
import { cn } from "@/lib/utils";

type ColourSchemePickerProperties = {
  value: ColourScheme;
  onChange: (colourScheme: ColourScheme) => void;
  className?: string;
};

const swatches = ["bg-primary", "bg-secondary", "bg-accent", "bg-destructive"];

export function ColourSchemePicker({ value, onChange, className }: ColourSchemePickerProperties) {
  return (
    <fieldset className={cn("flex flex-col gap-3", className)}>
      <legend className="sr-only">Colour scheme</legend>
      {colourSchemes.map((scheme) => {
        const isSelected = scheme.id === value;

        return (
          <label
            key={scheme.id}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors hover:bg-muted has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background motion-reduce:transition-none",
              isSelected ? "border-foreground" : "border-border",
            )}
          >
            <input
              type="radio"
              name="colour-scheme"
              value={scheme.id}
              checked={isSelected}
              onChange={() => onChange(scheme.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              data-colour-scheme={scheme.id}
              className="flex shrink-0 -space-x-1.5"
            >
              {swatches.map((swatch) => (
                <span
                  key={swatch}
                  className={cn("size-6 rounded-full border-2 border-background", swatch)}
                />
              ))}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{scheme.label}</span>
              <span className="text-sm text-muted-foreground">{scheme.description}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                isSelected ? "border-foreground bg-foreground text-background" : "border-border",
              )}
            >
              {isSelected ? <Check className="size-4" /> : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

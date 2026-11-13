import { type ColourScheme, colourSchemes } from "@/lib/colour-schemes";
import { cn } from "@/lib/utils";

type ColourSchemeChoicesProperties = {
  value: ColourScheme;
  onChange: (colourScheme: ColourScheme) => void;
  className?: string;
};

export function ColourSchemeChoices({ value, onChange, className }: ColourSchemeChoicesProperties) {
  const selected = colourSchemes.find((scheme) => scheme.id === value);

  return (
    <fieldset className={cn("flex flex-col items-center gap-2", className)}>
      <legend className="sr-only">Colour scheme</legend>
      <div className="flex flex-wrap justify-center sm:gap-1">
        {colourSchemes.map((scheme) => (
          <label
            key={scheme.id}
            className="group flex min-h-11 cursor-pointer items-center rounded-md px-2 text-sm font-medium sm:px-3 sm:text-base text-muted-foreground transition-colors hover:text-foreground has-checked:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring motion-reduce:transition-none"
          >
            <input
              type="radio"
              name="colour-scheme"
              value={scheme.id}
              checked={scheme.id === value}
              onChange={() => onChange(scheme.id)}
              aria-describedby="colour-scheme-description"
              className="sr-only"
            />
            <span className="relative isolate after:absolute after:inset-x-[-0.15em] after:bottom-0 after:-z-10 after:h-[45%] after:origin-left after:scale-x-0 after:rounded-sm after:bg-primary after:opacity-40 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-hover:after:opacity-25 group-has-checked:after:scale-x-100 group-has-checked:after:opacity-40 motion-reduce:after:transition-none">
              {scheme.label}
            </span>
          </label>
        ))}
      </div>
      <p id="colour-scheme-description" className="text-center text-sm text-muted-foreground">
        {selected?.description}
      </p>
    </fieldset>
  );
}

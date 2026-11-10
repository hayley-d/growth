import { cn } from "@/lib/utils";

type RadioOption<Value extends string> = {
  value: Value;
  label: string;
};

type RadioOptionsProperties<Value extends string> = {
  legend: string;
  name: string;
  options: readonly RadioOption<Value>[];
  value: Value | null;
  disabled?: boolean;
  onChange: (value: Value) => void;
  className?: string;
};

export function RadioOptions<Value extends string>({
  legend,
  name,
  options,
  value,
  disabled = false,
  onChange,
  className,
}: RadioOptionsProperties<Value>) {
  return (
    <fieldset disabled={disabled} className={cn("flex flex-col gap-2", className)}>
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 bg-background px-4 text-base transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 has-[:disabled]:cursor-default has-[:disabled]:opacity-60 motion-reduce:transition-none",
            value === option.value
              ? "border-primary bg-primary/10 font-semibold"
              : "hover:bg-muted",
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="size-5 accent-primary"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

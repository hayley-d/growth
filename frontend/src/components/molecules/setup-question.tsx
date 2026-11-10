import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { cn } from "@/lib/utils";

export type SetupOption = { value: string; label: string };

type SetupQuestionProperties = {
  id: string;
  label: string;
  value: string | undefined;
  options: readonly SetupOption[];
  placeholder: string;
  focusOnMount?: boolean;
  isLast?: boolean;
  onChange: (value: string) => void;
};

export function SetupQuestion({
  id,
  label,
  value,
  options,
  placeholder,
  focusOnMount = false,
  isLast = false,
  onChange,
}: SetupQuestionProperties) {
  const selectReference = useRef<HTMLButtonElement>(null);
  const focusWhenShown = useRef(focusOnMount);
  const answered = value !== undefined;

  useEffect(() => {
    if (focusWhenShown.current) selectReference.current?.focus();
  }, []);

  return (
    <motion.li
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-4 overflow-hidden"
    >
      <span aria-hidden="true" className="relative flex justify-center pt-1">
        <span
          className={cn(
            "relative z-10 grid size-7 place-items-center rounded-full border-2 transition-colors duration-300 motion-reduce:transition-none",
            answered
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/70 bg-card",
          )}
        >
          {answered ? <Check className="size-4" strokeWidth={3} /> : null}
        </span>
        {isLast ? null : (
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: answered ? 1 : 0.35 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={cn(
              "absolute top-8 bottom-0 left-1/2 w-0.5 -translate-x-1/2 origin-top rounded-full",
              answered ? "bg-primary" : "bg-border",
            )}
          />
        )}
      </span>
      <div className="flex min-w-0 flex-col gap-2 pb-7">
        <label htmlFor={id} className="text-lg leading-snug font-semibold">
          {label}
        </label>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger
            ref={selectReference}
            id={id}
            className={cn(
              "min-h-12 w-full rounded-xl border-2 bg-background py-2 pr-4 pl-4 text-base font-medium shadow-none transition-colors data-[size=default]:h-auto motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-5",
              answered ? "border-primary/60" : "border-input",
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" className="w-(--radix-select-trigger-width) rounded-xl">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="min-h-11 text-base">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.li>
  );
}

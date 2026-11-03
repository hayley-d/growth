import { cn } from "@/lib/utils";

type CodeLineProperties = {
  number: number;
  text: string;
  isCurrent: boolean;
};

export function CodeLine({ number, text, isCurrent }: CodeLineProperties) {
  return (
    <li
      aria-current={isCurrent ? "step" : undefined}
      className={cn(
        "relative flex h-7 items-center pr-6 whitespace-pre",
        isCurrent && "font-semibold text-accent-foreground",
      )}
    >
      <span aria-hidden="true" className="flex w-6 shrink-0 justify-center">
        {isCurrent ? (
          <span className="size-2 rounded-full bg-accent-foreground ring-4 ring-accent-foreground/20" />
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "w-8 shrink-0 pr-4 text-right tabular-nums select-none",
          isCurrent ? "text-accent-foreground" : "text-muted-foreground",
        )}
      >
        {number}
      </span>
      <span className="sr-only">Line {number}: </span>
      <code>{text === "" ? " " : text}</code>
    </li>
  );
}

import { ChevronRight } from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { CommandLog } from "@/components/molecules/command-log";
import { maxCommandLength } from "@/lib/playground/commands";
import type { LogEntry } from "@/lib/playground/playground-reducer";
import { cn } from "@/lib/utils";

type PlaygroundConsoleProperties = {
  entries: readonly LogEntry[];
  prompt: string;
  placeholder: string;
  suggestions: readonly string[];
  emptyText?: string;
  busy: boolean;
  onRun: (text: string) => void;
  onReplay: (id: number) => void;
  className?: string;
};

export function PlaygroundConsole({
  entries,
  prompt,
  placeholder,
  suggestions,
  emptyText = "Type a command below, or tap one to fill it in. help lists them all.",
  busy,
  onRun,
  onReplay,
  className,
}: PlaygroundConsoleProperties) {
  const [text, setText] = useState("");
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || text.trim() === "") return;
    onRun(text);
    setText("");
  };

  return (
    <section
      aria-label="Console"
      className={cn("flex flex-col gap-3 rounded-2xl border-2 bg-card p-3 sm:p-4", className)}
    >
      <CommandLog entries={entries} busy={busy} emptyText={emptyText} onReplay={onReplay} />
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label htmlFor={inputId} className="sr-only">
          Command
        </label>
        <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border-2 bg-background px-3 font-mono focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center text-sm text-primary"
          >
            {prompt}
            <ChevronRight className="size-4" />
          </span>
          <input
            id={inputId}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholder}
            maxLength={maxCommandLength}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="off"
            className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          title={busy ? "Wait for the run to finish, or pause it" : undefined}
          className="min-h-12 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
        >
          Run
        </button>
      </form>
      <ul aria-label="Try a command" className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              onClick={() => setText(suggestion)}
              className="min-h-9 rounded-full border bg-background px-3 font-mono text-xs transition-colors hover:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

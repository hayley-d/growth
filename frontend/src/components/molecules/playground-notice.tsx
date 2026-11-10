import { CircleAlert, CircleCheck, CircleX, Info, type LucideIcon } from "lucide-react";

import type { Tone } from "@/lib/playground/run-command";
import { cn } from "@/lib/utils";

type PlaygroundNoticeProperties = {
  tone: Tone;
  message: string;
  className?: string;
};

const toneIcons: Record<Tone, LucideIcon> = {
  good: CircleCheck,
  warn: CircleAlert,
  bad: CircleX,
  info: Info,
};

const toneClasses: Record<Tone, string> = {
  good: "border-primary/60",
  warn: "border-warning bg-warning/15",
  bad: "border-destructive bg-destructive/10",
  info: "border-border",
};

export function PlaygroundNotice({ tone, message, className }: PlaygroundNoticeProperties) {
  const Icon = toneIcons[tone];
  return (
    <p
      role={tone === "bad" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 bg-card px-4 py-3 text-sm sm:text-base",
        toneClasses[tone],
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <span className="min-w-0 [overflow-wrap:anywhere]">{message}</span>
    </p>
  );
}

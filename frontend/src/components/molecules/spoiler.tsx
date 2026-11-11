import { Eye, EyeOff } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

type SpoilerProperties = {
  label: string;
  children: ReactNode;
};

export function Spoiler({ label, children }: SpoilerProperties) {
  const [shown, setShown] = useState(false);
  const contentId = useId();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{label}</p>
        <Button
          type="button"
          variant="ghost"
          className="min-h-11"
          aria-expanded={shown}
          aria-controls={contentId}
          onClick={() => setShown((current) => !current)}
        >
          {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
          {shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        </Button>
      </div>
      <div className="relative">
        <div
          id={contentId}
          aria-hidden={!shown}
          inert={!shown}
          className={cn(
            "rounded-md bg-muted px-4 py-3 transition-opacity motion-reduce:transition-none",
            shown ? "opacity-100" : "invisible opacity-0",
          )}
        >
          {children}
        </div>
        {shown ? null : (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => setShown(true)}
            className="absolute inset-0 min-h-11 cursor-pointer rounded-md bg-muted-foreground transition-colors hover:bg-foreground motion-reduce:transition-none"
          />
        )}
      </div>
    </div>
  );
}

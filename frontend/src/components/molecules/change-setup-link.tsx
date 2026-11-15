import { Link } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { type PlaygroundSetup, toSearch } from "@/lib/playground/setup";
import { cn } from "@/lib/utils";

type ChangeSetupLinkProperties = {
  setup: PlaygroundSetup;
  className?: string;
};

export function ChangeSetupLink({ setup, className }: ChangeSetupLinkProperties) {
  return (
    <Link
      to="/playground"
      search={toSearch(setup)}
      aria-label="Change setup"
      title="Change setup"
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none",
        className,
      )}
    >
      <Settings aria-hidden="true" className="size-5" />
    </Link>
  );
}

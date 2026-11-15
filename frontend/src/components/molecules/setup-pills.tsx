import { Link } from "@tanstack/react-router";
import { Hand, Pencil, Play } from "lucide-react";

import {
  exploreNames,
  type PlaygroundSetup,
  topicNames,
  toSearch,
  traversalNames,
} from "@/lib/playground/setup";
import { cn } from "@/lib/utils";

type SetupPillsProperties = {
  setup: PlaygroundSetup;
  className?: string;
};

const pillClass =
  "inline-flex min-h-9 items-center gap-2 rounded-full border-2 bg-card px-3.5 text-sm font-semibold";

export function SetupPills({ setup, className }: SetupPillsProperties) {
  const ExploreIcon = setup.explore === "interact" ? Hand : Play;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <ul aria-label="Your setup" className="flex flex-wrap gap-2">
        <li className={pillClass}>
          {setup.topic === "traversal" ? traversalNames[setup.traversal] : topicNames.avl}
        </li>
        <li className={pillClass}>
          <ExploreIcon aria-hidden="true" className="size-4 text-primary" />
          {exploreNames[setup.explore]}
        </li>
      </ul>
      <Link
        to="/playground"
        search={toSearch(setup)}
        className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Pencil aria-hidden="true" className="size-4" />
        Change setup
      </Link>
    </div>
  );
}

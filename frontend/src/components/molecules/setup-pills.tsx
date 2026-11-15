import { Hand, Play, Route, Scale } from "lucide-react";

import {
  exploreBadgeNames,
  type PlaygroundSetup,
  topicNames,
  traversalNames,
} from "@/lib/playground/setup";
import { cn } from "@/lib/utils";

type SetupPillsProperties = {
  setup: PlaygroundSetup;
  className?: string;
};

const pillClass =
  "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold whitespace-nowrap";

const topicClass = "border-pill-topic/30 bg-pill-topic/10 text-pill-topic";
const exploreClass = "border-pill-explore/30 bg-pill-explore/10 text-pill-explore";

export function SetupPills({ setup, className }: SetupPillsProperties) {
  const isTraversal = setup.topic === "traversal";
  const TopicIcon = isTraversal ? Route : Scale;
  const ExploreIcon = setup.explore === "interact" ? Hand : Play;
  return (
    <ul aria-label="Your setup" className={cn("flex flex-wrap gap-1.5", className)}>
      <li className={cn(pillClass, topicClass)}>
        <TopicIcon aria-hidden="true" className="size-3.5" />
        {isTraversal ? traversalNames[setup.traversal] : topicNames.avl}
      </li>
      <li className={cn(pillClass, exploreClass)}>
        <ExploreIcon aria-hidden="true" className="size-3.5" />
        {exploreBadgeNames[setup.explore]}
      </li>
    </ul>
  );
}

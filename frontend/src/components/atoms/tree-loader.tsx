import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type TreeLoaderProperties = {
  className?: string;
  label?: string;
};

const loaderStyle = { "--tree-loader-duration": "2.4s" } as CSSProperties;

export function TreeLoader({ className, label = "Loading" }: TreeLoaderProperties) {
  return (
    <div role="status" aria-label={label} className={cn("inline-flex", className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-16" style={loaderStyle}>
        <line
          className="tree-loader-edge tree-loader-left-edge"
          pathLength={1}
          x1="16"
          y1="9"
          x2="8"
          y2="23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          className="tree-loader-edge tree-loader-right-edge"
          pathLength={1}
          x1="16"
          y1="9"
          x2="24"
          y2="23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          className="tree-loader-node tree-loader-root"
          cx="16"
          cy="8"
          r="5"
          fill="var(--primary)"
          stroke="var(--primary-foreground)"
          strokeWidth="1.5"
        />
        <circle
          className="tree-loader-node tree-loader-left-node"
          cx="8"
          cy="24"
          r="5"
          fill="var(--secondary)"
          stroke="var(--secondary-foreground)"
          strokeWidth="1.5"
        />
        <circle
          className="tree-loader-node tree-loader-right-node"
          cx="24"
          cy="24"
          r="5"
          fill="var(--accent)"
          stroke="var(--accent-foreground)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

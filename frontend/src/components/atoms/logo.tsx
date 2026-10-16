import { cn } from "@/lib/utils";

type LogoProperties = {
  className?: string;
};

export function Logo({ className }: LogoProperties) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Rebalance logo"
      className={cn("size-8", className)}
    >
      <line
        x1="16"
        y1="9"
        x2="8"
        y2="23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="9"
        x2="24"
        y2="23"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="8"
        r="5"
        fill="var(--primary)"
        stroke="var(--primary-foreground)"
        strokeWidth="1.5"
      />
      <circle
        cx="8"
        cy="24"
        r="5"
        fill="var(--secondary)"
        stroke="var(--secondary-foreground)"
        strokeWidth="1.5"
      />
      <circle
        cx="24"
        cy="24"
        r="5"
        fill="var(--accent)"
        stroke="var(--accent-foreground)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

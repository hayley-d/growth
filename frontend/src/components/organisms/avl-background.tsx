import { GrowingAvlTree } from "@/components/molecules/growing-avl-tree";
import { cn } from "@/lib/utils";

type AvlBackgroundProperties = {
  className?: string;
};

export function AvlBackground({ className }: AvlBackgroundProperties) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden opacity-30", className)}
    >
      <GrowingAvlTree
        seed={11}
        maxSize={9}
        className="absolute bottom-4 left-1/2 w-72 -translate-x-1/2 sm:top-[8%] sm:bottom-auto sm:left-[4%] sm:translate-x-0"
      />
      <GrowingAvlTree
        seed={23}
        delay={500}
        maxSize={7}
        className="absolute top-[38%] right-[3%] hidden w-64 sm:block"
      />
      <GrowingAvlTree
        seed={37}
        delay={900}
        maxSize={8}
        className="absolute bottom-[5%] left-[10%] hidden w-80 lg:block"
      />
    </div>
  );
}

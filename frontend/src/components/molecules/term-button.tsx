import { isTermLit, useTreeLinks } from "@/lib/lesson/tree-links";
import { cn } from "@/lib/utils";

type TermButtonProperties = {
  word: string;
  term: string;
  keys: readonly number[];
  hintId?: string;
};

export function TermButton({ word, term, keys, hintId }: TermButtonProperties) {
  const links = useTreeLinks();
  const lit = isTermLit(links, term, keys);
  const hovered = { keys, term };
  return (
    <button
      type="button"
      aria-pressed={links.pinned === term}
      aria-describedby={hintId}
      data-term={term}
      data-lit={lit || undefined}
      onPointerEnter={() => links.hover(hovered)}
      onPointerLeave={() => links.hover(null)}
      onFocus={() => links.hover(hovered)}
      onBlur={() => links.hover(null)}
      onClick={() => links.togglePin(term, keys)}
      className={cn(
        "-mx-0.5 rounded-sm px-0.5 font-semibold text-foreground underline decoration-dotted decoration-2 underline-offset-4 transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        (lit || links.pinned === term) && "bg-accent text-accent-foreground decoration-solid",
      )}
    >
      {word}
    </button>
  );
}

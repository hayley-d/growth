import type { StepKey } from "@shared/avl";
import { CodeListing, codeListingHeight } from "@/components/molecules/code-listing";
import { cn } from "@/lib/utils";

export type CodePanelSnippet = {
  lines: readonly string[];
  lineNumbers: Readonly<Record<string, number>>;
};

type CodePanelProperties = {
  stepKey: StepKey | null;
  snippet: CodePanelSnippet | undefined;
  functionName: string | null;
  languageName: string;
  isLoading: boolean;
  className?: string;
};

const emptyBoxClassName =
  "flex items-center justify-center rounded-xl border border-dashed px-6 text-center text-sm text-muted-foreground";

export function CodePanel({
  stepKey,
  snippet,
  functionName,
  languageName,
  isLoading,
  className,
}: CodePanelProperties) {
  if (!stepKey || !functionName) {
    return (
      <p className={cn(emptyBoxClassName, className)} style={{ height: codeListingHeight }}>
        Pick an operation to see its code run.
      </p>
    );
  }

  if (isLoading && !snippet) {
    return (
      <div
        role="status"
        aria-label="Loading the code"
        className={cn("flex flex-col gap-3 rounded-xl border bg-muted/60 p-5", className)}
        style={{ height: codeListingHeight }}
      >
        {[70, 45, 85, 55, 30].map((width) => (
          <span
            key={width}
            className="h-3 animate-pulse rounded-full bg-muted-foreground/20 motion-reduce:animate-none"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    );
  }

  if (!snippet) {
    return (
      <p className={cn(emptyBoxClassName, className)} style={{ height: codeListingHeight }}>
        There's no {languageName} code for {functionName} yet.
      </p>
    );
  }

  const currentLine = snippet.lineNumbers[stepKey] ?? null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {currentLine === null ? (
        <p role="status" className="text-sm text-muted-foreground">
          This step has no line in the {languageName} code.
        </p>
      ) : null}
      <CodeListing
        lines={snippet.lines}
        currentLine={currentLine}
        label={`${functionName} in ${languageName}`}
      />
    </div>
  );
}

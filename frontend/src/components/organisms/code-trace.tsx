import { type AlgorithmCode, algorithmOf, type Step, type StepVariables } from "@shared/avl";
import { CallStack } from "@/components/molecules/call-stack";
import { CodeListing } from "@/components/molecules/code-listing";
import { LanguagePicker } from "@/components/molecules/language-picker";
import { VariablesTable } from "@/components/molecules/variables-table";
import { codeLanguages, findCodeLanguage, functionNameFor } from "@/lib/code-languages";
import { cn } from "@/lib/utils";

export type CodeTraceStep = Pick<Step, "stepKey" | "variables" | "callStack">;

export type CodeTraceSnippet = {
  source: string;
  lines: Readonly<Record<string, number>>;
};

type CodeTraceProperties = {
  step: CodeTraceStep | null;
  previousVariables?: StepVariables;
  snippets: Partial<Record<AlgorithmCode, CodeTraceSnippet>>;
  language: string;
  learnerLanguage?: string;
  onLanguageChange: (language: string) => void;
  isLoading?: boolean;
  className?: string;
};

export function CodeTrace({
  step,
  previousVariables,
  snippets,
  language,
  learnerLanguage,
  onLanguageChange,
  isLoading = false,
  className,
}: CodeTraceProperties) {
  const algorithm = step ? algorithmOf(step.stepKey) : null;
  const snippet = algorithm ? snippets[algorithm] : undefined;
  const functionName = algorithm ? functionNameFor(algorithm, language) : null;
  const languageName = findCodeLanguage(language).name;

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          {functionName ? (
            <>
              Running
              <code className="rounded-md bg-primary/25 px-2 py-0.5 font-mono font-semibold text-foreground">
                {functionName}
              </code>
            </>
          ) : (
            "Code"
          )}
        </p>
        <LanguagePicker
          languages={codeLanguages}
          value={language}
          learnerLanguage={learnerLanguage}
          onChange={onLanguageChange}
        />
      </div>

      {!step ? (
        <EmptyCode message="Pick an operation to see its code run." />
      ) : isLoading && !snippet ? (
        <div
          role="status"
          aria-label="Loading the code"
          className="flex h-48 flex-col gap-3 rounded-xl border bg-muted/60 p-5"
        >
          {[70, 45, 85, 55, 30].map((width) => (
            <span
              key={width}
              className="h-3 animate-pulse rounded-full bg-muted-foreground/20 motion-reduce:animate-none"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      ) : snippet ? (
        <CodeListing
          lines={snippet.source.split("\n")}
          currentLine={snippet.lines[step.stepKey] ?? null}
          label={`${functionName} in ${languageName}`}
        />
      ) : (
        <EmptyCode message={`There's no ${languageName} code for ${functionName} yet.`} />
      )}

      {step ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <VariablesTable
            variables={step.variables}
            previousVariables={previousVariables}
            language={language}
          />
          <CallStack frames={step.callStack} language={language} />
        </div>
      ) : null}
    </div>
  );
}

function EmptyCode({ message }: { message: string }) {
  return (
    <p className="flex h-48 items-center justify-center rounded-xl border border-dashed px-6 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

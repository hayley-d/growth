import { useMemo } from "react";

import { type AlgorithmCode, algorithmOf, type Step, type StepVariables } from "@shared/avl";
import { CallStack } from "@/components/molecules/call-stack";
import { CodingLanguagePicker } from "@/components/molecules/coding-language-picker";
import { VariablesTable } from "@/components/molecules/variables-table";
import { CodePanel } from "@/components/organisms/code-panel";
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
  const source = snippet?.source;
  const lines = useMemo(() => source?.split("\n"), [source]);

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", className)}>
      <div className="flex justify-end">
        <CodingLanguagePicker
          languages={codeLanguages}
          value={language}
          learnerLanguage={learnerLanguage}
          onChange={onLanguageChange}
        />
      </div>

      <CodePanel
        stepKey={step?.stepKey ?? null}
        snippet={snippet && lines ? { lines, lineNumbers: snippet.lines } : undefined}
        functionName={functionName}
        languageName={languageName}
        isLoading={isLoading}
      />

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

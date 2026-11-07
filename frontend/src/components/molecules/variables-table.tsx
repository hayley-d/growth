import { useId } from "react";

import type { StepVariables } from "@shared/avl";
import { formatVariable } from "@/lib/code-languages";
import { cn } from "@/lib/utils";

type VariablesTableProperties = {
  variables: StepVariables;
  previousVariables?: StepVariables;
  language: string;
  className?: string;
};

export function VariablesTable({
  variables,
  previousVariables,
  language,
  className,
}: VariablesTableProperties) {
  const headingId = useId();
  const entries = Object.entries(variables);

  return (
    <section aria-labelledby={headingId} className={cn("flex flex-col gap-2", className)}>
      <h3
        id={headingId}
        className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
      >
        Variables
      </h3>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No variables at this step.</p>
      ) : (
        <table className="w-full text-sm">
          <caption className="sr-only">Variables at this step</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, value]) => {
              const isChanged =
                previousVariables !== undefined && previousVariables[name] !== value;

              return (
                <tr key={name} className="border-b border-dashed last:border-b-0">
                  <th scope="row" className="py-1.5 pr-4 text-left font-medium">
                    {name}
                  </th>
                  <td className="py-1.5 text-right font-mono tabular-nums">
                    <span className="inline-flex items-center gap-2">
                      {isChanged ? (
                        <>
                          <span aria-hidden="true" className="size-2 rounded-full bg-secondary" />
                          <span className="sr-only">changed to </span>
                        </>
                      ) : null}
                      {formatVariable(value, language)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

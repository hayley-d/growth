import { Children, type ReactNode, useId, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import type { TreeTerms } from "@shared/schemas";
import { TermButton } from "@/components/molecules/term-button";
import { useTreeLinks } from "@/lib/lesson/tree-links";
import { cn } from "@/lib/utils";

const components: Components = {
  h1: ({ children }) => <h3 className="text-xl font-semibold sm:text-2xl">{children}</h3>,
  h2: ({ children }) => <h3 className="text-xl font-semibold sm:text-2xl">{children}</h3>,
  h3: ({ children }) => <h4 className="text-lg font-semibold">{children}</h4>,
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-1 pl-6">{children}</ol>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tr: ({ children }) => <tr className="border-b last:border-b-0">{children}</tr>,
  th: ({ children }) => <th className="px-3 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 align-top">{children}</td>,
  a: ({ children, href }) => (
    <a href={href} className="font-medium text-primary underline underline-offset-4">
      {children}
    </a>
  ),
};

const plainText = (children: ReactNode) =>
  Children.toArray(children).every((child) => typeof child === "string")
    ? Children.toArray(children).join("")
    : null;

function Strong({
  children,
  terms,
  hintId,
}: {
  children: ReactNode;
  terms?: TreeTerms;
  hintId?: string;
}) {
  const { shownKeys } = useTreeLinks();
  const word = plainText(children);
  const term = word?.toLowerCase();
  const keys = term === undefined ? undefined : terms?.[term];
  if (!word || !term || !keys?.every((key) => shownKeys.has(key))) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  }
  return <TermButton word={word} term={term} keys={keys} hintId={hintId} />;
}

type MarkdownProperties = {
  text: string;
  terms?: TreeTerms;
  aside?: ReactNode;
  className?: string;
};

export function Markdown({ text, terms, aside, className }: MarkdownProperties) {
  const id = useId();
  const { shownKeys } = useTreeLinks();
  const linked = Object.values(terms ?? {}).some((keys) => keys.every((key) => shownKeys.has(key)));
  const hintId = linked ? `${id}-hint` : undefined;
  const withTerms = useMemo<Components>(
    () => ({
      ...components,
      strong: ({ children }) => (
        <Strong terms={terms} hintId={hintId}>
          {children}
        </Strong>
      ),
    }),
    [terms, hintId],
  );
  return (
    <div className={cn("flow-root min-w-0 space-y-3 text-base text-foreground", className)}>
      {aside ? <div className="float-right mb-2 ml-4">{aside}</div> : null}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={withTerms}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

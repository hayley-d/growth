import { useState } from "react";

import type { AlgorithmCode } from "@shared/avl";
import type { CodeTraceSnippet } from "@/components/organisms/code-trace";
import { useAlgorithmSnippetQueries } from "@/lib/queries";

export function usePlaygroundSnippets(codes: readonly AlgorithmCode[]) {
  const [language, setLanguage] = useState<string | undefined>(undefined);
  const queries = useAlgorithmSnippetQueries(codes, language);
  const learnerLanguage = queries.find((query) => query.data)?.data?.data.language.code;
  const snippets: Partial<Record<AlgorithmCode, CodeTraceSnippet>> = {};
  codes.forEach((code, index) => {
    const data = queries[index]?.data?.data;
    if (data) snippets[code] = { source: data.source, lines: data.lines };
  });
  return {
    snippets,
    language: language ?? learnerLanguage ?? "pseudocode",
    learnerLanguage,
    setLanguage,
    isLoading: queries.some((query) => query.isLoading),
  };
}

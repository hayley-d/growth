import type { AlgorithmCode, StepVariables } from "@shared/avl";

export type CodeLanguageOption = {
  code: string;
  name: string;
  emptyValue: string;
  caseStyle: "camel" | "snake";
};

const pseudocodeLanguage: CodeLanguageOption = {
  code: "pseudocode",
  name: "Pseudocode",
  emptyValue: "empty",
  caseStyle: "camel",
};

export const codeLanguages: readonly CodeLanguageOption[] = [
  pseudocodeLanguage,
  { code: "java", name: "Java", emptyValue: "null", caseStyle: "camel" },
  { code: "rust", name: "Rust", emptyValue: "None", caseStyle: "snake" },
];

export const findCodeLanguage = (code: string): CodeLanguageOption =>
  codeLanguages.find((language) => language.code === code) ?? pseudocodeLanguage;

export const functionNameFor = (algorithm: AlgorithmCode, language: string): string => {
  const words = algorithm.split("-");
  if (findCodeLanguage(language).caseStyle === "snake") return words.join("_");
  return words
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
};

export const formatVariable = (value: StepVariables[string], language: string): string =>
  value === null ? findCodeLanguage(language).emptyValue : String(value);

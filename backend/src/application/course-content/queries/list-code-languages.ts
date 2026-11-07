import { type ListCodeLanguagesResponse, toListCodeLanguagesResponse } from "@shared/schemas";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";

type ListCodeLanguagesDependencies = {
  codeLanguageRepository: Pick<CodeLanguageRepository, "listAll">;
};

export const makeListCodeLanguages =
  ({ codeLanguageRepository }: ListCodeLanguagesDependencies) =>
  async (): Promise<ListCodeLanguagesResponse> =>
    toListCodeLanguagesResponse(await codeLanguageRepository.listAll());

export type ListCodeLanguages = ReturnType<typeof makeListCodeLanguages>;

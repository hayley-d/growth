import {
  type AlgorithmParams,
  type AlgorithmSnippetQuery,
  type AlgorithmSnippetResponse,
  toAlgorithmSnippetResponse,
} from "@shared/schemas/algorithm";
import { requestContext } from "@/application/context/request-context";
import { defaultCodeLanguageCode } from "@/domain/course-content/code-language";
import type { AlgorithmRepository } from "@/domain/course-content/repositories/algorithm-repository";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";
import type { CodeLineRepository } from "@/domain/course-content/repositories/code-line-repository";
import type { CodeSnippetRepository } from "@/domain/course-content/repositories/code-snippet-repository";
import { NotFoundError } from "@/domain/errors";
import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";

type GetAlgorithmSnippetDependencies = {
  algorithmRepository: Pick<AlgorithmRepository, "findByCode">;
  codeLanguageRepository: Pick<CodeLanguageRepository, "findById" | "findByCode">;
  codeSnippetRepository: Pick<CodeSnippetRepository, "findByAlgorithmIdAndCodeLanguageId">;
  codeLineRepository: Pick<CodeLineRepository, "listByCodeSnippetId">;
  userProfileRepository: Pick<UserProfileRepository, "findById">;
};

export type GetAlgorithmSnippetInput = AlgorithmParams & AlgorithmSnippetQuery;

export const makeGetAlgorithmSnippet = ({
  algorithmRepository,
  codeLanguageRepository,
  codeSnippetRepository,
  codeLineRepository,
  userProfileRepository,
}: GetAlgorithmSnippetDependencies) => {
  const findSavedLanguage = async () => {
    const userId = requestContext.getUserId();
    if (!userId) return null;
    const profile = await userProfileRepository.findById(userId);
    if (!profile?.codeLanguageId) return null;
    return codeLanguageRepository.findById(profile.codeLanguageId);
  };

  const findLanguage = async (languageCode: string | undefined) => {
    if (languageCode) return codeLanguageRepository.findByCode(languageCode);
    return (
      (await findSavedLanguage()) ?? codeLanguageRepository.findByCode(defaultCodeLanguageCode)
    );
  };

  return async ({
    code,
    language,
  }: GetAlgorithmSnippetInput): Promise<AlgorithmSnippetResponse> => {
    const algorithm = await algorithmRepository.findByCode(code);
    if (!algorithm) throw new NotFoundError("Algorithm not found");
    const codeLanguage = await findLanguage(language);
    if (!codeLanguage) throw new NotFoundError("Code language not found");
    const snippet = await codeSnippetRepository.findByAlgorithmIdAndCodeLanguageId(
      algorithm.id,
      codeLanguage.id,
    );
    if (!snippet) {
      throw new NotFoundError(`There's no ${codeLanguage.name} version of ${algorithm.name} yet`);
    }
    const codeLines = await codeLineRepository.listByCodeSnippetId(snippet.id);
    return toAlgorithmSnippetResponse({ algorithm, language: codeLanguage, snippet, codeLines });
  };
};

export type GetAlgorithmSnippet = ReturnType<typeof makeGetAlgorithmSnippet>;

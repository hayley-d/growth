UPDATE "userProfile"
SET "codeLanguageId" = NULL
WHERE "codeLanguageId" IN (
  SELECT "id" FROM "codeLanguage" WHERE "code" IN ('cpp', 'c', 'python', 'javascript')
);

DELETE FROM "codeSnippet"
WHERE "codeLanguageId" IN (
  SELECT "id" FROM "codeLanguage" WHERE "code" IN ('cpp', 'c', 'python', 'javascript')
);

DELETE FROM "codeLanguage" WHERE "code" IN ('cpp', 'c', 'python', 'javascript');

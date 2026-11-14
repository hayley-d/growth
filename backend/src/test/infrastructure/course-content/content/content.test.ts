import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { type AvlNode, decodeTree } from "@shared/avl";
import { balanceOf } from "@shared/engine";
import { checkContent } from "@/infrastructure/course-content/content/check-content";
import type {
  GeneratedQuestionContent,
  WrittenQuestionContent,
} from "@/infrastructure/course-content/content/content-schema";
import { readContent } from "@/infrastructure/course-content/content/read-content";

const contentRoot = fileURLToPath(new URL("../../../../../prisma/content", import.meta.url));

describe("prisma/content", () => {
  it("loads with no problems", async () => {
    expect(checkContent(await readContent(contentRoot), { complete: false }).problems).toEqual([]);
  });

  const generatedBefore = async (folder: string) => {
    const { lessons } = await readContent(contentRoot);
    return lessons
      .filter((lesson) => lesson.folder.localeCompare(folder) < 0)
      .flatMap((lesson) =>
        ((lesson.generated?.data ?? []) as GeneratedQuestionContent[]).map((question) => ({
          ...question,
          id: `${lesson.folder}/${question.key}`,
        })),
      );
  };

  it("only asks about deleting from an AVL tree once the delete lesson is reached", async () => {
    const deleting = (await generatedBefore("11-avl-delete")).filter(
      (question) =>
        question.generatorKey === "delete-result" ||
        (question.generatorKey === "predict-rotation" &&
          question.generatorOptions?.operation !== "insert" &&
          !question.generatorOptions?.unbalanced),
    );
    expect(deleting.map((question) => question.id)).toEqual([]);
  });

  it("only asks about inserting into an AVL tree once the insert lesson is reached", async () => {
    const inserting = (await generatedBefore("10-avl-insert")).filter(
      (question) =>
        question.generatorKey === "insert-result" ||
        (question.generatorKey === "predict-rotation" && !question.generatorOptions?.unbalanced),
    );
    expect(inserting.map((question) => question.id)).toEqual([]);
  });
  const writtenBefore = async (folder: string) => {
    const { lessons } = await readContent(contentRoot);
    return lessons
      .filter((lesson) => lesson.folder.localeCompare(folder) < 0)
      .flatMap((lesson) =>
        ((lesson.questions?.data ?? []) as WrittenQuestionContent[]).map((question) => ({
          ...question,
          id: `${lesson.folder}/${question.key}`,
        })),
      );
  };

  it("doesn't ask learners to insert into or delete from a tree before those lessons", async () => {
    const early = await writtenBefore("10-avl-insert");
    const asking = early.filter((question) =>
      /\b(insert|delete) \d+ (into|from) (this|an) AVL tree/i.test(question.prompt),
    );
    expect(asking.map((question) => question.id)).toEqual([]);
  });

  it("draws an out-of-balance tree whose lowest unbalanced node is the answer's pivot", async () => {
    const lowestUnbalanced = (node: AvlNode | null): number | null => {
      if (!node) return null;
      const below = lowestUnbalanced(node.left) ?? lowestUnbalanced(node.right);
      if (below !== null) return below;
      return Math.abs(balanceOf(node)) >= 2 ? node.key : null;
    };
    const mismatched = (await writtenBefore("99")).filter(
      (question) =>
        question.type === "predict_rotation" &&
        question.tree !== undefined &&
        /out of balance/.test(question.prompt) &&
        question.answer.type === "predict_rotation" &&
        lowestUnbalanced(decodeTree(question.tree)) !== question.answer.pivotKey,
    );
    expect(mismatched.map((question) => question.id)).toEqual([]);
  });
});

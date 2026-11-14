import { describe, expect, it } from "vitest";

import { type AvlNode, decodeTree, toKeys } from "@shared/avl";
import { balanceOf, type Difficulty, generate, heightOf, isAvl } from "@shared/engine";
import { treeSizeBounds } from "@shared/engine/src/generators/support";
import {
  type GeneratedQuestion,
  type GeneratorKey,
  generatedQuestionSchema,
  generatorKeySchema,
} from "@shared/schemas";

const difficulties: Difficulty[] = [1, 2, 3, 4, 5];
const seeds = [...Array.from({ length: 20 }, (_, index) => index + 1), 123456, 1762600000000];
const keys = generatorKeySchema.options;

const requireTree = (text: string | null): AvlNode => {
  const tree = text === null ? null : decodeTree(text);
  if (!tree) throw new Error("expected a tree");
  return tree;
};

const everyCase = (key: GeneratorKey, check: (difficulty: Difficulty, seed: number) => void) => {
  for (const difficulty of difficulties) for (const seed of seeds) check(difficulty, seed);
  return key;
};

const withoutRange = (text: string) => text.replace(/-2 or 2/g, "").replace(/-2/g, "");

const expectHintsHideRotation = (question: GeneratedQuestion) => {
  const hints = withoutRange(question.hints.join(" "));
  expect(hints).not.toMatch(/leftRight|rightLeft|\b(left|right)(-| )(left|right)\b/i);
  expect(hints).not.toMatch(/\b(left|right) rotation\b|rotate \d|is (left|right)-heavy/i);
  if (question.answer.type === "predict_rotation" && question.answer.pivotKey !== null) {
    expect(hints).not.toMatch(new RegExp(`\\b${question.answer.pivotKey}\\b`));
  }
};

const nodeKeys = (text: string | null) => toKeys(requireTree(text));

describe("generate", () => {
  it.each([-1, 1.5, Number.NaN, 2 ** 60])("rejects the seed %s", (seed) => {
    expect(() => generate("height", { seed, difficulty: 1 })).toThrow(RangeError);
  });

  it.each([0, 6, 2.5])("rejects difficulty %s", (difficulty) => {
    expect(() => generate("height", { seed: 1, difficulty: difficulty as Difficulty })).toThrow(
      RangeError,
    );
  });

  it("accepts seed 0", () => {
    expect(
      generatedQuestionSchema.safeParse(generate("is-avl", { seed: 0, difficulty: 3 })).success,
    ).toBe(true);
  });

  it.each(keys)("%s gives schema-valid, deterministic questions without throwing", (key) => {
    everyCase(key, (difficulty, seed) => {
      const question = generate(key, { seed, difficulty });
      expect(generatedQuestionSchema.safeParse(question).success).toBe(true);
      expect(generate(key, { seed, difficulty })).toEqual(question);
    });
  });

  it.each(keys)("%s gives different questions for different seeds", (key) => {
    const prompts = new Set(
      seeds.map((seed) => JSON.stringify(generate(key, { seed, difficulty: 3 }))),
    );
    expect(prompts.size).toBeGreaterThan(1);
  });

  it.each(keys)("%s keeps the tree inside the difficulty size window", (key) => {
    everyCase(key, (difficulty, seed) => {
      const question = generate(key, { seed, difficulty });
      const { minimum, maximum } = treeSizeBounds(difficulty);
      const size = nodeKeys(question.tree).length;
      expect(size).toBeGreaterThanOrEqual(minimum);
      expect(size).toBeLessThanOrEqual(maximum);
    });
  });

  it("gives operation and traversal questions a replay that matches the prompt", () => {
    everyCase("insert-result", (difficulty, seed) => {
      const insert = generate("insert-result", { seed, difficulty });
      const remove = generate("delete-result", { seed, difficulty });
      expect(insert.replay).toMatchObject({ kind: "operation", operation: "insert" });
      expect(remove.replay).toMatchObject({ kind: "operation", operation: "delete" });
      if (insert.replay?.kind === "operation") {
        expect(insert.prompt).toContain(`Insert ${insert.replay.key} `);
      }
      const traversal = generate("traversal-order", { seed, difficulty, order: "postorder" });
      expect(traversal.replay).toEqual({ kind: "traversal", order: "postorder" });
      expect(generate("height", { seed, difficulty }).replay ?? null).toBeNull();
    });
  });

  it("honours the requested traversal order", () => {
    const question = generate("traversal-order", { seed: 4, difficulty: 3, order: "inorder" });
    const sorted = [...nodeKeys(question.tree)].sort((first, second) => first - second);
    const answer =
      question.answer.type === "order_nodes"
        ? question.answer.keys
        : question.answer.type === "text"
          ? question.answer.text.split(",").map(Number)
          : [];
    expect(answer).toEqual(sorted);
  });

  it("insert-result adds one key and stays a valid AVL tree", () => {
    everyCase("insert-result", (difficulty, seed) => {
      const question = generate("insert-result", { seed, difficulty });
      const result = question.answer.type === "build_tree" ? question.answer.tree : null;
      const before = nodeKeys(question.tree);
      const after = nodeKeys(result);
      expect(isAvl(requireTree(result))).toBe(true);
      expect(after.length).toBe(before.length + 1);
      expect(before.every((key) => after.includes(key))).toBe(true);
    });
  });

  it("delete-result removes one key and stays a valid AVL tree", () => {
    everyCase("delete-result", (difficulty, seed) => {
      const question = generate("delete-result", { seed, difficulty });
      const result = question.answer.type === "build_tree" ? question.answer.tree : null;
      const before = nodeKeys(question.tree);
      const after = nodeKeys(result);
      expect(isAvl(requireTree(result))).toBe(true);
      expect(after.length).toBe(before.length - 1);
      expect(after.every((key) => before.includes(key))).toBe(true);
    });
  });

  it("predict-rotation matches the difficulty ramp", () => {
    for (const seed of seeds) {
      const easy = generate("predict-rotation", { seed, difficulty: 1 });
      const hard = generate("predict-rotation", { seed, difficulty: 5 });
      if (easy.answer.type !== "predict_rotation" || hard.answer.type !== "predict_rotation") {
        throw new Error("expected predict_rotation answers");
      }
      expect(easy.answer).toEqual({ type: "predict_rotation", rotation: "none", pivotKey: null });
      expect(["leftRight", "rightLeft"]).toContain(hard.answer.rotation);
      expect(nodeKeys(hard.tree)).toContain(hard.answer.pivotKey);
    }
  });

  it("predict-rotation with unbalanced shows a tree that needs the answer's rotation", () => {
    const lowestUnbalanced = (node: AvlNode | null): number | null => {
      if (!node) return null;
      const below = lowestUnbalanced(node.left) ?? lowestUnbalanced(node.right);
      if (below !== null) return below;
      return Math.abs(balanceOf(node)) >= 2 ? node.key : null;
    };
    for (const difficulty of difficulties) {
      for (const seed of seeds) {
        const question = generate("predict-rotation", { seed, difficulty, unbalanced: true });
        if (question.answer.type !== "predict_rotation")
          throw new Error("expected predict_rotation");
        expect(question.prompt).not.toMatch(/insert|delete/i);
        expect(question.replay).toBeNull();
        expect(lowestUnbalanced(requireTree(question.tree))).toBe(question.answer.pivotKey);
        if (difficulty === 1) expect(question.answer.rotation).toBe("none");
        if (difficulty === 2) expect(["left", "right"]).toContain(question.answer.rotation);
        if (difficulty >= 4) expect(["leftRight", "rightLeft"]).toContain(question.answer.rotation);
      }
    }
  });

  it("delete-result at difficulty 5 rotates and at difficulty 4 does not", () => {
    for (const seed of seeds) {
      const rotated = generate("delete-result", { seed, difficulty: 5 });
      const plain = generate("delete-result", { seed, difficulty: 4 });
      expect(rotated.explanation).toMatch(/rotat/);
      expect(rotated.explanation).toMatch(/two children/);
      expect(plain.explanation).toMatch(/two children/);
      expect(plain.explanation).toMatch(/no rotation is needed/);
    }
  });

  it("balance-factor and height answers match the tree", () => {
    everyCase("height", (difficulty, seed) => {
      const balance = generate("balance-factor", { seed, difficulty });
      const height = generate("height", { seed, difficulty });
      const balanceTree = requireTree(balance.tree);
      const balanceKey = Number(/node (\d+)\?/.exec(balance.prompt)?.[1]);
      const heightKey = /rooted at node (\d+)\?/.exec(height.prompt)?.[1];
      const findNode = (node: AvlNode | null, key: number): AvlNode | null =>
        !node
          ? null
          : node.key === key
            ? node
            : findNode(key < node.key ? node.left : node.right, key);
      const balanceNode = findNode(balanceTree, balanceKey);
      const heightTree = requireTree(height.tree);
      const heightNode =
        heightKey === undefined ? heightTree : findNode(heightTree, Number(heightKey));
      expect(balanceNode).not.toBeNull();
      expect(heightNode).not.toBeNull();
      expect(balance.answer).toEqual({
        type: "text",
        text: String(balanceNode ? balanceOf(balanceNode) : null),
      });
      expect(height.answer).toEqual({ type: "text", text: String(heightOf(heightNode)) });
    });
  });

  it("predict-rotation never names the successor as the pivot of a delete", () => {
    const findNode = (node: AvlNode | null, key: number): AvlNode | null =>
      !node
        ? null
        : node.key === key
          ? node
          : findNode(key < node.key ? node.left : node.right, key);
    const smallest = (node: AvlNode): number => (node.left ? smallest(node.left) : node.key);
    for (const difficulty of difficulties) {
      for (const seed of seeds) {
        const question = generate("predict-rotation", { seed, difficulty });
        const deleted = /^Delete (\d+) from/.exec(question.prompt)?.[1];
        if (deleted === undefined || question.answer.type !== "predict_rotation") continue;
        const node = findNode(requireTree(question.tree), Number(deleted));
        if (node?.left && node.right) {
          expect(question.answer.pivotKey).not.toBe(smallest(node.right));
        }
      }
    }
  });

  it("delete-result explains a pivot that took the deleted node's place", () => {
    const smallest = (node: AvlNode): number => (node.left ? smallest(node.left) : node.key);
    const findNode = (node: AvlNode | null, key: number): AvlNode | null =>
      !node
        ? null
        : node.key === key
          ? node
          : findNode(key < node.key ? node.left : node.right, key);
    let replaced = 0;
    for (const seed of seeds) {
      const question = generate("delete-result", { seed, difficulty: 5 });
      const deleted = Number(/^Delete (\d+) from/.exec(question.prompt)?.[1]);
      const node = findNode(requireTree(question.tree), deleted);
      const successor = node?.right ? smallest(node.right) : null;
      expect(question.explanation).not.toContain(`Node ${successor} is`);
      if (question.explanation.includes("took")) replaced += 1;
    }
    expect(replaced).toBeGreaterThan(0);
  });

  it("predict-rotation only asks about inserts when told to", () => {
    for (const difficulty of difficulties) {
      for (const seed of seeds) {
        const question = generate("predict-rotation", { seed, difficulty, operation: "insert" });
        expect(question.replay).toMatchObject({ operation: "insert" });
        expect(question.prompt.startsWith("Insert ")).toBe(true);
      }
    }
  });

  it("predict-rotation hints for deletes never reveal the pivot or the rotation", () => {
    for (const difficulty of difficulties) {
      for (const seed of seeds) {
        expectHintsHideRotation(
          generate("predict-rotation", { seed, difficulty, operation: "delete" }),
        );
      }
    }
  });

  it("is-avl hints are the same for valid and invalid trees", () => {
    const hints = new Set<string>();
    for (const seed of seeds) {
      for (const difficulty of difficulties) {
        hints.add(JSON.stringify(generate("is-avl", { seed, difficulty }).hints));
      }
    }
    expect(hints.size).toBe(1);
  });

  it("rotation hints never reveal the pivot or the rotation", () => {
    for (const key of ["insert-result", "delete-result", "predict-rotation"] as const) {
      everyCase(key, (difficulty, seed) => {
        expectHintsHideRotation(generate(key, { seed, difficulty }));
      });
    }
  });

  it("predict-rotation only asks about deletes when told to", () => {
    for (const difficulty of difficulties) {
      for (const seed of seeds) {
        const question = generate("predict-rotation", { seed, difficulty, operation: "delete" });
        expect(question.replay).toMatchObject({ operation: "delete" });
        expect(question.prompt.startsWith("Delete ")).toBe(true);
      }
    }
  });

  it("traversal-order never reveals every key in its last hint", () => {
    for (const difficulty of difficulties) {
      for (const seed of seeds) {
        const question = generate("traversal-order", { seed, difficulty });
        const revealed = /starts with ([\d,]+)\./.exec(question.hints[2] ?? "")?.[1] ?? "";
        expect(revealed.split(",").length).toBeLessThan(nodeKeys(question.tree).length);
      }
    }
  });

  it("balance-factor can answer 0 from difficulty 2 and 2 or -2 at difficulty 5", () => {
    const answers = (difficulty: Difficulty) =>
      new Set(
        seeds.map((seed) => {
          const question = generate("balance-factor", { seed, difficulty });
          return question.answer.type === "text" ? question.answer.text : "";
        }),
      );
    expect(answers(2).has("0")).toBe(true);
    const hardest = answers(5);
    expect(hardest.has("2") || hardest.has("-2")).toBe(true);
  });

  it("is-avl marks the correct option", () => {
    everyCase("is-avl", (difficulty, seed) => {
      const question = generate("is-avl", { seed, difficulty });
      const answer = question.answer.type === "multiple_choice" ? question.answer.optionId : null;
      const chosen = question.options?.find((option) => option.id === answer);
      expect(chosen?.text.startsWith("Yes")).toBe(isAvl(requireTree(question.tree)));
    });
  });
});

describe("bst-shaped questions", () => {
  const bstKeys = ["traversal-order", "height"] as const;

  it.each(bstKeys)("%s builds plain search trees that are not always balanced", (key) => {
    const trees = difficulties.flatMap((difficulty) =>
      seeds.map((seed) => requireTree(generate(key, { seed, difficulty, shape: "bst" }).tree)),
    );
    for (const tree of trees) {
      const keysInOrder = toKeys(tree);
      expect(keysInOrder).toEqual([...keysInOrder].sort((left, right) => left - right));
      expect(heightOf(tree)).toBeLessThanOrEqual(Math.ceil(Math.log2(keysInOrder.length + 1)) + 2);
    }
    expect(trees.some((tree) => !isAvl(tree))).toBe(true);
  });

  it.each(bstKeys)("%s still builds avl trees when no shape is given", (key) => {
    everyCase(key, (difficulty, seed) => {
      expect(isAvl(requireTree(generate(key, { seed, difficulty }).tree))).toBe(true);
    });
  });
});

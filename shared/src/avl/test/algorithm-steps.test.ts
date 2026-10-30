import { describe, expect, it } from "vitest";

import {
  type AvlNode,
  algorithmCodes,
  insertKey,
  isAlgorithmCode,
  type StepKey,
  stepKeysByAlgorithm,
  type TraversalOrder,
  toKeys,
  traceInsert,
  traceRemove,
  traceRotateLeft,
  traceRotateRight,
  traceSearch,
  traceTraversal,
} from "@shared/avl";

const traversalOrders: TraversalOrder[] = ["preorder", "inorder", "postorder", "levelorder"];

describe("stepKeysByAlgorithm", () => {
  it("lists step keys for every algorithm", () => {
    expect(Object.keys(stepKeysByAlgorithm).sort()).toEqual([...algorithmCodes].sort());
  });

  it.each(algorithmCodes)("prefixes every %s key with its algorithm code", (code) => {
    for (const stepKey of stepKeysByAlgorithm[code]) {
      expect(stepKey.startsWith(`${code}.`)).toBe(true);
    }
  });

  it("never repeats a step key", () => {
    const stepKeys = Object.values(stepKeysByAlgorithm).flat();
    expect(new Set(stepKeys).size).toBe(stepKeys.length);
  });

  it("has an algorithm for every traversal order", () => {
    for (const order of traversalOrders) expect(isAlgorithmCode(order)).toBe(true);
    expect(isAlgorithmCode("bubble-sort")).toBe(false);
  });

  it("is emitted in full by the engine, so no key is dead", () => {
    let seed = 11;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const emitted = new Set<StepKey>();
    const record = (steps: { stepKey: StepKey }[]) => {
      for (const step of steps) emitted.add(step.stepKey);
    };
    let root: AvlNode | null = null;
    for (const order of traversalOrders) record(traceTraversal(root, order).steps);
    for (let round = 0; round < 400; round += 1) {
      const key = Math.floor(random() * 40);
      const operation = random();
      if (operation < 0.5) {
        const traced = traceInsert(root, key);
        record(traced.steps);
        root = traced.result;
      } else if (operation < 0.8) {
        const traced = traceRemove(root, key);
        record(traced.steps);
        root = traced.result;
      } else {
        record(traceSearch(root, key).steps);
      }
    }
    for (const key of toKeys(root)) {
      record(traceRotateLeft(root, key).steps);
      record(traceRotateRight(root, key).steps);
    }
    for (const order of traversalOrders) record(traceTraversal(root, order).steps);
    record(traceRotateLeft(insertKey(null, 1), 1).steps);
    record(traceRotateRight(insertKey(null, 1), 1).steps);

    const catalogued = Object.values(stepKeysByAlgorithm).flat();
    expect(catalogued.filter((stepKey) => !emitted.has(stepKey))).toEqual([]);
  });
});

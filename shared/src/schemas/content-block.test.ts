import { describe, expect, it } from "vitest";

import { contentBlockBodySchema, treeKeysSchema } from "@shared/schemas/content-block";

describe("treeKeysSchema", () => {
  it("rejects duplicate keys", () => {
    expect(treeKeysSchema.safeParse([10, 20, 10]).success).toBe(false);
  });
});

describe("contentBlockBodySchema", () => {
  it("parses a text block", () => {
    const result = contentBlockBodySchema.parse({
      type: "text",
      body: { markdown: "AVL trees stay balanced." },
    });
    expect(result.type).toBe("text");
  });

  it("parses a diagram block", () => {
    const result = contentBlockBodySchema.parse({
      type: "diagram",
      body: {
        startingKeys: [20, 10, 30],
        highlights: [{ key: 10, state: "active" }],
        caption: "Inserting 10",
      },
    });
    expect(result.type).toBe("diagram");
  });

  it("parses an animation block", () => {
    const result = contentBlockBodySchema.parse({
      type: "animation",
      body: {
        startingKeys: [20, 10, 30],
        steps: [{ operation: "insert", key: 25 }],
        autoplay: false,
      },
    });
    expect(result.type).toBe("animation");
  });

  it("parses a playground block", () => {
    const result = contentBlockBodySchema.parse({
      type: "playground",
      body: {
        startingKeys: [20, 10, 30],
        allowedOperations: ["insert", "delete"],
        instructions: "Insert 25 and keep the tree balanced.",
        goal: { kind: "containsKeys", keys: [25] },
      },
    });
    expect(result.type).toBe("playground");
  });

  it("parses a code trace block", () => {
    const result = contentBlockBodySchema.parse({
      type: "code_trace",
      body: {
        algorithmCode: "insert",
        startingKeys: [20, 10, 30],
        operation: { operation: "insert", key: 25 },
      },
    });
    expect(result.type).toBe("code_trace");
  });

  it("rejects a body that doesn't match its type", () => {
    const result = contentBlockBodySchema.safeParse({
      type: "text",
      body: {
        startingKeys: [20, 10, 30],
        allowedOperations: ["insert"],
        instructions: "Not a text body",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty allowedOperations list", () => {
    const result = contentBlockBodySchema.safeParse({
      type: "playground",
      body: {
        startingKeys: [20, 10, 30],
        allowedOperations: [],
        instructions: "Insert 25 and keep the tree balanced.",
      },
    });
    expect(result.success).toBe(false);
  });
});

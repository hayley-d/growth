import { describe, expect, it } from "vitest";

import { makeListAlgorithms } from "@/application/course-content/queries/list-algorithms";
import type { Algorithm } from "@/domain/course-content/algorithm";

const algorithm = (code: string, name: string): Algorithm => ({ id: `${code}-id`, code, name });

describe("makeListAlgorithms", () => {
  it("lists the algorithms in the order the engine teaches them, without ids", async () => {
    const listAlgorithms = makeListAlgorithms({
      algorithmRepository: {
        listAll: async () => [
          algorithm("search", "Search"),
          algorithm("levelorder", "Level-order traversal"),
          algorithm("insert", "Insert"),
        ],
      },
    });

    await expect(listAlgorithms()).resolves.toEqual({
      data: {
        algorithms: [
          { code: "insert", name: "Insert" },
          { code: "search", name: "Search" },
          { code: "levelorder", name: "Level-order traversal" },
        ],
      },
    });
  });

  it("puts an algorithm the engine doesn't know at the end", async () => {
    const listAlgorithms = makeListAlgorithms({
      algorithmRepository: {
        listAll: async () => [
          algorithm("bubble-sort", "Bubble sort"),
          algorithm("delete", "Delete"),
        ],
      },
    });

    const response = await listAlgorithms();
    expect(response.data.algorithms.map((item) => item.code)).toEqual(["delete", "bubble-sort"]);
  });
});

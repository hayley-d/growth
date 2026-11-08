import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { checkContent } from "@/infrastructure/course-content/content/check-content";
import { readContent } from "@/infrastructure/course-content/content/read-content";

const contentRoot = fileURLToPath(new URL("../../../../../prisma/content", import.meta.url));

describe("prisma/content", () => {
  it("loads with no problems", async () => {
    expect(checkContent(await readContent(contentRoot), { complete: false }).problems).toEqual([]);
  });
});

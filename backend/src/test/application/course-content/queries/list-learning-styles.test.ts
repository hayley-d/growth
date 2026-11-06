import { describe, expect, it } from "vitest";

import { makeListLearningStyles } from "@/application/course-content/queries/list-learning-styles";

describe("makeListLearningStyles", () => {
  it("lists the learning styles", async () => {
    const learningStyle = {
      id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
      name: "Visual",
      description: "Pictures and diagrams",
    };
    const listLearningStyles = makeListLearningStyles({
      learningStyleRepository: { listAll: async () => [learningStyle] },
    });
    await expect(listLearningStyles()).resolves.toEqual({
      data: { learningStyles: [learningStyle] },
    });
  });
});

import { describe, expect, it, vi } from "vitest";

import { makeUnlockLessons } from "@/application/learning-path/commands/unlock-lessons";
import { NotFoundError } from "@/domain/errors";
import type { User } from "@/domain/user/user";
import { createAccessDependencies, userId } from "@/test/application/lesson/lesson-fakes";

const email = "learner@example.com";

const createUnlockLessons = (user: Pick<User, "id"> | null = { id: userId }) => {
  const completeAll = vi.fn().mockResolvedValue(undefined);
  const unlockLessons = makeUnlockLessons({
    userRepository: {
      findByEmail: async (searched) => (searched === email && user ? (user as User) : null),
    },
    lessonRepository: createAccessDependencies().lessonRepository,
    lessonProgressRepository: { completeAll },
  });
  return { unlockLessons, completeAll };
};

describe("makeUnlockLessons", () => {
  it("completes the lessons before the last one it opens", async () => {
    const { unlockLessons, completeAll } = createUnlockLessons();
    await expect(unlockLessons({ email, count: 3 })).resolves.toEqual({ unlocked: 3, total: 3 });
    expect(completeAll).toHaveBeenCalledWith(userId, ["lesson-1", "lesson-2"], expect.any(Date));
  });

  it("writes nothing for one lesson, because the first is always open", async () => {
    const { unlockLessons, completeAll } = createUnlockLessons();
    await expect(unlockLessons({ email, count: 1 })).resolves.toEqual({ unlocked: 1, total: 3 });
    expect(completeAll).not.toHaveBeenCalled();
  });

  it("stops at the last lesson when the count is too big", async () => {
    const { unlockLessons, completeAll } = createUnlockLessons();
    await expect(unlockLessons({ email, count: 50 })).resolves.toEqual({ unlocked: 3, total: 3 });
    expect(completeAll).toHaveBeenCalledWith(userId, ["lesson-1", "lesson-2"], expect.any(Date));
  });

  it("rejects an email with no user without writing", async () => {
    const { unlockLessons, completeAll } = createUnlockLessons(null);
    await expect(unlockLessons({ email, count: 2 })).rejects.toBeInstanceOf(NotFoundError);
    expect(completeAll).not.toHaveBeenCalled();
  });
});

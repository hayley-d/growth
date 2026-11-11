import { describe, expect, it } from "vitest";

import { toKeys } from "@shared/avl";
import {
  createSession,
  maxLogEntries,
  playgroundReducer,
} from "@/lib/playground/playground-reducer";
import type { PlaygroundSetup } from "@/lib/playground/setup";

const avl: PlaygroundSetup = {
  topic: "avl",
  traversal: "inorder",
  explore: "watch",
  start: "empty",
  seed: 4,
};
const walk: PlaygroundSetup = {
  topic: "traversal",
  traversal: "inorder",
  explore: "interact",
  start: "small",
  seed: 4,
};

describe("playgroundReducer", () => {
  it("runs a typed command and logs it", () => {
    const session = playgroundReducer(createSession(avl), {
      type: "command",
      text: "insert 5",
      via: "typed",
    });
    expect(toKeys(session.tree)).toEqual([5]);
    expect(session.run?.label).toBe("Insert 5");
    expect(session.log).toEqual([
      expect.objectContaining({
        command: "insert 5",
        tone: "good",
        via: "typed",
        replayable: true,
      }),
    ]);
  });

  it("logs a blocked command without changing the tree", () => {
    const session = playgroundReducer(createSession(avl), {
      type: "command",
      text: "inorder",
      via: "typed",
    });
    expect(session.tree).toBeNull();
    expect(session.notice?.tone).toBe("bad");
    expect(session.log[0]?.replayable).toBe(false);
  });

  it("gives each run its own id so the player restarts", () => {
    let session = playgroundReducer(createSession(avl), {
      type: "command",
      text: "insert 5",
      via: "typed",
    });
    const first = session.run?.id;
    session = playgroundReducer(session, { type: "command", text: "search 5", via: "typed" });
    expect(session.run?.id).not.toBe(first);
  });

  it("drops the run when a command fails or a drop is refused", () => {
    const searched = playgroundReducer(
      playgroundReducer(createSession(avl), { type: "command", text: "insert 5", via: "typed" }),
      { type: "command", text: "search 5", via: "typed" },
    );
    expect(searched.run).not.toBeNull();
    expect(
      playgroundReducer(searched, { type: "command", text: "foo", via: "typed" }).run,
    ).toBeNull();
    expect(
      playgroundReducer(searched, { type: "command", text: "delete 9", via: "typed" }).run,
    ).toBeNull();
    expect(
      playgroundReducer(searched, {
        type: "refuse",
        command: "insert 3",
        message: "No.",
        via: "dragged",
      }).run,
    ).toBeNull();
  });

  it("replays a logged command", () => {
    let session = playgroundReducer(createSession(avl), {
      type: "command",
      text: "insert 5",
      via: "typed",
    });
    session = playgroundReducer(session, { type: "command", text: "delete 5", via: "dragged" });
    const insert = session.log[0];
    session = playgroundReducer(session, { type: "replay", id: insert?.id ?? 0 });
    expect(toKeys(session.tree)).toEqual([5]);
  });

  it("logs a reply as information that can't be replayed", () => {
    const session = playgroundReducer(createSession(avl), {
      type: "reply",
      command: "help",
      message: "Here you can use insert n.",
      via: "typed",
    });
    expect(session.notice).toEqual({ tone: "info", message: "Here you can use insert n." });
    expect(session.log[0]).toMatchObject({ command: "help", tone: "info", replayable: false });
  });

  it("keeps the log short", () => {
    let session = createSession(avl);
    for (let index = 0; index < maxLogEntries + 5; index += 1) {
      session = playgroundReducer(session, { type: "command", text: "help", via: "typed" });
    }
    expect(session.log).toHaveLength(maxLogEntries);
  });

  it("grows a new tree from the next seed", () => {
    const start = createSession(walk);
    const session = playgroundReducer(start, { type: "new-tree" });
    expect(session.seed).toBe(5);
    expect(toKeys(session.tree)).toHaveLength(5);
  });

  it("builds and checks a prediction", () => {
    let session = createSession(walk);
    const keys = toKeys(session.tree);
    for (const key of keys) session = playgroundReducer(session, { type: "predict-add", key });
    session = playgroundReducer(session, { type: "predict-add", key: keys[0] ?? 0 });
    expect(session.prediction).toEqual(keys);
    expect(session.notice?.tone).toBe("warn");
    session = playgroundReducer(session, { type: "predict-check" });
    expect(session.marks?.every(Boolean)).toBe(true);
    expect(session.run?.walk).toEqual(keys);
    session = playgroundReducer(session, { type: "predict-undo" });
    expect(session.prediction).toHaveLength(keys.length - 1);
    expect(session.marks).toBeNull();
  });

  it("runs a typed command through the same setup check as text", () => {
    const interact: PlaygroundSetup = { ...avl, explore: "interact" };
    let session = playgroundReducer(createSession(interact), {
      type: "run",
      command: { kind: "insert", keys: [5] },
      via: "dragged",
    });
    expect(toKeys(session.tree)).toEqual([5]);
    expect(session.log.at(-1)).toMatchObject({ command: "insert 5", via: "dragged" });

    session = playgroundReducer(createSession(avl), {
      type: "run",
      command: { kind: "rotate", direction: "left", key: 5 },
      via: "dragged",
    });
    expect(session.notice?.tone).toBe("bad");
  });

  it("logs a walk check as tapped", () => {
    let session = createSession(walk);
    const [first] = toKeys(session.tree);
    session = playgroundReducer(session, { type: "predict-add", key: first ?? 0 });
    session = playgroundReducer(session, { type: "predict-check" });
    expect(session.log.at(-1)?.via).toBe("tapped");
  });
});

import { afterEach, expect, it, vi } from "vitest";

import { speak } from "@/lib/speak";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("does nothing where speech isn't supported", () => {
  vi.stubGlobal("window", {});
  expect(() => speak("hello")).not.toThrow();
});

it("stops what it was saying and reads the new text", () => {
  const cancel = vi.fn();
  const speakUtterance = vi.fn();
  vi.stubGlobal("window", { speechSynthesis: { cancel, speak: speakUtterance } });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(readonly text: string) {}
    },
  );

  speak("hello");

  expect(cancel).toHaveBeenCalledOnce();
  expect(speakUtterance).toHaveBeenCalledWith(expect.objectContaining({ text: "hello" }));
});

import { afterEach, expect, it, vi } from "vitest";

import { isSpeechSupported, speakAll, stopSpeaking } from "@/lib/speech";

type FakeUtterance = { text: string; onend?: () => void; onerror?: () => void };

const stubSpeech = () => {
  const spoken: FakeUtterance[] = [];
  const cancel = vi.fn();
  class Utterance {
    onend?: () => void;
    onerror?: () => void;
    constructor(readonly text: string) {}
  }
  vi.stubGlobal("window", {
    speechSynthesis: { cancel, speak: (utterance: FakeUtterance) => spoken.push(utterance) },
    SpeechSynthesisUtterance: Utterance,
  });
  return { spoken, cancel };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

it("knows when speech isn't there", () => {
  vi.stubGlobal("window", {});

  expect(isSpeechSupported()).toBe(false);
  const done = vi.fn();
  speakAll(["hello"], done);
  expect(done).toHaveBeenCalledOnce();
  expect(() => stopSpeaking()).not.toThrow();
});

it("reads every text in order and calls back after the last one", () => {
  const { spoken, cancel } = stubSpeech();
  const done = vi.fn();

  speakAll(["First.", "  ", "Second."], done);

  expect(cancel).toHaveBeenCalledOnce();
  expect(spoken.map((utterance) => utterance.text)).toEqual(["First.", "Second."]);
  spoken[0]?.onend?.();
  expect(done).not.toHaveBeenCalled();
  spoken[1]?.onend?.();
  expect(done).toHaveBeenCalledOnce();
});

it("calls back straight away when there's nothing to read", () => {
  const { spoken } = stubSpeech();
  const done = vi.fn();

  speakAll(["", " "], done);

  expect(spoken).toEqual([]);
  expect(done).toHaveBeenCalledOnce();
});

it("stops speaking", () => {
  const { cancel } = stubSpeech();

  stopSpeaking();

  expect(cancel).toHaveBeenCalledOnce();
});

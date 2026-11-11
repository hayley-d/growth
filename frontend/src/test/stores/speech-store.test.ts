import { beforeEach, expect, it, vi } from "vitest";

import { speakAll, stopSpeaking } from "@/lib/speech";
import { useSpeechStore } from "@/stores/speech-store";

vi.mock("@/lib/speech", () => ({
  speakAll: vi.fn(),
  stopSpeaking: vi.fn(),
}));

const mockedSpeakAll = vi.mocked(speakAll);

beforeEach(() => {
  mockedSpeakAll.mockReset();
  useSpeechStore.setState({ speakingId: null });
});

it("marks what it's reading until it finishes", () => {
  useSpeechStore.getState().start("step-1", ["Hello."]);

  expect(useSpeechStore.getState().speakingId).toBe("step-1");
  expect(mockedSpeakAll).toHaveBeenCalledWith(["Hello."], expect.any(Function));
  mockedSpeakAll.mock.calls[0]?.[1]();
  expect(useSpeechStore.getState().speakingId).toBeNull();
});

it("stops and clears what it was reading", () => {
  useSpeechStore.getState().start("step-1", ["Hello."]);
  useSpeechStore.getState().stop();

  expect(stopSpeaking).toHaveBeenCalled();
  expect(useSpeechStore.getState().speakingId).toBeNull();
});

it("ignores the end of an older reading", () => {
  useSpeechStore.getState().start("step-1", ["Hello."]);
  useSpeechStore.getState().start("step-2", ["Bye."]);
  mockedSpeakAll.mock.calls[0]?.[1]();

  expect(useSpeechStore.getState().speakingId).toBe("step-2");
});

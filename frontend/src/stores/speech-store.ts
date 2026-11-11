import { create } from "zustand";

import { speakAll, stopSpeaking } from "@/lib/speech";

type SpeechState = {
  speakingId: string | null;
  start: (id: string, texts: readonly string[]) => void;
  stop: () => void;
};

let currentRun = 0;

export const useSpeechStore = create<SpeechState>()((set) => ({
  speakingId: null,
  start: (id, texts) => {
    currentRun += 1;
    const run = currentRun;
    set({ speakingId: id });
    speakAll(texts, () => {
      if (run === currentRun) set({ speakingId: null });
    });
  },
  stop: () => {
    currentRun += 1;
    stopSpeaking();
    set({ speakingId: null });
  },
}));

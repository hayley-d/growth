import { create } from "zustand";

type WritingState = {
  written: Record<string, string>;
  write: (id: string, text: string) => void;
};

export const useWritingStore = create<WritingState>()((set) => ({
  written: {},
  write: (id, text) => set((state) => ({ written: { ...state.written, [id]: text } })),
}));

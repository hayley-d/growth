import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type ColourScheme, isColourScheme } from "@/lib/colour-schemes";

type ColourSchemeState = {
  colourScheme: ColourScheme;
  setColourScheme: (colourScheme: ColourScheme) => void;
};

export function mergeStoredColourScheme(
  persistedState: unknown,
  currentState: ColourSchemeState,
): ColourSchemeState {
  const stored = (persistedState as { colourScheme?: unknown } | undefined)?.colourScheme;
  return isColourScheme(stored) ? { ...currentState, colourScheme: stored } : currentState;
}

export const useColourSchemeStore = create<ColourSchemeState>()(
  persist(
    (set) => ({
      colourScheme: "default",
      setColourScheme: (colourScheme) => set({ colourScheme }),
    }),
    {
      name: "growth-colour-scheme",
      partialize: (state) => ({ colourScheme: state.colourScheme }),
      merge: mergeStoredColourScheme,
    },
  ),
);

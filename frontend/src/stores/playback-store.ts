import { create } from "zustand";
import { persist } from "zustand/middleware";

export const playbackSpeeds = [0.5, 1, 2] as const;

export type PlaybackSpeed = (typeof playbackSpeeds)[number];

export const isPlaybackSpeed = (value: unknown): value is PlaybackSpeed =>
  playbackSpeeds.some((speed) => speed === value);

type PlaybackState = {
  speed: PlaybackSpeed;
  setSpeed: (speed: PlaybackSpeed) => void;
};

export function mergeStoredPlaybackSpeed(
  persistedState: unknown,
  currentState: PlaybackState,
): PlaybackState {
  const stored = (persistedState as { speed?: unknown } | undefined)?.speed;
  return isPlaybackSpeed(stored) ? { ...currentState, speed: stored } : currentState;
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set) => ({
      speed: 1,
      setSpeed: (speed) => set({ speed }),
    }),
    {
      name: "growth-playback-speed",
      partialize: (state) => ({ speed: state.speed }),
      merge: mergeStoredPlaybackSpeed,
    },
  ),
);

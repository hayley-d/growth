import { beforeEach, expect, it } from "vitest";

import { mergeStoredColourScheme, useColourSchemeStore } from "@/stores/colour-scheme-store";

beforeEach(() => {
  useColourSchemeStore.setState({ colourScheme: "default" });
});

it("starts on the default scheme", () => {
  expect(useColourSchemeStore.getState().colourScheme).toBe("default");
});

it("changes the scheme", () => {
  useColourSchemeStore.getState().setColourScheme("okabe-ito");

  expect(useColourSchemeStore.getState().colourScheme).toBe("okabe-ito");
});

it("only restores a known saved scheme", () => {
  const current = useColourSchemeStore.getState();

  expect(mergeStoredColourScheme({ colourScheme: "rainbow" }, current).colourScheme).toBe(
    "default",
  );
  expect(mergeStoredColourScheme(undefined, current).colourScheme).toBe("default");
  expect(mergeStoredColourScheme({ colourScheme: "high-contrast" }, current).colourScheme).toBe(
    "high-contrast",
  );
});

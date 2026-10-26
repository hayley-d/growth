import { applyColourScheme } from "@/lib/colour-schemes";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";

export function syncColourScheme() {
  applyColourScheme(useColourSchemeStore.getState().colourScheme);
  return useColourSchemeStore.subscribe((state) => applyColourScheme(state.colourScheme));
}

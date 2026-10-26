export const colourSchemes = [
  {
    id: "default",
    label: "Default",
    description: "Teal, pink and lime, the standard Growth colours.",
  },
  {
    id: "high-contrast",
    label: "High contrast",
    description: "Stronger text, borders and focus rings for low vision.",
  },
  {
    id: "okabe-ito",
    label: "Colour-blind friendly",
    description: "Okabe-Ito colours that stay distinct with every common kind of colour blindness.",
  },
] as const;

export type ColourScheme = (typeof colourSchemes)[number]["id"];

export function isColourScheme(value: unknown): value is ColourScheme {
  return colourSchemes.some((scheme) => scheme.id === value);
}

export function applyColourScheme(scheme: ColourScheme) {
  document.documentElement.dataset.colourScheme = scheme;
}

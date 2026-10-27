import { type ColourTheme, colourThemeSchema } from "@shared/schemas/user";

export type ColourScheme = ColourTheme;

const colourSchemeDetails: Record<ColourScheme, { label: string; description: string }> = {
  default: {
    label: "Default",
    description: "Teal, pink and lime, the standard Growth colours.",
  },
  "high-contrast": {
    label: "High contrast",
    description: "Stronger text, borders and focus rings for low vision.",
  },
  "okabe-ito": {
    label: "Colour-blind friendly",
    description: "Okabe-Ito colours that stay distinct with every common kind of colour blindness.",
  },
};

export const colourSchemes = colourThemeSchema.options.map((id) => ({
  id,
  ...colourSchemeDetails[id],
}));

export function isColourScheme(value: unknown): value is ColourScheme {
  return colourThemeSchema.safeParse(value).success;
}

export function applyColourScheme(scheme: ColourScheme) {
  document.documentElement.dataset.colourScheme = scheme;
}

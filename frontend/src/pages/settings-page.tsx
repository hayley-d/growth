import { ColourSchemePicker } from "@/components/molecules/colour-scheme-picker";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";

export function SettingsPage() {
  const colourScheme = useColourSchemeStore((state) => state.colourScheme);
  const setColourScheme = useColourSchemeStore((state) => state.setColourScheme);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Make Growth work the way you see best.</p>
      </div>
      <section aria-labelledby="colour-scheme" className="flex max-w-2xl flex-col gap-3">
        <div>
          <h2 id="colour-scheme" className="text-lg font-semibold">
            Colour scheme
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick the colours that are easiest for you to tell apart. Saved on this device.
          </p>
        </div>
        <ColourSchemePicker value={colourScheme} onChange={setColourScheme} />
      </section>
    </div>
  );
}
